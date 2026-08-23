package com.digitalhouse.reservas.auth;

public record UsuarioResponse(
        Long id,
        String nombre,
        String apellido,
        String email,
        String role
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }
}
