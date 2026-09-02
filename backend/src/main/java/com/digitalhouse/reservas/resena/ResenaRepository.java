package com.digitalhouse.reservas.resena;

import com.digitalhouse.reservas.reserva.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    @Query("SELECT r FROM Resena r JOIN FETCH r.usuario WHERE r.producto.id = :productoId ORDER BY r.createdAt DESC")
    List<Resena> findByProductoIdWithUsuario(@Param("productoId") Long productoId);

    @Query("SELECT COALESCE(AVG(r.puntuacion), 0) FROM Resena r WHERE r.producto.id = :productoId")
    Double getAverageRating(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId")
    Long countByProductoId(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = 1")
    Long countByProductoIdAndStar1(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = 2")
    Long countByProductoIdAndStar2(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = 3")
    Long countByProductoIdAndStar3(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = 4")
    Long countByProductoIdAndStar4(@Param("productoId") Long productoId);

    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.id = :productoId AND r.puntuacion = 5")
    Long countByProductoIdAndStar5(@Param("productoId") Long productoId);

    @Query("""
        SELECT COUNT(res) > 0 FROM Reserva res
        WHERE res.usuario.id = :usuarioId
        AND res.producto.id = :productoId
        AND res.estado = 'CONFIRMADA'
        AND res.fechaFin < CURRENT_DATE
    """)
    boolean hasCompletedReservation(@Param("usuarioId") Long usuarioId, @Param("productoId") Long productoId);
}