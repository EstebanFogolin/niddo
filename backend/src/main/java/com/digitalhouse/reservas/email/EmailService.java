package com.digitalhouse.reservas.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
}
