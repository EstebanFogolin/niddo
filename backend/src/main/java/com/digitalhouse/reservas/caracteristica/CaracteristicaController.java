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
import java.util.Map;

@RestController
@RequestMapping("/api/caracteristicas")
@CrossOrigin(origins = "http://localhost:5173")
public class CaracteristicaController {

    private final CaracteristicaService service;

    public CaracteristicaController(CaracteristicaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return service.listar()
                .stream()
                .map(c -> Map.<String, Object>of(
                        "id", c.getId(),
                        "nombre", c.getNombre(),
                        "icono", c.getIcono()
                ))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> crear(
            @RequestParam String nombre,
            @RequestParam String icono
    ) {
        Caracteristica c = service.crear(nombre, icono);
        return Map.of("id", c.getId(), "nombre", c.getNombre(), "icono", c.getIcono());
    }

    @PutMapping("/{id}")
    public Map<String, Object> actualizar(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String icono
    ) {
        Caracteristica c = service.actualizar(id, nombre, icono);
        return Map.of("id", c.getId(), "nombre", c.getNombre(), "icono", c.getIcono());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
