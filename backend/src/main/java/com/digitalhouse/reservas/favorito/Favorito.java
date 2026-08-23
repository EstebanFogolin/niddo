package com.digitalhouse.reservas.favorito;

import com.digitalhouse.reservas.producto.Producto;
import com.digitalhouse.reservas.auth.Usuario;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos",
    uniqueConstraints = @UniqueConstraint(name = "uk_favorito_usuario_producto", columnNames = {"usuario_id", "producto_id"}),
    indexes = @Index(name = "idx_favorito_usuario", columnList = "usuario_id")
)
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Favorito() {}

    public Favorito(Usuario usuario, Producto producto) {
        this.usuario = usuario;
        this.producto = producto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}