package com.digitalhouse.reservas.caracteristica;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@CrossOrigin(origins = "http://localhost:5173")
public class CaracteristicaController {

    private final CaracteristicaService service;

    public CaracteristicaController(CaracteristicaService service) {
        this.service = service;
    }

    @GetMapping
    public List<CaracteristicaResponse> listar() {
        return service.listar()
                .stream()
                .map(CaracteristicaResponse::fromEntity)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaracteristicaResponse crear(
            @RequestParam String nombre,
            @RequestParam String icono
    ) {
        return CaracteristicaResponse.fromEntity(service.crear(nombre, icono));
    }

    @PutMapping("/{id}")
    public CaracteristicaResponse actualizar(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String icono
    ) {
        return CaracteristicaResponse.fromEntity(service.actualizar(id, nombre, icono));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}