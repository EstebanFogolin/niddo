package com.digitalhouse.reservas;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import com.digitalhouse.reservas.caracteristica.Caracteristica;
import com.digitalhouse.reservas.caracteristica.CaracteristicaRepository;
import com.digitalhouse.reservas.categoria.Categoria;
import com.digitalhouse.reservas.categoria.CategoriaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ReservasApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReservasApplication.class, args);
    }

    @Bean
    public CommandLineRunner inicializarDatos(
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            CaracteristicaRepository caracteristicaRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!usuarioRepository.existsByEmail("admin@niddo.com")) {
                Usuario admin = new Usuario("Admin", "Niddo", "admin@niddo.com", passwordEncoder.encode("admin123"), "ADMIN");
                usuarioRepository.save(admin);
                System.out.println("Admin inicial creado: admin@niddo.com / admin123");
            }

            if (categoriaRepository.count() == 0) {
                categoriaRepository.save(new Categoria("Hoteles", "Los mejores hoteles para tu estadia", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"));
                categoriaRepository.save(new Categoria("Hostels", "Alojamiento economico y compartido", "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"));
                categoriaRepository.save(new Categoria("Departamentos", "Departamentos completamente equipados", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"));
                categoriaRepository.save(new Categoria("Bed and breakfast", "Desayuno incluido y atencion personalizada", "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?w=400"));
                System.out.println("Categorias iniciales creadas.");
            }

            if (caracteristicaRepository.count() == 0) {
                caracteristicaRepository.save(new Caracteristica("WiFi", "bi-wifi"));
                caracteristicaRepository.save(new Caracteristica("Aire acondicionado", "bi-snow"));
                caracteristicaRepository.save(new Caracteristica("Cocina", "bi-cup-hot"));
                caracteristicaRepository.save(new Caracteristica("Televisor", "bi-tv"));
                caracteristicaRepository.save(new Caracteristica("Estacionamiento gratuito", "bi-car-front"));
                caracteristicaRepository.save(new Caracteristica("Pileta", "bi-water"));
                caracteristicaRepository.save(new Caracteristica("Apto mascotas", "bi-heart"));
                caracteristicaRepository.save(new Caracteristica("Gimnasio", "bi-gear-wide-connected"));
                caracteristicaRepository.save(new Caracteristica("Lavanderia", "bi-truck"));
                caracteristicaRepository.save(new Caracteristica("Desayuno incluido", "bi-egg-fried"));
                System.out.println("Caracteristicas iniciales creadas.");
            }
        };
    }
}
