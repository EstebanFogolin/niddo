package com.digitalhouse.reservas.shared;

public class NombreCaracteristicaDuplicadoException extends RuntimeException {

    public NombreCaracteristicaDuplicadoException(String mensaje) {
        super(mensaje);
    }

    public NombreCaracteristicaDuplicadoException() {
        super("Ya existe una caracteristica con ese nombre.");
    }
}