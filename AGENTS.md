# GraphQL Movies & Series Platform

## Stack
- Node.js 20+, pnpm 9+, TypeScript (ESM)
- **GraphQL:** Schema-first via graphql-yoga; SDL files auto-loaded from `src/graphql/schemas/**/*.graphql`
- **DB:** PostgreSQL 16, raw SQL via `pg`, migrations via `node-pg-migrate`
- **Auth:** JWT (bcrypt + jsonwebtoken)
- **Logger:** Pino (pretty-print in dev via `LOG_PRETTY=true`)

## Dev setup
```bash
cp .env.example .env        # adjust DB credentials
docker compose up -d postgres
pnpm install
pnpm run migrate:up
pnpm run dev                # tsx watch src/index.ts
```
GraphiQL at `http://localhost:4000/graphql`

## Commands
`pnpm run dev` — tsx watch (hot-reload)  
`pnpm run build` / `start` / `lint` / `lint:fix` / `format` — standard  
`pnpm run typecheck` — `tsc --noEmit`  
`pnpm run migrate:create -- <name>` — new migration  
`pnpm run migrate:up` / `migrate:down` — apply/rollback  
`pnpm run docs:generate` / `docs:serve` — SpectaQL docs at :4400  

Verify after changes: `pnpm run lint && pnpm run typecheck`

## Architecture

**Entrypoint:** `src/index.ts` → `src/server.ts` → `src/app.ts`

**Module pattern** (`src/modules/<name>/`):
- `*.model.ts` — DB row interface (snake_case fields)
- `*.repository.ts` — raw SQL queries via `query()` helper from `config/database.ts`
- `*.service.ts` — business logic, calls repository, returns DTOs
- `*.mapper.ts` — `Model → DTO` (snake_case → camelCase)

**GraphQL layer** (`src/graphql/`):
- `schemas/<name>/*.graphql` — SDL type definitions (loaded via `@graphql-tools/load-files`)
- `schemas/<name>/*.resolver.ts` — resolver functions
- Context type: `GraphQLContext` with `user: AuthUser | null` (from JWT middleware)
- `@auth`/`@auth(role: ADMIN)` directive enforced by `auth.directive.ts`

## Quirks
- **No tests.** `tests/` empty, no test deps in package.json.
- **Partially built.** Most resolvers return `[]`/`null`; `login`/`register` throw `'Not implemented'`.
- **DI container not wired.** `src/lib/di/container.ts` (Awilix) has no registrations. AuthService/AuthRepository exist but are unused.
- **ESM imports** use `.js` extensions (e.g. `import './server.js'`).
- **Path aliases:** `@config/*`, `@modules/*`, etc.
- **`.env` committed** with dev JWT secret. `.env.example` uses different DB name (`movies_dm_platform` vs `movies_platform`).
- **Zod** is imported but only used for env validation — not wired into request/GraphQL layer.

## Git hooks / CI
- pre-commit: `lint-staged` → `eslint --fix && prettier --write` on `.ts`
- commits: conventional commits (commitlint via husky)
- CI (GitHub Actions): `install --frozen-lockfile` → `lint` → `typecheck` → `migrate:up` (needs Postgres)
