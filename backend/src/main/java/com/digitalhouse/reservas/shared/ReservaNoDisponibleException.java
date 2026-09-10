package com.digitalhouse.reservas.shared;

public class ReservaNoDisponibleException extends RuntimeException {

    public ReservaNoDisponibleException(String mensaje) {
        super(mensaje);
    }

    public ReservaNoDisponibleException() {
        super("El producto no esta disponible en esas fechas.");
    }
}