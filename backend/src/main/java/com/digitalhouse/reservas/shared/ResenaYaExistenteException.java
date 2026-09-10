package com.digitalhouse.reservas.shared;

public class ResenaYaExistenteException extends RuntimeException {

    public ResenaYaExistenteException(String mensaje) {
        super(mensaje);
    }

    public ResenaYaExistenteException() {
        super("Ya has valorado este producto.");
    }
}