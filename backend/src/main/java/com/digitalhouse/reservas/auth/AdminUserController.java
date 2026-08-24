package com.digitalhouse.reservas.auth;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        System.out.println("[AdminUserController] listar called");
        List<UsuarioResponse> result = adminUserService.listar();
        System.out.println("[AdminUserController] Found " + result.size() + " users");
        return result;
    }

    @PutMapping("/{id}/role")
    public UsuarioResponse cambiarRole(@PathVariable Long id) {
        return adminUserService.alternarRol(id);
    }
}
