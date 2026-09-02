package com.digitalhouse.reservas.resena;

import com.digitalhouse.reservas.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "http://localhost:5173")
public class ResenaController {

    private final ResenaService resenaService;
    private final AuthService authService;

    public ResenaController(ResenaService resenaService, AuthService authService) {
        this.resenaService = resenaService;
        this.authService = authService;
    }

    @PostMapping("/productos/{productoId}")
    public ResponseEntity<ResenaResponse> crear(@PathVariable Long productoId,
                                                 @Valid @RequestBody ResenaRequest request,
                                                 Principal principal) {
        Long usuarioId = authService.getUsuarioIdFromPrincipal(principal);
        ResenaResponse response = resenaService.crear(usuarioId, productoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/productos/{productoId}")
    public Page<ResenaResponse> listar(@PathVariable Long productoId,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return resenaService.listarPorProducto(productoId, pageable);
    }

    @GetMapping("/productos/{productoId}/rating")
    public ProductoRatingResponse obtenerRating(@PathVariable Long productoId) {
        return resenaService.obtenerRating(productoId);
    }

    @PutMapping("/{resenaId}")
    public ResenaResponse actualizar(@PathVariable Long resenaId,
                                      @Valid @RequestBody ResenaRequest request,
                                      Principal principal) {
        Long usuarioId = authService.getUsuarioIdFromPrincipal(principal);
        return resenaService.actualizar(usuarioId, resenaId, request);
    }

    @DeleteMapping("/{resenaId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long resenaId, Principal principal) {
        Long usuarioId = authService.getUsuarioIdFromPrincipal(principal);
        boolean isAdmin = authService.isAdmin(principal);
        resenaService.eliminar(usuarioId, resenaId, isAdmin);
    }
}