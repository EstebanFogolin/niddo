package com.digitalhouse.reservas.producto;

import java.util.List;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        String categoria,
        List<String> imagenes
) {
    public static ProductoResponse fromEntity(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getCategoria(),
                producto.getImagenes()
        );
    }
}
