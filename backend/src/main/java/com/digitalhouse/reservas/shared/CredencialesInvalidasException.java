package com.digitalhouse.reservas.shared;

public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException() {
        super("Email o contrasena incorrectos.");
    }
}
