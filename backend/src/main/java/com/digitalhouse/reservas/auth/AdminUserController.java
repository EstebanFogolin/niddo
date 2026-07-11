package com.digitalhouse.reservas.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final UsuarioRepository usuarioRepository;

    public AdminUserController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "nombre", u.getNombre(),
                        "apellido", u.getApellido(),
                        "email", u.getEmail(),
                        "role", u.getRole()
                ))
                .toList();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Map<String, Object>> cambiarRole(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Usuario no encontrado."));

        String nuevoRole = usuario.getRole().equals("ADMIN") ? "USER" : "ADMIN";
        usuario.setRole(nuevoRole);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "apellido", usuario.getApellido(),
                "email", usuario.getEmail(),
                "role", usuario.getRole()
        ));
    }
}
