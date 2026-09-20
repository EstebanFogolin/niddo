package com.digitalhouse.reservas.reserva;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponse(
    Long id,
    Long productoId,
    String productoNombre,
    String productoImagen,
    String productoCategoria,
    LocalDate fechaInicio,
    LocalDate fechaFin,
    Reserva.Estado estado,
    LocalDateTime createdAt
) {
    public static ReservaResponse fromEntity(Reserva r) {
        String primeraImagen = r.getProducto().getImagenes() != null && !r.getProducto().getImagenes().isEmpty()
            ? r.getProducto().getImagenes().get(0)
            : null;
        String categoria = r.getProducto().getCategoria() != null
            ? r.getProducto().getCategoria().getTitulo()
            : null;
        return new ReservaResponse(
            r.getId(),
            r.getProducto().getId(),
            r.getProducto().getNombre(),
            primeraImagen,
            categoria,
            r.getFechaInicio(),
            r.getFechaFin(),
            r.getEstado(),
            r.getCreatedAt()
        );
    }
}