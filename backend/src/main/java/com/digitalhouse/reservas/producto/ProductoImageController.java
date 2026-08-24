package com.digitalhouse.reservas.producto;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/productos")
public class ProductoImageController {

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            String projectRoot = System.getProperty("user.dir");
            
            File[] candidates = {
                new File(projectRoot, "backend/uploads/productos/" + filename),
                new File(projectRoot, "uploads/productos/" + filename),
                new File("C:/Proyectos/proyectos practica react/Desafío_Profesional/backend/uploads/productos/" + filename)
            };

            File imageFile = null;
            for (File candidate : candidates) {
                if (candidate.exists() && candidate.isFile()) {
                    imageFile = candidate;
                    break;
                }
            }

            if (imageFile == null || !imageFile.exists()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(imageFile);
            String contentType;
            try {
                contentType = Files.probeContentType(imageFile.toPath());
            } catch (IOException e) {
                contentType = "application/octet-stream";
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/test-image")
    public String test() {
        return "ProductoImageController works";
    }
}