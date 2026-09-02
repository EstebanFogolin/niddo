package com.digitalhouse.reservas.config;

import com.digitalhouse.reservas.auth.JwtService;
import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        System.out.println("[JwtAuthFilter] Processing request: " + request.getMethod() + " " + request.getRequestURI());

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("[JwtAuthFilter] Token received (first 20 chars): " + token.substring(0, Math.min(20, token.length())) + "...");

            if (jwtService.isValid(token)) {
                String email = jwtService.extractEmail(token);
                var usuarioOpt = usuarioRepository.findByEmail(email);
                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();
                    List<SimpleGrantedAuthority> authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + usuario.getRole())
                    );

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(usuario.getId(), null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("[JwtAuthFilter] Authenticated user: " + email + " (id=" + usuario.getId() + ")");
                } else {
                    System.out.println("[JwtAuthFilter] User not found for email: " + email);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"mensaje\":\"Usuario no encontrado\"}");
                    return;
                }
            } else {
                System.out.println("[JwtAuthFilter] Invalid token - validation failed");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"mensaje\":\"Token inválido o expirado\"}");
                return;
            }
        } else {
            System.out.println("[JwtAuthFilter] No Bearer token found");
        }

        filterChain.doFilter(request, response);
    }
}
