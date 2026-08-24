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
        System.out.println("[AdminUserService] listar called");
        try {
            List<UsuarioResponse> result = usuarioRepository.findAll()
                    .stream()
                    .map(u -> {
                        System.out.println("[AdminUserService] Mapping user: " + u.getEmail() + " role=" + u.getRole());
                        return UsuarioResponse.fromEntity(u);
                    })
                    .toList();
            System.out.println("[AdminUserService] Found " + result.size() + " users");
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public UsuarioResponse alternarRol(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Usuario no encontrado."));

        usuario.setRole(usuario.getRole().equals("ADMIN") ? "USER" : "ADMIN");
        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }
}
