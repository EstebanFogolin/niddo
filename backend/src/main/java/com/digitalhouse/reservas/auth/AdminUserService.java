package com.digitalhouse.reservas.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UsuarioRepository usuarioRepository;

    public AdminUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UsuarioResponse alternarRol(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Usuario no encontrado."));

        usuario.setRole(usuario.getRole().equals("ADMIN") ? "USER" : "ADMIN");
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }
}
