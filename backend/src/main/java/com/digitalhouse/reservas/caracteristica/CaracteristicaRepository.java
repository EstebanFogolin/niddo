package com.digitalhouse.reservas.caracteristica;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {

    boolean existsByNombreIgnoreCase(String nombre);
}
