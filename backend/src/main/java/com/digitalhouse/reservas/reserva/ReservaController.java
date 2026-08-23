package com.digitalhouse.reservas.reserva;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping("/producto/{productoId}/disponibilidad")
    public Map<String, Object> disponibilidad(
            @PathVariable Long productoId,
            @RequestParam String desde,
            @RequestParam String hasta
    ) {
        LocalDate d = LocalDate.parse(desde, DateTimeFormatter.ISO_DATE);
        LocalDate h = LocalDate.parse(hasta, DateTimeFormatter.ISO_DATE);

        List<LocalDate> ocupadas = reservaService.getFechasOcupadas(productoId, d, h);
        List<LocalDate> disponibles = reservaService.getFechasDisponibles(productoId, d, h);

        return Map.of(
                "productoId", productoId,
                "desde", desde,
                "hasta", hasta,
                "fechasOcupadas", ocupadas.stream().map(LocalDate::toString).toList(),
                "fechasDisponibles", disponibles.stream().map(LocalDate::toString).toList()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva crear(
            @AuthenticationPrincipal Long usuarioId,
            @RequestBody CrearReservaRequest request
    ) {
        Reserva reserva = reservaService.crear(usuarioId, request.getProductoId(),
                LocalDate.parse(request.getFechaInicio(), DateTimeFormatter.ISO_DATE),
                LocalDate.parse(request.getFechaFin(), DateTimeFormatter.ISO_DATE));
        return reserva;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Long usuarioId
    ) {
        reservaService.cancelar(id, usuarioId);
    }

    @GetMapping("/mis-reservas")
    public List<Reserva> misReservas(@AuthenticationPrincipal Long usuarioId) {
        return reservaService.listarPorUsuario(usuarioId);
    }

    public static class CrearReservaRequest {
        private Long productoId;
        private String fechaInicio;
        private String fechaFin;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public String getFechaInicio() { return fechaInicio; }
        public void setFechaInicio(String fechaInicio) { this.fechaInicio = fechaInicio; }
        public String getFechaFin() { return fechaFin; }
        public void setFechaFin(String fechaFin) { this.fechaFin = fechaFin; }
    }
}