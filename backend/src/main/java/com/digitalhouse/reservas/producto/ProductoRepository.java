package com.digitalhouse.reservas.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    List<Producto> findByCategoriaIdIn(List<Long> categoriaIds);

    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String nombre, String descripcion);

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas WHERE p.categoria.id IN :categoriaIds")
    List<Producto> findByCategoriaIdInWithResenas(@Param("categoriaIds") List<Long> categoriaIds);

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas")
    List<Producto> findAllWithResenas();

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas " +
           "WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(p.categoria.titulo) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCaseWithResenas(@Param("q") String q);

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas WHERE p.id = :id")
    Optional<Producto> findByIdWithResenas(@Param("id") Long id);

    @Query("""
        SELECT DISTINCT p FROM Producto p
        WHERE (:categoriaIds IS NULL OR p.categoria.id IN :categoriaIds)
        AND (:q IS NULL OR :q = '' OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')) 
             OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :q, '%'))
             OR LOWER(p.categoria.titulo) LIKE LOWER(CONCAT('%', :q, '%')))
        AND (:usuarioId IS NULL OR NOT EXISTS (
            SELECT 1 FROM Reserva r 
            WHERE r.producto.id = p.id
            AND r.usuario.id = :usuarioId
            AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
            AND r.fechaInicio < :fechaFin
            AND r.fechaFin > :fechaInicio
        ))
    """)
    List<Producto> findDisponibles(
        @Param("categoriaIds") List<Long> categoriaIds,
        @Param("q") String q,
        @Param("usuarioId") Long usuarioId,
        @Param("fechaInicio") LocalDate fechaInicio,
        @Param("fechaFin") LocalDate fechaFin
    );
}
