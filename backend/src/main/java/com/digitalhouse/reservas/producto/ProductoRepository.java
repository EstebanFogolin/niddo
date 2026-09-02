package com.digitalhouse.reservas.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas WHERE p.nombre ILIKE %:q% OR p.descripcion ILIKE %:q%")
    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCaseWithResenas(@Param("q") String q);

    @Query("SELECT DISTINCT p FROM Producto p LEFT JOIN FETCH p.resenas WHERE p.id = :id")
    Optional<Producto> findByIdWithResenas(@Param("id") Long id);
}
