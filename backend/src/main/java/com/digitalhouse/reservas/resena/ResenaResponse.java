package com.digitalhouse.reservas.resena;

import java.time.LocalDateTime;

public record ResenaResponse(
        Long id,
        Integer puntuacion,
        String comentario,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String usuarioNombre,
        String usuarioApellido
) {
    public static ResenaResponse fromEntity(Resena r) {
        return new ResenaResponse(
                r.getId(),
                r.getPuntuacion(),
                r.getComentario(),
                r.getCreatedAt(),
                r.getUpdatedAt(),
                r.getUsuario().getNombre(),
                r.getUsuario().getApellido()
        );
    }
}