package com.digitalhouse.reservas.shared;

public class ResenaNoPermitidaException extends RuntimeException {

    public ResenaNoPermitidaException(String mensaje) {
        super(mensaje);
    }

    public ResenaNoPermitidaException() {
        super("Solo puedes valorar productos de los que hayas completado una reserva.");
    }
}