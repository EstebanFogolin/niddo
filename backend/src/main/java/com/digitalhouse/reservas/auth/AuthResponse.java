package com.digitalhouse.reservas.auth;

public class AuthResponse {

    private String token;
    private String nombre;
    private String apellido;
    private String email;
    private String role;

    public AuthResponse(String token, String nombre, String apellido, String email, String role) {
        this.token = token;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
