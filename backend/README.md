# Backend Spring Boot - Reservas

API para guardar y listar productos de la aplicacion de reservas.

## Como correrlo

```bash
cd backend
mvn spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080
```

## Endpoints

### Listar productos

```http
GET http://localhost:8080/api/productos
```

### Crear producto

```http
POST http://localhost:8080/api/productos
Content-Type: multipart/form-data
```

Campos:

```text
nombre
descripcion
categoria
imagenes
```

Si el nombre ya existe, responde con estado `409 Conflict`:

```json
{
  "mensaje": "El nombre ya esta en uso."
}
```

## Base de datos

Este proyecto usa H2 para desarrollo. La base queda guardada en:

```text
backend/data/reservas.mv.db
```

Consola H2:

```text
http://localhost:8080/h2-console
```

Datos de conexion:

```text
JDBC URL: jdbc:h2:file:./data/reservas
User: sa
Password:
```
