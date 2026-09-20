package com.digitalhouse.reservas.reserva;

import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.auth.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByProductoIdAndEstadoIn(Long productoId, List<Reserva.Estado> estados);

    @Query("SELECT r FROM Reserva r WHERE r.producto.id = :productoId " +
           "AND r.usuario.id = :usuarioId " +
           "AND r.estado IN :estados " +
           "AND r.fechaFin >= :desde " +
           "AND r.fechaInicio <= :hasta")
    List<Reserva> findOcupadasEnRangoPorUsuario(
            @Param("productoId") Long productoId,
            @Param("usuarioId") Long usuarioId,
            @Param("estados") List<Reserva.Estado> estados,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );

    List<Reserva> findByUsuarioIdAndEstadoIn(Long usuarioId, List<Reserva.Estado> estados);

    @Query("SELECT r FROM Reserva r WHERE r.usuario.id = :usuarioId " +
           "AND r.producto.id = :productoId " +
           "AND r.estado IN :estados")
    Reserva findByUsuarioAndProducto(
            @Param("usuarioId") Long usuarioId,
            @Param("productoId") Long productoId,
            @Param("estados") List<Reserva.Estado> estados
    );
}