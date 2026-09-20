package com.digitalhouse.reservas.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String frontendUrl;

    public EmailService(JavaMailSender mailSender, @Value("${app.frontend-url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
    }

    public void enviarConfirmacionRegistro(String destinatario, String nombre, String apellido) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("¡Registro exitoso en Niddo!");
        mensaje.setText(String.format("""
                Hola %s %s,

                ¡Tu registro en Niddo se ha completado exitosamente!

                Email registrado: %s

                Para iniciar sesion, hace clic en el siguiente enlace:
                %s/login

                ¡Gracias por unirte!
                """, nombre, apellido, destinatario, frontendUrl));

        mailSender.send(mensaje);
    }

    @Async
    public void enviarConfirmacionRegistroEnSegundoPlano(String destinatario, String nombre, String apellido) {
        try {
            enviarConfirmacionRegistro(destinatario, nombre, apellido);
        } catch (Exception ignored) {
            // Si el mail no esta configurado, el registro igual funciona
        }
    }

    public void enviarConfirmacionReserva(String destinatario, String nombre, String apellido,
                                          Long reservaId, String productoNombre,
                                          LocalDate fechaInicio, LocalDate fechaFin, LocalDateTime fechaReserva,
                                          String contactoEmail, String contactoTelefono) {
        DateTimeFormatter fechaFormato = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter fechaHoraFormato = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        StringBuilder contacto = new StringBuilder();
        if (contactoEmail != null && !contactoEmail.isBlank()) {
            contacto.append("Email: ").append(contactoEmail).append("\n");
        }
        if (contactoTelefono != null && !contactoTelefono.isBlank()) {
            contacto.append("Teléfono: ").append(contactoTelefono).append("\n");
        }
        if (contacto.length() == 0) {
            contacto.append("Gestioná tu reserva en Mis reservas:\n").append(frontendUrl).append("/mis-reservas\n");
        }

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("¡Tu reserva en Niddo se confirmó!");
        mensaje.setText(String.format("""
                Hola %s %s,

                ¡Tu reserva en Niddo se confirmó!

                Alojamiento: %s
                Check-in: %s
                Check-out: %s
                Fecha y hora de reserva: %s
                N.º de reserva: %d

                Contacto del proveedor:
                %s
                Ver tu reserva: %s/mis-reservas

                ¡Gracias por reservar con Niddo!
                """, nombre, apellido, productoNombre,
                fechaInicio.format(fechaFormato), fechaFin.format(fechaFormato),
                fechaReserva.format(fechaHoraFormato), reservaId,
                contacto, frontendUrl));

        mailSender.send(mensaje);
    }

    @Async
    public void enviarConfirmacionReservaEnSegundoPlano(String destinatario, String nombre, String apellido,
                                                       Long reservaId, String productoNombre,
                                                       LocalDate fechaInicio, LocalDate fechaFin, LocalDateTime fechaReserva,
                                                       String contactoEmail, String contactoTelefono) {
        try {
            enviarConfirmacionReserva(destinatario, nombre, apellido, reservaId, productoNombre,
                    fechaInicio, fechaFin, fechaReserva, contactoEmail, contactoTelefono);
        } catch (Exception ignored) {
            // Si el mail no esta configurado, la reserva igual funciona
        }
    }
}
