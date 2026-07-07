# GraphQL Movies & Series Platform

## Stack
- **Runtime:** Node.js 20+, pnpm 9+, TypeScript (ESM)
- **GraphQL:** Schema-first via graphql-yoga; SDL files auto-loaded from `src/graphql/schemas/**/*.graphql`
- **DB:** PostgreSQL 16, raw SQL via `pg`, migrations via `node-pg-migrate`
- **Auth:** JWT (bcrypt + jsonwebtoken); `@auth` directive for field-level protection
- **Logger:** Pino (pretty-print in dev via `LOG_PRETTY=true`)
- **Validation:** Zod (currently only used for env validation)

## Dev setup
```bash
cp .env.example .env        # adjust DB credentials
docker compose up -d postgres
pnpm install
pnpm run migrate:up
pnpm run dev                # tsx watch src/index.ts
```
GraphQL Playground at `http://localhost:4000/graphql`

## Commands
| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Dev server with hot-reload (tsx watch) |
| `pnpm run build` | Compile with `tsc -p tsconfig.build.json` |
| `pnpm run start` | Run compiled `dist/index.js` |
| `pnpm run lint` | ESLint on `src/**/*.ts` |
| `pnpm run lint:fix` | ESLint --fix |
| `pnpm run format` | Prettier `src/**/*.ts` |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run migrate:create -- <name>` | Generate a new migration file |
| `pnpm run migrate:up` | Apply pending migrations |
| `pnpm run migrate:down` | Rollback last migration |

Verification order when making changes: `pnpm run lint && pnpm run typecheck`

## Architecture

**Entrypoint:** `src/index.ts` → `src/server.ts` → `src/app.ts`

**Module pattern** (`src/modules/<name>/`):
- `*.model.ts` — DB row interface (snake_case fields)
- `*.repository.ts` — raw SQL queries via `query()` helper from `config/database.ts`
- `*.service.ts` — business logic, calls repository, returns DTOs
- `*.mapper.ts` — `Model → DTO` (snake_case → camelCase)

**GraphQL layer** (`src/graphql/`):
- `schemas/<name>/*.graphql` — SDL type definitions (loaded via `@graphql-tools/load-files`)
- `schemas/<name>/*.resolver.ts` — resolver functions (call services directly)
- Context type: `GraphQLContext` with `user: AuthUser | null` (from JWT middleware)

**Auth directive:** `@auth` or `@auth(role: ADMIN)` on SDL fields → enforced by `auth.directive.ts`

## Important quirks
- **No test framework installed.** `tests/` dir is empty. No test deps in package.json.
- **DI container (Awilix)** is defined in `src/lib/di/container.ts` but **not wired into the app** — no registrations exist, resolvers instantiate dependencies manually or are stubs.
- **Auth resolvers are stubs** — `login` and `register` throw `'Not implemented'`.
- **AuthService, AuthRepository** and their dependencies exist in `src/modules/auth/` but are unused.
- **Many resolvers** return `[]` or `null` — the app is partially built.
- **ESM imports** use `.js` extensions (e.g. `import './server.js'`), even though the source is `.ts`.
- **Path aliases** configured in tsconfig (`@config/*`, `@modules/*`, etc.) — use them for imports.
- **`.env` is committed** with a dev JWT secret. `.env.example` has different default DB name (`movies_dm_platform` vs `movies_platform`).

## Pre-commit / CI
- **pre-commit:** runs `lint-staged` → `eslint --fix && prettier --write` on staged `.ts` files
- **commit messages:** must follow conventional commits (enforced by commitlint via husky)
- **CI** (GitHub Actions): `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `migrate:up` (requires Postgres service on `localhost:5432`)
