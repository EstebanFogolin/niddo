-- Niddo: esquema derivado de las entidades JPA (backend/.../com.digitalhouse.reservas)
-- H2 en runtime; DDL en dialecto estandar para el diagrama.

CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    imagen_url VARCHAR(255) NOT NULL
);

CREATE TABLE caracteristicas (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    icono VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion VARCHAR(1000) NOT NULL,
    contacto_email VARCHAR(255),
    contacto_telefono VARCHAR(255),
    categoria_id BIGINT,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

CREATE TABLE producto_imagenes (
    producto_id BIGINT NOT NULL,
    url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_imagen_producto FOREIGN KEY (producto_id) REFERENCES productos (id)
);

CREATE TABLE producto_caracteristicas (
    producto_id BIGINT NOT NULL,
    caracteristica_id BIGINT NOT NULL,
    PRIMARY KEY (producto_id, caracteristica_id),
    CONSTRAINT fk_pc_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_pc_caracteristica FOREIGN KEY (caracteristica_id) REFERENCES caracteristicas (id)
);

CREATE TABLE reservas (
    id BIGINT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_reserva_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE favoritos (
    id BIGINT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_favorito_usuario_producto UNIQUE (usuario_id, producto_id),
    CONSTRAINT fk_favorito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT fk_favorito_producto FOREIGN KEY (producto_id) REFERENCES productos (id)
);

CREATE TABLE resenas (
    id BIGINT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    puntuacion INTEGER NOT NULL,
    comentario VARCHAR(2000),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT uk_resena_usuario_producto UNIQUE (usuario_id, producto_id),
    CONSTRAINT fk_resena_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_resena_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);
