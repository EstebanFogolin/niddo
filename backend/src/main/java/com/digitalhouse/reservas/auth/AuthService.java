package com.digitalhouse.reservas.auth;

import com.digitalhouse.reservas.email.EmailService;
import com.digitalhouse.reservas.shared.CredencialesInvalidasException;
import com.digitalhouse.reservas.shared.EmailYaRegistradoException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        String email = normalizarEmail(request.getEmail());
        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailYaRegistradoException();
        }

        Usuario usuario = new Usuario(
                request.getNombre().trim(),
                request.getApellido().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        emailService.enviarConfirmacionRegistroEnSegundoPlano(
                usuarioGuardado.getEmail(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellido()
        );

        return crearRespuestaAuth(usuarioGuardado);
    }

    public MessageResponse reenviarConfirmacion(ResendConfirmationRequest request) {
        Usuario usuario = buscarPorEmail(normalizarEmail(request.getEmail()));
        emailService.enviarConfirmacionRegistroEnSegundoPlano(usuario.getEmail(), usuario.getNombre(), usuario.getApellido());
        return new MessageResponse("Email de confirmacion reenviado.");
    }

    public AuthResponse iniciarSesion(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(request.getEmail()))
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPassword()))
                .orElseThrow(CredencialesInvalidasException::new);

        return crearRespuestaAuth(usuario);
    }

    private Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new java.util.NoSuchElementException("No se encontro un usuario con ese email."));
    }

    private AuthResponse crearRespuestaAuth(Usuario usuario) {
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRole());
        return new AuthResponse(
                token,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
