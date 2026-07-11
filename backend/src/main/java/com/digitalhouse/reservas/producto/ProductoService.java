package com.digitalhouse.reservas.producto;

import com.digitalhouse.reservas.caracteristica.Caracteristica;
import com.digitalhouse.reservas.caracteristica.CaracteristicaRepository;
import com.digitalhouse.reservas.categoria.Categoria;
import com.digitalhouse.reservas.categoria.CategoriaRepository;
import com.digitalhouse.reservas.shared.NombreProductoDuplicadoException;
import com.digitalhouse.reservas.shared.StorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CaracteristicaRepository caracteristicaRepository;
    private final CategoriaRepository categoriaRepository;
    private final Path uploadPath;

    public ProductoService(
            ProductoRepository productoRepository,
            CaracteristicaRepository caracteristicaRepository,
            CategoriaRepository categoriaRepository,
            @Value("${app.upload-dir}") String uploadDir
    ) {
        this.productoRepository = productoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
        this.categoriaRepository = categoriaRepository;
        this.uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public List<ProductoResponse> listar(List<Long> categoriaIds) {
        List<Producto> productos;
        if (categoriaIds != null && !categoriaIds.isEmpty()) {
            productos = productoRepository.findByCategoriaIdIn(categoriaIds);
        } else {
            productos = productoRepository.findAll();
        }
        return productos.stream()
                .map(ProductoResponse::fromEntity)
                .toList();
    }

    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Producto no encontrado."));
        return ProductoResponse.fromEntity(producto);
    }

    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Producto no encontrado."));

        producto.getImagenes().forEach(imagenUrl -> {
            try {
                String fileName = imagenUrl.substring(imagenUrl.lastIndexOf("/") + 1);
                Path filePath = uploadPath.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException ignored) {
            }
        });

        productoRepository.deleteById(id);
    }

    public ProductoResponse actualizar(Long id, String nombre, String descripcion, Long categoriaId, MultipartFile[] imagenes, List<Long> caracteristicasIds) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Producto no encontrado."));

        if (nombre != null && !nombre.isBlank()) {
            producto.setNombre(nombre.trim());
        }
        if (descripcion != null && !descripcion.isBlank()) {
            producto.setDescripcion(descripcion.trim());
        }
        if (categoriaId != null) {
            Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Categoria no encontrada."));
            producto.setCategoria(categoria);
        }
        if (imagenes != null && imagenes.length > 0) {
            producto.getImagenes().forEach(imagenUrl -> {
                try {
                    String fileName = imagenUrl.substring(imagenUrl.lastIndexOf("/") + 1);
                    Path filePath = uploadPath.resolve(fileName).normalize();
                    Files.deleteIfExists(filePath);
                } catch (IOException ignored) {
                }
            });
            producto.setImagenes(guardarImagenes(imagenes));
        }
        if (caracteristicasIds != null) {
            List<Caracteristica> caracteristicas = caracteristicaRepository.findAllById(caracteristicasIds);
            producto.setCaracteristicas(caracteristicas);
        }

        Producto productoGuardado = productoRepository.save(producto);
        return ProductoResponse.fromEntity(productoGuardado);
    }

    public ProductoResponse crear(String nombre, String descripcion, Long categoriaId, MultipartFile[] imagenes, List<Long> caracteristicasIds) {
        if (productoRepository.existsByNombreIgnoreCase(nombre.trim())) {
            throw new NombreProductoDuplicadoException("El nombre ya esta en uso.");
        }

        Categoria categoria = null;
        if (categoriaId != null) {
            categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new java.util.NoSuchElementException("Categoria no encontrada."));
        }

        List<String> urlsImagenes = guardarImagenes(imagenes);
        Producto producto = new Producto(nombre.trim(), descripcion.trim(), categoria, urlsImagenes);

        if (caracteristicasIds != null && !caracteristicasIds.isEmpty()) {
            List<Caracteristica> caracteristicas = caracteristicaRepository.findAllById(caracteristicasIds);
            producto.setCaracteristicas(caracteristicas);
        }

        Producto productoGuardado = productoRepository.save(producto);

        return ProductoResponse.fromEntity(productoGuardado);
    }

    private List<String> guardarImagenes(MultipartFile[] imagenes) {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new StorageException("No se pudo preparar la carpeta de imagenes.");
        }

        return List.of(imagenes)
                .stream()
                .map(this::guardarImagen)
                .toList();
    }

    private String guardarImagen(MultipartFile imagen) {
        if (imagen.isEmpty()) {
            throw new StorageException("Una de las imagenes esta vacia.");
        }

        String originalName = StringUtils.cleanPath(imagen.getOriginalFilename());
        String extension = obtenerExtension(originalName);
        String fileName = UUID.randomUUID() + extension;
        Path destination = uploadPath.resolve(fileName).normalize();

        try {
            Files.copy(imagen.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/productos/" + fileName;
        } catch (IOException e) {
            throw new StorageException("No se pudo guardar la imagen.");
        }
    }

    private String obtenerExtension(String fileName) {
        int lastDot = fileName.lastIndexOf(".");
        if (lastDot == -1) {
            return "";
        }

        return fileName.substring(lastDot);
    }
}
