package com.digitalhouse.reservas.shared;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NombreProductoDuplicadoException.class)
    public ResponseEntity<ApiError> handleNombreDuplicado(NombreProductoDuplicadoException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError(exception.getMessage()));
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<ApiError> handleStorage(StorageException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(exception.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleValidation() {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiError("Completa todos los campos obligatorios."));
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<ApiError> handleNotFound(java.util.NoSuchElementException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiError(exception.getMessage()));
    }
}
