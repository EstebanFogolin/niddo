package com.digitalhouse.reservas.caracteristica;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaracteristicaService {

    private final CaracteristicaRepository repository;

    public CaracteristicaService(CaracteristicaRepository repository) {
        this.repository = repository;
    }

    public List<Caracteristica> listar() {
        return repository.findAll();
    }

    public Caracteristica crear(String nombre, String icono) {
        if (repository.existsByNombreIgnoreCase(nombre.trim())) {
            throw new IllegalArgumentException("Ya existe una característica con ese nombre.");
        }

        Caracteristica c = new Caracteristica(nombre.trim(), icono.trim());
        return repository.save(c);
    }

    public Caracteristica actualizar(Long id, String nombre, String icono) {
        Caracteristica c = repository.findById(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Característica no encontrada."));

        if (nombre != null && !nombre.isBlank()) {
            c.setNombre(nombre.trim());
        }
        if (icono != null && !icono.isBlank()) {
            c.setIcono(icono.trim());
        }

        return repository.save(c);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new java.util.NoSuchElementException("Característica no encontrada.");
        }
        repository.deleteById(id);
    }
}
