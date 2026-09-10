package com.digitalhouse.reservas.resena;

import com.digitalhouse.reservas.auth.Usuario;
import com.digitalhouse.reservas.auth.UsuarioRepository;
import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.producto.ProductoRepository;
import com.digitalhouse.reservas.shared.AccesoDenegadoException;
import com.digitalhouse.reservas.shared.ResenaNoPermitidaException;
import com.digitalhouse.reservas.shared.ResenaYaExistenteException;

import java.util.NoSuchElementException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public ResenaService(ResenaRepository resenaRepository,
                         ProductoRepository productoRepository,
                         UsuarioRepository usuarioRepository) {
        this.resenaRepository = resenaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ResenaResponse crear(Long usuarioId, Long productoId, ResenaRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado."));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));

        if (resenaRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId)) {
            throw new ResenaYaExistenteException();
        }

        if (!resenaRepository.hasCompletedReservation(usuarioId, productoId)) {
            throw new ResenaNoPermitidaException();
        }

        Resena resena = new Resena(producto, usuario, request.puntuacion(), request.comentario());
        Resena guardada = resenaRepository.save(resena);
        return ResenaResponse.fromEntity(guardada);
    }

    public Page<ResenaResponse> listarPorProducto(Long productoId, Pageable pageable) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));

        List<Resena> resenas = resenaRepository.findByProductoIdWithUsuario(productoId);
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), resenas.size());
        List<ResenaResponse> content = resenas.subList(start, end).stream()
                .map(ResenaResponse::fromEntity)
                .toList();
        return new PageImpl<>(content, pageable, resenas.size());
    }

    public ProductoRatingResponse obtenerRating(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));

        Double promedio = resenaRepository.getAverageRating(productoId);
        Long total = resenaRepository.countByProductoId(productoId);

        Integer[] distribucion = new Integer[]{
                resenaRepository.countByProductoIdAndStar1(productoId).intValue(),
                resenaRepository.countByProductoIdAndStar2(productoId).intValue(),
                resenaRepository.countByProductoIdAndStar3(productoId).intValue(),
                resenaRepository.countByProductoIdAndStar4(productoId).intValue(),
                resenaRepository.countByProductoIdAndStar5(productoId).intValue()
        };

        return new ProductoRatingResponse(promedio, total, distribucion);
    }

    public ResenaResponse actualizar(Long usuarioId, Long resenaId, ResenaRequest request) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new NoSuchElementException("Reseña no encontrada."));

        if (!resena.getUsuario().getId().equals(usuarioId)) {
            throw new AccesoDenegadoException("No tienes permiso para editar esta reseña.");
        }

        resena.setPuntuacion(request.puntuacion());
        resena.setComentario(request.comentario());
        Resena guardada = resenaRepository.save(resena);
        return ResenaResponse.fromEntity(guardada);
    }

    public void eliminar(Long usuarioId, Long resenaId, boolean isAdmin) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new NoSuchElementException("Reseña no encontrada."));

        if (!isAdmin && !resena.getUsuario().getId().equals(usuarioId)) {
            throw new AccesoDenegadoException("No tienes permiso para eliminar esta reseña.");
        }

        resenaRepository.delete(resena);
    }

    public boolean usuarioYaValoro(Long usuarioId, Long productoId) {
        return resenaRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    public boolean puedeValorar(Long usuarioId, Long productoId) {
        return resenaRepository.hasCompletedReservation(usuarioId, productoId);
    }
}