package com.digitalhouse.reservas.favorito;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import com.digitalhouse.reservas.producto.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository
    ) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public Favorito toggle(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));

        var existente = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);

        if (existente.isPresent()) {
            favoritoRepository.delete(existente.get());
            return null; // removido
        } else {
            Favorito favorito = new Favorito(usuario, producto);
            return favoritoRepository.save(favorito);
        }
    }

    public boolean isFavorito(Long usuarioId, Long productoId) {
        return favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    public List<Producto> listarFavoritos(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(Favorito::getProducto)
                .collect(Collectors.toList());
    }

    public void remover(Long usuarioId, Long productoId) {
        favoritoRepository.deleteByUsuarioIdAndProductoId(usuarioId, productoId);
    }
}