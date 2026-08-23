package com.digitalhouse.reservas.shared;

public class EmailYaRegistradoException extends RuntimeException {

    public EmailYaRegistradoException() {
        super("El email ya esta registrado.");
    }
}
