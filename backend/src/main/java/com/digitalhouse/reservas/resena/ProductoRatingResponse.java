package com.digitalhouse.reservas.resena;

public record ProductoRatingResponse(
        Double promedioPuntuacion,
        Long totalResenas,
        Integer[] distribucionEstrellas
) {
}