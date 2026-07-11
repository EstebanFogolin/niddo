package com.digitalhouse.reservas.producto;

import java.util.List;
import java.util.Map;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        Map<String, Object> categoria,
        List<String> imagenes,
        List<Map<String, Object>> caracteristicas
) {
    public static ProductoResponse fromEntity(Producto producto) {
        List<Map<String, Object>> caracs = producto.getCaracteristicas()
                .stream()
                .map(c -> Map.<String, Object>of(
                        "id", c.getId(),
                        "nombre", c.getNombre(),
                        "icono", c.getIcono()
                ))
                .toList();

        Map<String, Object> cat = producto.getCategoria() != null
                ? Map.<String, Object>of(
                        "id", producto.getCategoria().getId(),
                        "titulo", producto.getCategoria().getTitulo(),
                        "descripcion", producto.getCategoria().getDescripcion(),
                        "imagenUrl", producto.getCategoria().getImagenUrl()
                )
                : null;

        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                cat,
                producto.getImagenes(),
                caracs
        );
    }
}
