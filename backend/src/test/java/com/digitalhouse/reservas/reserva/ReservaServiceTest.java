package com.digitalhouse.reservas.reserva;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import com.digitalhouse.reservas.email.EmailService;
import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.producto.ProductoRepository;
import com.digitalhouse.reservas.shared.AccesoDenegadoException;
import com.digitalhouse.reservas.shared.ReservaNoDisponibleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;
    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private EmailService emailService;

    private ReservaService reservaService;
    private Usuario usuario;
    private Producto producto;

    @BeforeEach
    void setUp() {
        reservaService = new ReservaService(reservaRepository, productoRepository, usuarioRepository, emailService);
        usuario = new Usuario("Juan", "Perez", "juan@mail.com", "hash", "USER");
        usuario.setId(1L);
        producto = new Producto("Cabaña", "Linda cabaña", null, List.of());
        producto.setId(10L);
    }

    @Test
    void crear_rangoSolapado_lanza409() {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fin = inicio.plusDays(3);
        Reserva existente = new Reserva(producto, usuario, inicio, fin);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));
        when(reservaRepository.findOcupadasEnRangoPorUsuario(eq(10L), eq(1L), any(), eq(inicio), eq(fin)))
                .thenReturn(List.of(existente));

        assertThrows(ReservaNoDisponibleException.class,
                () -> reservaService.crear(1L, 10L, inicio, fin));
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void crear_inicioPosteriorAFin_lanza400() {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fin = inicio.minusDays(1);

        assertThrows(IllegalArgumentException.class,
                () -> reservaService.crear(1L, 10L, inicio, fin));
    }

    @Test
    void crear_fechaPasada_lanza400() {
        LocalDate inicio = LocalDate.now().minusDays(1);
        LocalDate fin = LocalDate.now().plusDays(2);

        assertThrows(IllegalArgumentException.class,
                () -> reservaService.crear(1L, 10L, inicio, fin));
    }

    @Test
    void crear_ok_guardaReserva() {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fin = inicio.plusDays(3);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));
        when(reservaRepository.findOcupadasEnRangoPorUsuario(eq(10L), eq(1L), any(), eq(inicio), eq(fin)))
                .thenReturn(List.of());
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(inv -> inv.getArgument(0));

        Reserva reserva = reservaService.crear(1L, 10L, inicio, fin);

        assertNotNull(reserva);
        assertEquals(Reserva.Estado.PENDIENTE, reserva.getEstado());
        verify(emailService).enviarConfirmacionReservaEnSegundoPlano(any(), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void cancelar_otroUsuario_lanza403() {
        Reserva reserva = new Reserva(producto, usuario, LocalDate.now().plusDays(5), LocalDate.now().plusDays(8));
        reserva.setId(99L);
        when(reservaRepository.findById(99L)).thenReturn(Optional.of(reserva));

        assertThrows(AccesoDenegadoException.class, () -> reservaService.cancelar(99L, 2L));
    }
}
