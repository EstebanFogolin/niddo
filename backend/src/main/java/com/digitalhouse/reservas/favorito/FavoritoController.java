package com.digitalhouse.reservas.favorito;

import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.producto.ProductoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("[FavoritoController] test endpoint called");
        return "FavoritoController works";
    }

    @PostMapping("/toggle")
    public Map<String, Object> toggle(
            @AuthenticationPrincipal Long usuarioId,
            @RequestBody ToggleRequest request
    ) {
        Favorito favorito = favoritoService.toggle(usuarioId, request.getProductoId());
        boolean agregado = favorito != null;
        return Map.of(
                "agregado", agregado,
                "productoId", request.getProductoId()
        );
    }

    @GetMapping
    public ResponseEntity<?> listar(@AuthenticationPrincipal Long usuarioId) {
        System.out.println("[FavoritoController] listar called with usuarioId: " + usuarioId);
        if (usuarioId == null) {
            System.out.println("[FavoritoController] usuarioId is null - UNAUTHORIZED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            System.out.println("[FavoritoController] Calling listarFavoritos...");
            List<Producto> productos = favoritoService.listarFavoritos(usuarioId);
            System.out.println("[FavoritoController] Got " + productos.size() + " products");
            List<ProductoResponse> response = new ArrayList<>();
            for (Producto p : productos) {
                try {
                    System.out.println("[FavoritoController] Mapping product: " + p.getId() + " - " + p.getNombre());
                    ProductoResponse pr = ProductoResponse.fromEntity(p);
                    System.out.println("[FavoritoController] Mapped OK: " + pr.id());
                    response.add(pr);
                } catch (Exception ex) {
                    System.err.println("[FavoritoController] Error mapping product " + p.getId() + ": " + ex.getMessage());
                    ex.printStackTrace();
                }
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        } catch (Error e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{productoId}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void remover(
            @AuthenticationPrincipal Long usuarioId,
            @PathVariable Long productoId
    ) {
        favoritoService.remover(usuarioId, productoId);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> check(@AuthenticationPrincipal Long usuarioId, @RequestParam Long productoId) {
        try {
            if (usuarioId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            boolean esFav = favoritoService.isFavorito(usuarioId, productoId);
            return ResponseEntity.ok(Map.of("esFavorito", esFav));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public static class ToggleRequest {
        private Long productoId;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
    }
}