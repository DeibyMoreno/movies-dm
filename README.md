# GraphQL Movies & Series Platform

Backend API para una plataforma de películas y series construida con **Node.js**, **Express**, **GraphQL (Yoga)**, **TypeScript** y **PostgreSQL**.

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Express + graphql-yoga
- **Database:** PostgreSQL 16 + raw SQL (pg)
- **GraphQL:** Schema-first, codegen-ready
- **Auth:** JWT + bcrypt
- **DI:** Awilix
- **Validation:** Zod
- **Logger:** Pino
- **Migrations:** node-pg-migrate
- **Infra:** Docker, GitHub Actions

## Requisitos

- Node.js >= 20
- pnpm >= 9
- Docker (opcional, para PostgreSQL)

## Inicio rápido

```bash
# Clonar e instalar
pnpm install

# Copiar variables de entorno
cp .env.development .env

# Iniciar PostgreSQL (si no lo tienes corriendo)
docker compose up -d postgres

# Ejecutar migraciones
pnpm run migrate:up

# Iniciar en modo desarrollo
pnpm run dev
```

GraphQL Playground disponible en `http://localhost:4000/graphql`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Desarrollo con hot-reload |
| `pnpm run build` | Compilar a JS |
| `pnpm run start` | Iniciar en producción |
| `pnpm run lint` | ESLint |
| `pnpm run typecheck` | TypeScript check |
| `pnpm run format` | Prettier |
| `pnpm run migrate:up` | Ejecutar migraciones |
| `pnpm run migrate:down` | Revertir migraciones |

## Estructura

```
src/
├── config/          # Env, DB, logger, GraphQL config
├── graphql/         # Schemas SDL, resolvers, scalars, directives
├── modules/         # Domain logic: services, repositories, models
├── middlewares/     # Express middlewares
├── lib/             # Errors, DI container, helpers
├── shared/          # Types and constants
└── database/        # Migrations and seeds
```
