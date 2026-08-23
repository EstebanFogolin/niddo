package com.digitalhouse.reservas.favorito;

import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.producto.ProductoResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public List<ProductoResponse> listar(@AuthenticationPrincipal Long usuarioId) {
        List<Producto> productos = favoritoService.listarFavoritos(usuarioId);
        return productos.stream().map(ProductoResponse::fromEntity).toList();
    }

    @DeleteMapping("/{productoId}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void remover(
            @AuthenticationPrincipal Long usuarioId,
            @PathVariable Long productoId
    ) {
        favoritoService.remover(usuarioId, productoId);
    }

    @GetMapping("/check/{productoId}")
    public Map<String, Boolean> check(@AuthenticationPrincipal Long usuarioId, @PathVariable Long productoId) {
        boolean esFav = favoritoService.isFavorito(usuarioId, productoId);
        return Map.of("esFavorito", esFav);
    }

    public static class ToggleRequest {
        private Long productoId;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
    }
}