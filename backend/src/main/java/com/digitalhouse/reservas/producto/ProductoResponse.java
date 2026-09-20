package com.digitalhouse.reservas.producto;

import com.digitalhouse.reservas.resena.Resena;
import java.util.List;
import java.util.Map;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        Map<String, Object> categoria,
        List<String> imagenes,
        List<Map<String, Object>> caracteristicas,
        Double promedioPuntuacion,
        Long totalResenas,
        Integer[] distribucionEstrellas,
        String contactoEmail,
        String contactoTelefono
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

        Double promedio = producto.getResenas() != null && !producto.getResenas().isEmpty()
                ? producto.getResenas().stream().mapToInt(Resena::getPuntuacion).average().orElse(0.0)
                : 0.0;
        Long total = producto.getResenas() != null ? (long) producto.getResenas().size() : 0L;
        Integer[] distribucion = new Integer[]{0, 0, 0, 0, 0};
        if (producto.getResenas() != null) {
            for (Resena r : producto.getResenas()) {
                int idx = r.getPuntuacion() - 1;
                if (idx >= 0 && idx < 5) {
                    distribucion[idx]++;
                }
            }
        }

        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                cat,
                producto.getImagenes(),
                caracs,
                promedio,
                total,
                distribucion,
                producto.getContactoEmail(),
                producto.getContactoTelefono()
        );
    }
}
