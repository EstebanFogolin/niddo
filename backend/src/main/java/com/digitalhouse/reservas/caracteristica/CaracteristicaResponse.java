package com.digitalhouse.reservas.caracteristica;

public record CaracteristicaResponse(
        Long id,
        String nombre,
        String icono
) {
    public static CaracteristicaResponse fromEntity(Caracteristica caracteristica) {
        return new CaracteristicaResponse(
                caracteristica.getId(),
                caracteristica.getNombre(),
                caracteristica.getIcono()
        );
    }
}