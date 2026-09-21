package com.digitalhouse.reservas.producto;

import com.digitalhouse.reservas.caracteristica.CaracteristicaRepository;
import com.digitalhouse.reservas.categoria.CategoriaRepository;
import com.digitalhouse.reservas.resena.ResenaRepository;
import com.digitalhouse.reservas.shared.NombreProductoDuplicadoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private CaracteristicaRepository caracteristicaRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private ResenaRepository resenaRepository;

    private ProductoService productoService;

    @BeforeEach
    void setUp() {
        productoService = new ProductoService(
                productoRepository, caracteristicaRepository, categoriaRepository, resenaRepository, "uploads/productos");
    }

    @Test
    void crear_nombreDuplicado_lanza409() {
        when(productoRepository.existsByNombreIgnoreCase("Cabaña")).thenReturn(true);

        assertThrows(NombreProductoDuplicadoException.class,
                () -> productoService.crear("Cabaña", "Desc", null, null, null, null, null));
        verify(productoRepository, never()).save(any());
    }

    @Test
    void buscar_queryVacia_listaTodo() {
        Producto producto = new Producto("Cabaña", "Desc", null, List.of());
        when(productoRepository.findAllWithResenas()).thenReturn(List.of(producto));

        List<ProductoResponse> resultado = productoService.buscar("   ");

        assertEquals(1, resultado.size());
        assertEquals("Cabaña", resultado.get(0).nombre());
    }
}
