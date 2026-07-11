package com.digitalhouse.reservas.categoria;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Categoria no encontrada."));
    }

    public Categoria crear(String titulo, String descripcion, String imagenUrl) {
        Categoria categoria = new Categoria(titulo.trim(), descripcion.trim(), imagenUrl.trim());
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, String titulo, String descripcion, String imagenUrl) {
        Categoria categoria = obtenerPorId(id);
        if (titulo != null && !titulo.isBlank()) categoria.setTitulo(titulo.trim());
        if (descripcion != null && !descripcion.isBlank()) categoria.setDescripcion(descripcion.trim());
        if (imagenUrl != null && !imagenUrl.isBlank()) categoria.setImagenUrl(imagenUrl.trim());
        return categoriaRepository.save(categoria);
    }

    public void eliminar(Long id) {
        Categoria categoria = obtenerPorId(id);
        categoriaRepository.delete(categoria);
    }
}
