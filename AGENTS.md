# AGENTS.md — Desafío Profesional (Niddo)

Plataforma de reservas de hospedajes. Frontend + backend en un solo repo, sin monorepo tooling.

## Stack

- **Frontend**: React 19, Vite 8, JavaScript (no TypeScript), React Router v7, Bootstrap 5.3 via CDN in `index.html` (not npm)
- **Backend**: Spring Boot 3.x, Java 17, Maven, H2 file DB, Spring Security with JWT
- **React Compiler**: enabled via `@rolldown/plugin-babel` with `reactCompilerPreset` (`vite.config.js`)
- **Tests**: none configured anywhere — do not invent test commands

## Commands

| Command | Location | Notes |
|---------|----------|-------|
| `npm run dev` | root | Vite on `:5173` |
| `npm run build` / `npm run lint` / `npm run preview` | root | Lint is check-only |
| `mvn spring-boot:run` | `backend/` | API on `:8080` |

## Hardcoded URLs — change together

- **Frontend API base** `http://localhost:8080` is duplicated in ~7 files, NOT centralized: `src/context/AuthProvider.jsx`, `src/context/ProductProvider.jsx`, `src/context/FavoritesContext.jsx`, `src/components/Auth/RegisterPage.jsx`, `src/components/Admin/UserManagement.jsx`, `src/components/AvailabilityCalendar/AvailabilityCalendar.jsx`, `src/components/Favorites/FavoritesPage.jsx`
- **CORS**: each controller has its own `@CrossOrigin(origins = "http://localhost:5173")` — update every controller if the dev port changes

## Auth model

- JWT bearer tokens; login/register return `{token, nombre, apellido, email, role}`; frontend persists session in `localStorage` key `niddo_auth`
- Roles: `USER` / `ADMIN`. Registration always creates `USER` — **there is no admin seeding**; promote the first admin manually via H2 console (`UPDATE USUARIO SET ROLE='ADMIN' ...`) or `PUT /api/admin/usuarios/{id}/role` (requires an existing admin)
- Route guards: `/favoritos` wrapped in `RequireAuth`, `/administracion` in `RequireAdmin` (`src/App.jsx`); `isAdmin` = role strictly `'ADMIN'`

## Security rules (`config/SecurityConfig.java`)

- Public: GET `/api/productos/**`, `/api/categorias/**`, `/api/caracteristicas/**`, `/api/reservas/producto/*/disponibilidad`, `/api/auth/**`, `/uploads/**`, `/h2-console/**`
- ADMIN only: all writes to productos/categorias/caracteristicas and everything under `/api/admin/**`
- Everything else (reservas POST/DELETE, mis-reservas, favoritos) requires authentication

## Backend API notes

- Modules by package under `com.digitalhouse.reservas`: `auth`, `producto`, `categoria`, `caracteristica`, `reserva`, `favorito`, `email`
- `POST/PUT /api/productos` are `multipart/form-data`: `nombre`, `descripcion`, `categoriaId` (Long), `caracteristicas` (id list); `imagenes` file array required on POST, optional on PUT
- `GET /api/productos?q=...&categoriaIds=1,2` supports search and category filter
- Errors use `{"mensaje": "..."}` (`ApiError` record); duplicate product name → 409
- Registration confirmation email is sent async (`EmailService`); SMTP needs env vars `MAIL_USERNAME`/`MAIL_PASSWORD`, but missing mail config does not block registration
- JWT secret/expiration: `app.jwt.*` in `application.properties`

## Persistence & uploads

- H2 file DB at `backend/data/reservas.mv.db`; console at `/h2-console` (JDBC `jdbc:h2:file:./data/reservas`, user `sa`, empty password)
- DDL: `spring.jpa.hibernate.ddl-auto=update` — no migration scripts; schema changes come from entity edits
- Product images stored at `backend/uploads/productos/`, served at `/uploads/productos/**` (`WebConfig` resource handler); multipart limits 10MB/file, 30MB/request

## Frontend data flow gotchas

- Products come **only from the API** — there is no static fallback merge anymore. Only `CategoriesList` uses a static fallback (`src/data/Categories.js`) when the API fails
- API products get ids prefixed `api-` (e.g. `api-3`); numeric backend id must be extracted before calling product endpoints (`ProductProvider.jsx`)
- Image paths from the API are relative (`/uploads/...`) and need the API base prepended (`resolveImageUrl` in `ProductProvider.jsx`)
