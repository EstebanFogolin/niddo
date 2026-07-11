package com.digitalhouse.reservas.auth;

import com.digitalhouse.reservas.email.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(null);
        }

        Usuario usuario = new Usuario(
                request.getNombre().trim(),
                request.getApellido().trim(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        usuarioRepository.save(usuario);

        try {
            emailService.enviarConfirmacionRegistro(usuario.getEmail(), usuario.getNombre(), usuario.getApellido());
        } catch (Exception ignored) {
            // Si el mail no esta configurado, el registro igual funciona
        }

        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRole());

        AuthResponse response = new AuthResponse(
                token,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/resend-confirmation")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<?> resendConfirmation(@Valid @RequestBody ResendConfirmationRequest request) {
        var usuarioOpt = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No se encontro un usuario con ese email."));
        }

        Usuario usuario = usuarioOpt.get();

        try {
            emailService.enviarConfirmacionRegistro(usuario.getEmail(), usuario.getNombre(), usuario.getApellido());
            return ResponseEntity.ok(new MessageResponse("Email de confirmacion reenviado."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("No se pudo enviar el email. Intente mas tarde."));
        }
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var usuarioOpt = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (usuarioOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), usuarioOpt.get().getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        Usuario usuario = usuarioOpt.get();
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRole());

        AuthResponse response = new AuthResponse(
                token,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRole()
        );

        return ResponseEntity.ok(response);
    }
}
