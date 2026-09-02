package com.digitalhouse.reservas.resena;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ResenaRequest(
        @Min(1) @Max(5) Integer puntuacion,
        @Size(max = 2000) String comentario
) {
}