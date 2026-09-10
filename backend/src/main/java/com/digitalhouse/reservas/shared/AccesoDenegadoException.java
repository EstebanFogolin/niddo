package com.digitalhouse.reservas.shared;

public class AccesoDenegadoException extends RuntimeException {

    public AccesoDenegadoException(String mensaje) {
        super(mensaje);
    }

    public AccesoDenegadoException() {
        super("Acceso denegado. No tienes permiso para realizar esta accion.");
    }
}