# GraphQL Movies & Series Platform

## Objetivo del proyecto

API GraphQL para una plataforma de películas y series. Permite gestionar usuarios, autenticación, catálogo de contenido (películas, series, temporadas, episodios), géneros, reseñas y favoritos. Construida con arquitectura modular y GraphQL schema-first.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20+, pnpm 9+, TypeScript 5.7 (ESM) |
| HTTP | Express 4.21 |
| GraphQL | graphql-yoga 5.12 + graphql 16 + @graphql-tools |
| DB | PostgreSQL 16 |
| DB Client | `pg` 8.13 (raw SQL) |
| Migraciones | node-pg-migrate 7.2 |
| Auth | bcryptjs + jsonwebtoken |
| DI | Awilix 12 |
| Logger | Pino 9 + pino-pretty |
| Validación | Zod 3.24 (solo env) |
| Dev tools | tsx (hot-reload), ESLint, Prettier, Husky, commitlint |

---

## Arquitectura

### Flujo de entrada

```
src/index.ts
  → src/server.ts      (HTTP server + graceful shutdown)
    → src/app.ts        (Express app factory)
      → Middleware stack: helmet → cors → json → requestLogger → authMiddleware → yoga → errorHandler
      → DI container: createDIContainer → registerDependencies
      → graphql-yoga: createGraphQLServer(schema, { context })
```

### Capas por request

```
HTTP Request
  → Express Middlewares (helmet, cors, json, logger, JWT auth)
    → graphql-yoga (parse, validate, execute)
      → Auth Directive (@auth, @auth(role: ADMIN)) [field-level guard]
        → Resolvers (src/graphql/schemas/<name>/*.resolver.ts)
          → Services (src/modules/<name>/*.service.ts)
            → Mappers (src/modules/<name>/*.mapper.ts)  [Model → DTO]
              → Repositories (src/modules/<name>/*.repository.ts)
                → pg query() helper (src/config/database.ts)
                  → PostgreSQL
```

### Estructura de directorios

```
src/
├── index.ts                      # Entry point
├── server.ts                     # HTTP server lifecycle
├── app.ts                        # Express app + middleware wiring
├── config/                       # Configuración global
│   ├── env.ts                    # Zod env validation
│   ├── database.ts               # pg Pool + query() helper
│   ├── logger.ts                 # Pino logger
│   └── graphql.ts                # graphql-yoga factory
├── graphql/                      # Capa GraphQL
│   ├── schema.ts                 # SDL + resolvers merge + auth directive
│   ├── resolvers.ts              # Agregador de resolvers
│   ├── context.ts                # GraphQLContext type
│   ├── directives/
│   │   └── auth.directive.ts     # @auth transformer
│   ├── scalars/
│   │   └── date.scalar.ts        # DateTime custom scalar
│   └── schemas/
│       ├── base.graphql           # Scalar DateTime, Query/Mutation base
│       ├── auth/                  # Auth (login/register)
│       ├── user/                  # User CRUD
│       ├── movie/                 # Movie queries
│       ├── serie/                 # Serie queries
│       ├── season/                # Season queries
│       ├── episode/               # Episode queries
│       ├── genre/                 # Genre CRUD
│       ├── review/                # Review queries
│       ├── favorite/              # Favorite queries
│       └── role/                  # Role queries
├── modules/                      # Capa de negocio (10 módulos)
│   ├── auth/                     # AuthService (login/register con bcrypt + JWT)
│   ├── user/                     # UserService
│   ├── movie/                    # MovieService
│   ├── serie/                    # SerieService
│   ├── season/                   # SeasonService
│   ├── episode/                  # EpisodeService
│   ├── genre/                    # GenreService
│   ├── review/                   # ReviewService
│   ├── favorite/                 # FavoriteService
│   └── role/                     # RoleService
├── middlewares/
│   ├── auth.middleware.ts        # JWT verification (Bearer token)
│   ├── errorHandler.middleware.ts# Global error handler
│   └── requestLogger.middleware.ts # Request logging
├── lib/
│   ├── di/                       # Awilix container + registrations
│   ├── errors/                   # AppError, NotFoundError, UnauthorizedError, ValidationError, ConflictError
│   └── helpers/
│       └── pagination.ts         # Pagination utilities
├── shared/
│   ├── types/                    # Role, SerieStatus, JwtPayload, AuthUser
│   └── constants/                # ROLES, SERIE_STATUS, PAGINATION
└── database/
    └── seeds/                    # SQL seeds
```

---

## Flujo de datos

### Autenticación

```
register(input) → AuthService.register()
  → UserRepository.findByEmail() [verificar duplicado]
  → RoleRepository.findByName('USER')
  → bcrypt.hash(password, 12)
  → UserRepository.create()
  → jwt.sign({ userId, role }, JWT_SECRET)
  → AuthMapper.toAuthPayload(token, UserDTO)

login(input) → AuthService.login()
  → UserRepository.findByEmail()
  → bcrypt.compare(password, hash)
  → jwt.sign()
  → AuthMapper.toAuthPayload(token, UserDTO)
```

### Consultas (ej: genres)

```
Query.genres → ctx.di.genreService.findAll()
  → GenreRepository.findAll()  [SELECT * FROM genres ORDER BY name ASC]
  → GenreMapper.toDTO()        [snake_case → camelCase]
  → GenreDTO[]
```

### Paginación

Todas las queries list aceptan `PaginationInput` (`{ page, limit }`). `parsePagination()` calcula offset/limit (default: page=1, limit=20, max: 100).

---

## Convenciones

### Módulos (`src/modules/<name>/`)

Cada módulo sigue 4 archivos:
- `*.model.ts` — Interfaz del row de DB (snake_case, ej: `created_at`, `user_id`)
- `*.repository.ts` — Raw SQL queries. Clase con métodos que llaman a `query()`.
- `*.service.ts` — Lógica de negocio. Constructor recibe repository vía DI. Llama a mappers.
- `*.mapper.ts` — `Model → DTO` (snake_case → camelCase). `static toDTO(model): DTO`.

### GraphQL (`src/graphql/schemas/<name>/`)

- `*.graphql` — SDL type definitions (schema-first)
- `*.resolver.ts` — Resolver functions, reciben `GraphQLContext` con `user` y `di`
- Los resolvers imports se agregan a `src/graphql/resolvers.ts`

### Path aliases (tsconfig)

```
@config/*      → src/config/*
@modules/*     → src/modules/*
@graphql/*     → src/graphql/*
@middlewares/*  → src/middlewares/*
@lib/*         → src/lib/*
@shared/*      → src/shared/*
@database/*    → src/database/*
```

### ESM imports

Siempre usan extensión `.js` aunque el source sea `.ts` (ej: `import './server.js'`).

### Base de datos

- IDs: UUID v4 (`gen_random_uuid()`)
- Timestamps: `TIMESTAMPTZ`, `created_at` con `DEFAULT NOW()`
- `updated_at`: trigger automático en `users`, `movies`, `series`
- Naming: snake_case en DB, camelCase en DTOs/GraphQL
- Check constraint en `reviews` y `favorites`: cada row apunta a movie **XOR** serie

### GraphQL

- Schema-first: toda la SDL está en archivos `.graphql`
- `DateTime` scalar personalizado (ISO-8601)
- `@auth` directive: field-level protection. Uso: `@auth` (cualquier usuario autenticado) o `@auth(role: ADMIN)`
- Contexto: `GraphQLContext { user: AuthUser | null, di: { genreService } }`

---

## Patrones

### Module pattern (4-capas)

```
Repository (SQL) → Service (business logic + mapping) → Resolver (GraphQL adapter)
```

Cada capa se comunica con la siguiente a través de su interfaz. Los resolvers llaman a servicios, nunca directamente a repositorios.

### Dependency Injection

Awilix container con `injectionMode: 'CLASSIC'`. Registros en `src/lib/di/register.ts`. Actualmente solo registrado: `genreRepository` y `genreService` (singletons).

### Error handling

Jerarquía de errores operacionales:

```
AppError (statusCode, code, isOperational)
├── NotFoundError      (404, NOT_FOUND)
├── UnauthorizedError  (401, UNAUTHORIZED)
├── ValidationError    (400, VALIDATION_ERROR, details?)
└── ConflictError      (409, CONFLICT)
```

`errorHandler.middleware.ts` captura `AppError` y devuelve JSON estructurado `{ errors: [{ message, code, details? }] }`. Errores no operacionales devuelven 500 con mensaje oculto en producción.

### Auth directive

`auth.directive.ts` usa `@graphql-tools/utils` para mapear el schema. Intercepta fields con `@auth`, verifica `context.user` existe y opcionalmente el rol. Esto es independiente del `authMiddleware` Express (que solo extrae el JWT y lo pone en `req.user`).

---

## Estado del proyecto

| Componente | Estado |
|------------|--------|
| Schemas GraphQL | Completos (11 archivos .graphql) |
| Módulos (model/mapper/repository/service) | Los 10 módulos implementados completamente |
| Resolvers Genre | ✅ Funcional — conectado vía DI a GenreService |
| Resolvers Auth | ❌ Stubs — `login` y `register` lanzan `'Not implemented'` |
| Otros resolvers | ❌ Stubs — devuelven `[]` o `null` |
| DI Container | Definido, pero solo genreService registrado |
| AuthService/AuthRepository | Implementados pero no conectados a resolvers |
| Migración DB | Completa (schema inicial) |
| Seeds | 10 géneros base |
| CI | GitHub Actions (lint → typecheck → migrate) |
| Tests | ❌ No hay — ningún framework instalado |

---

## Cómo ejecutar el proyecto

### Requisitos

- Node.js 20+
- pnpm 9+
- Docker

### Setup local

```bash
cp .env.example .env        # ajustar credenciales DB si es necesario
docker compose up -d postgres
pnpm install
pnpm run migrate:up
pnpm run dev                # tsx watch src/index.ts → http://localhost:4000/graphql
```

### Comandos útiles

| Comando | Propósito |
|---------|-----------|
| `pnpm run dev` | Dev server con hot-reload |
| `pnpm run build` | Compilar con `tsc -p tsconfig.build.json` |
| `pnpm run start` | Ejecutar `dist/index.js` compilado |
| `pnpm run lint` | ESLint |
| `pnpm run lint:fix` | ESLint con auto-fix |
| `pnpm run format` | Prettier |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run migrate:create -- <name>` | Nueva migración |
| `pnpm run migrate:up` | Aplicar migraciones |
| `pnpm run migrate:down` | Rollback última migración |

### Verificación pre-commit

`pnpm run lint && pnpm run typecheck`

---

## Cómo hacer deploy

### Docker build (producción)

```bash
docker build -t graphql-movies-platform .
docker run -p 4000:4000 --env-file .env graphql-movies-platform
```

El `Dockerfile` usa multi-stage build:
1. **builder**: Node 20-alpine, instala dependencias, ejecuta `pnpm run build`
2. **runner**: Copia `dist/` y `node_modules/`, ejecuta como usuario no-root, expone puerto 4000

### docker-compose (producción)

El servicio `app` está comentado en `docker-compose.yml`. Para producción, descomentarlo y ajustar variables de entorno.

### CI/CD

GitHub Actions en `.github/workflows/ci.yml`:
- Dispara en push a `main`/`develop` y PR a `main`
- Jobs: lint → typecheck → migrate (requiere PostgreSQL como service container)
- Usa `pnpm install --frozen-lockfile`

---

## Variables de entorno

| Variable | Requerida | Default | Descripción |
|----------|-----------|---------|-------------|
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `PORT` | No | `4000` | Puerto del servidor |
| `HOST` | No | `0.0.0.0` | Host del servidor |
| `DATABASE_URL` | Sí | — | Connection string de PostgreSQL |
| `DB_HOST` | No | — | Host DB (alternativa a URL) |
| `DB_PORT` | No | — | Puerto DB |
| `DB_NAME` | No | — | Nombre DB |
| `DB_USER` | No | — | Usuario DB |
| `DB_PASSWORD` | No | — | Password DB |
| `JWT_SECRET` | Sí (min 32 chars) | — | Secreto para firmar JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | Tiempo de expiración JWT |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Tiempo de expiración refresh |
| `LOG_LEVEL` | No | `info` | Nivel de log (fatal..trace) |
| `LOG_PRETTY` | No | `false` | Pretty-print en desarrollo |

> **Nota:** `.env` está committed con valores de desarrollo (JWT secret genérico). No usar en producción.
