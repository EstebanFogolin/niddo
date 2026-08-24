package com.digitalhouse.reservas.favorito;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.producto.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    @Query("SELECT f FROM Favorito f JOIN FETCH f.producto p JOIN FETCH p.categoria WHERE f.usuario.id = :usuarioId")
    List<Favorito> findByUsuarioIdWithProducto(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    void deleteByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}