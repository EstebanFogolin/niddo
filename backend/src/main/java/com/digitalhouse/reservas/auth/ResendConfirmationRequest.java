package com.digitalhouse.reservas.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendConfirmationRequest {

    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "Formato de email invalido.")
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
