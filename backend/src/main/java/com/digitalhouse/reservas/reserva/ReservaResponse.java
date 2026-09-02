package com.digitalhouse.reservas.reserva;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponse(
    Long id,
    Long productoId,
    String productoNombre,
    LocalDate fechaInicio,
    LocalDate fechaFin,
    Reserva.Estado estado,
    LocalDateTime createdAt
) {
    public static ReservaResponse fromEntity(Reserva r) {
        return new ReservaResponse(
            r.getId(),
            r.getProducto().getId(),
            r.getProducto().getNombre(),
            r.getFechaInicio(),
            r.getFechaFin(),
            r.getEstado(),
            r.getCreatedAt()
        );
    }
}