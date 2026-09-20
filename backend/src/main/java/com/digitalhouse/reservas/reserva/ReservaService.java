package com.digitalhouse.reservas.reserva;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.email.EmailService;
import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.producto.ProductoRepository;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import com.digitalhouse.reservas.shared.AccesoDenegadoException;
import com.digitalhouse.reservas.shared.ReservaNoDisponibleException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public ReservaService(
            ReservaRepository reservaRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            EmailService emailService
    ) {
        this.reservaRepository = reservaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    public List<LocalDate> getFechasOcupadas(Long productoId, Long usuarioId, LocalDate desde, LocalDate hasta) {
        if (usuarioId == null) {
            return List.of();
        }
        List<Reserva.Estado> estadosActivos = List.of(Reserva.Estado.PENDIENTE, Reserva.Estado.CONFIRMADA);
        List<Reserva> reservas = reservaRepository.findOcupadasEnRangoPorUsuario(productoId, usuarioId, estadosActivos, desde, hasta);

        return reservas.stream()
                .flatMap(r -> r.getFechaInicio().datesUntil(r.getFechaFin().plusDays(1)))
                .collect(Collectors.toList());
    }

    public List<LocalDate> getFechasDisponibles(Long productoId, Long usuarioId, LocalDate desde, LocalDate hasta) {
        List<LocalDate> ocupadas = getFechasOcupadas(productoId, usuarioId, desde, hasta);

        return desde.datesUntil(hasta.plusDays(1))
                .filter(d -> !ocupadas.contains(d))
                .collect(Collectors.toList());
    }

    public Reserva crear(Long usuarioId, Long productoId, LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio.isAfter(fechaFin) || fechaInicio.isEqual(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la de fin.");
        }
        if (fechaInicio.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser pasada.");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));

        List<Reserva.Estado> estadosActivos = List.of(Reserva.Estado.PENDIENTE, Reserva.Estado.CONFIRMADA);
        List<Reserva> solapadas = reservaRepository.findOcupadasEnRangoPorUsuario(productoId, usuarioId, estadosActivos, fechaInicio, fechaFin);
        if (!solapadas.isEmpty()) {
            throw new ReservaNoDisponibleException();
        }

        Reserva reserva = new Reserva(producto, usuario, fechaInicio, fechaFin);
        Reserva guardada = reservaRepository.save(reserva);

        emailService.enviarConfirmacionReservaEnSegundoPlano(
                usuario.getEmail(), usuario.getNombre(), usuario.getApellido(),
                guardada.getId(), producto.getNombre(), fechaInicio, fechaFin,
                guardada.getCreatedAt(), producto.getContactoEmail(), producto.getContactoTelefono());

        return guardada;
    }

    public void cancelar(Long reservaId, Long usuarioId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada."));

        if (!reserva.getUsuario().getId().equals(usuarioId)) {
            throw new AccesoDenegadoException("No tienes permiso para cancelar esta reserva.");
        }

        reserva.setEstado(Reserva.Estado.CANCELADA);
        reservaRepository.save(reserva);
    }

    public List<Reserva> listarPorUsuario(Long usuarioId) {
        List<Reserva.Estado> estados = List.of(Reserva.Estado.PENDIENTE, Reserva.Estado.CONFIRMADA, Reserva.Estado.CANCELADA);
        return reservaRepository.findByUsuarioIdAndEstadoIn(usuarioId, estados);
    }
}