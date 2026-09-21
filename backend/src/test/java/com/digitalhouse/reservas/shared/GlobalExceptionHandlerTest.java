package com.digitalhouse.reservas.shared;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void nombreDuplicado_responde409ConMensaje() {
        ResponseEntity<ApiError> response =
                handler.handleNombreDuplicado(new NombreProductoDuplicadoException("El nombre ya esta en uso."));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("El nombre ya esta en uso.", response.getBody().mensaje());
    }

    @Test
    void reservaNoDisponible_responde409() {
        ResponseEntity<ApiError> response =
                handler.handleReservaNoDisponible(new ReservaNoDisponibleException());

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void credencialesInvalidas_responde401() {
        ResponseEntity<ApiError> response =
                handler.handleCredencialesInvalidas(new CredencialesInvalidasException());

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
