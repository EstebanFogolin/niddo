package com.digitalhouse.reservas.auth;

import jakarta.validation.Valid;
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

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @CrossOrigin(origins = "http://localhost:5173")
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.registrar(request);
    }

    @PostMapping("/resend-confirmation")
    @CrossOrigin(origins = "http://localhost:5173")
    public MessageResponse resendConfirmation(@Valid @RequestBody ResendConfirmationRequest request) {
        return authService.reenviarConfirmacion(request);
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.iniciarSesion(request);
    }
}
