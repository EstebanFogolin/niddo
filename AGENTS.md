# AGENTS.md — Desafío Profesional (Niddo)

## Stack

- **Frontend**: React 19, Vite 8, JavaScript (no TypeScript), Bootstrap 5.3 via CDN, React Router v7
- **Backend**: Spring Boot 3.3.5, Java 17, Maven, H2 (dev) / MySQL (prod)
- **React Compiler**: enabled via `@rolldown/plugin-babel` with `reactCompilerPreset`

## Commands

| Command | Location | Notes |
|---------|----------|-------|
| `npm run dev` | root | Vite dev server on `:5173` |
| `npm run build` | root | Production build to `dist/` |
| `npm run lint` | root | ESLint — only check, no typecheck |
| `npm run preview` | root | Preview production build |
| `mvn spring-boot:run` | `backend/` | Backend on `:8080` |
| `npm test` | — | **Not configured** — no test framework in the repo |

## Project layout

```
src/
  main.jsx            — Entry point (BrowserRouter, 3 routes)
  App.jsx             — Home page layout
  context/            — ProductContext + ProductProvider (API calls + static fallback)
  data/               — Static product seeds (merged with API data)
  components/         — Per-component folders (JSX + CSS)

backend/
  src/main/java/.../  — com.digitalhouse.reservas package
    producto/         — Producto entity, repository, service, controller, response DTO
    config/           — WebConfig (CORS, static resource handler for uploads)
    shared/           — Global exception handler, custom exceptions
  src/main/resources/ — application.properties
```

## Frontend — key facts

- **Routes**: `/` (home), `/administracion` (admin), `/productos/:id` (detail) — defined in `main.jsx`
- **API base**: hardcoded `http://localhost:8080` in `ProductProvider.jsx`
- **Product merging**: static data from `src/data/Recommendations.js` always shown first, API results appended on top
- **CORS**: backend allows `http://localhost:5173` only — update `@CrossOrigin` if dev port changes

## Backend — key facts

- **API** `GET /api/productos` — list all products
- **API** `POST /api/productos`: expects `multipart/form-data` with fields `nombre`, `descripcion`, `categoria` (default `Hotel`), `imagenes` (file array)
- **API** `DELETE /api/productos/{id}` — deletes product and its uploaded images
- **Duplicate name** (POST): returns `409 Conflict` with `{"mensaje": "El nombre ya esta en uso."}`
- **Not found** (DELETE): returns `404`
- **Uploads**: stored at `backend/uploads/productos/`, served at `/uploads/productos/**`
- **H2**: file-based DB at `backend/data/reservas.mv.db`, console at `/h2-console` (JDBC URL `jdbc:h2:file:./data/reservas`, user `sa`, no password)
- **DDL**: `spring.jpa.hibernate.ddl-auto=update` — no migration scripts
