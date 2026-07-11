package com.digitalhouse.reservas.producto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    List<Producto> findByCategoriaIdIn(List<Long> categoriaIds);
}
