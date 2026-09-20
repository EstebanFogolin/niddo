package com.digitalhouse.reservas.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoResponse> listar(
            Authentication authentication,
            @RequestParam(required = false) List<Long> categoriaIds,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin
    ) {
        if (fechaInicio != null && !fechaInicio.isBlank() && fechaFin != null && !fechaFin.isBlank()) {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFin);
            return productoService.listarDisponibles(categoriaIds, q, extractUsuarioId(authentication), inicio, fin);
        }
        if (q != null && !q.isBlank()) {
            return productoService.buscar(q);
        }
        return productoService.listar(categoriaIds);
    }

    private static Long extractUsuarioId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Long id) {
            return id;
        }
        return null;
    }

    @GetMapping("/{id:\\d+}")
    public ProductoResponse obtener(@PathVariable Long id) {
        return productoService.obtenerPorId(id);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponse crear(
            @RequestParam @NotBlank String nombre,
            @RequestParam @NotBlank String descripcion,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam("imagenes") @NotEmpty MultipartFile[] imagenes,
            @RequestParam(required = false) List<Long> caracteristicas,
            @RequestParam(required = false) String contactoEmail,
            @RequestParam(required = false) String contactoTelefono
    ) {
        return productoService.crear(nombre, descripcion, categoriaId, imagenes, caracteristicas, contactoEmail, contactoTelefono);
    }

    @PutMapping("/{id}")
    public ProductoResponse actualizar(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(value = "imagenes", required = false) MultipartFile[] imagenes,
            @RequestParam(required = false) List<Long> caracteristicas,
            @RequestParam(required = false) String contactoEmail,
            @RequestParam(required = false) String contactoTelefono
    ) {
        return productoService.actualizar(id, nombre, descripcion, categoriaId, imagenes, caracteristicas, contactoEmail, contactoTelefono);
    }
}
