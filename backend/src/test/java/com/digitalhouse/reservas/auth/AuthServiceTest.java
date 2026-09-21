package com.digitalhouse.reservas.auth;

import com.digitalhouse.reservas.email.EmailService;
import com.digitalhouse.reservas.shared.CredencialesInvalidasException;
import com.digitalhouse.reservas.shared.EmailYaRegistradoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private EmailService emailService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(usuarioRepository, passwordEncoder, jwtService, emailService);
    }

    private RegisterRequest registro() {
        RegisterRequest request = new RegisterRequest();
        request.setNombre("Juan");
        request.setApellido("Perez");
        request.setEmail("juan@mail.com");
        request.setPassword("secreta123");
        return request;
    }

    @Test
    void registrar_emailDuplicado_lanza409() {
        when(usuarioRepository.existsByEmail("juan@mail.com")).thenReturn(true);

        assertThrows(EmailYaRegistradoException.class, () -> authService.registrar(registro()));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrar_ok_creaUsuarioUserYDevuelveToken() {
        when(usuarioRepository.existsByEmail("juan@mail.com")).thenReturn(false);
        when(passwordEncoder.encode("secreta123")).thenReturn("hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtService.generateToken("juan@mail.com", "USER")).thenReturn("token-123");

        AuthResponse response = authService.registrar(registro());

        assertEquals("token-123", response.getToken());
        assertEquals("USER", response.getRole());
        assertEquals("juan@mail.com", response.getEmail());
        verify(emailService).enviarConfirmacionRegistroEnSegundoPlano("juan@mail.com", "Juan", "Perez");
    }

    @Test
    void iniciarSesion_passwordIncorrecta_lanza401() {
        Usuario usuario = new Usuario("Juan", "Perez", "juan@mail.com", "hash", "USER");
        when(usuarioRepository.findByEmail("juan@mail.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("mala", "hash")).thenReturn(false);

        LoginRequest request = new LoginRequest();
        request.setEmail("juan@mail.com");
        request.setPassword("mala");

        assertThrows(CredencialesInvalidasException.class, () -> authService.iniciarSesion(request));
    }

    @Test
    void iniciarSesion_ok_devuelveToken() {
        Usuario usuario = new Usuario("Juan", "Perez", "juan@mail.com", "hash", "USER");
        when(usuarioRepository.findByEmail("juan@mail.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("secreta123", "hash")).thenReturn(true);
        when(jwtService.generateToken("juan@mail.com", "USER")).thenReturn("token-abc");

        LoginRequest request = new LoginRequest();
        request.setEmail("juan@mail.com");
        request.setPassword("secreta123");

        AuthResponse response = authService.iniciarSesion(request);

        assertEquals("token-abc", response.getToken());
        assertEquals("USER", response.getRole());
    }
}
