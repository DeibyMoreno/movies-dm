# GraphQL Movies & Series Platform

## Stack
- Node.js 20+, pnpm 9+, TypeScript (ESM)
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
GraphiQL at `http://localhost:4000/graphql`

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
| `pnpm run docs:generate` | Generate static API docs via SpectaQL |
| `pnpm run docs:serve` | Generate + serve docs live at `http://localhost:4400` |

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
- `schemas/<name>/*.resolver.ts` — resolver functions
- Context type: `GraphQLContext` with `user: AuthUser | null` (from JWT middleware)

**Auth directive:** `@auth` or `@auth(role: ADMIN)` on SDL fields → enforced by `auth.directive.ts`

## Important quirks
- **No test framework.** `tests/` is empty, no test deps in package.json.
- **Partially built.** Many resolvers return `[]` or `null`. Auth resolvers (`login`, `register`) throw `'Not implemented'`.
- **Awilix DI container** exists in `src/lib/di/container.ts` but **is not wired** — no registrations, resolvers are stubs.
- **AuthService/AuthRepository** exist but are unused (auth resolvers are stubs).
- **ESM imports** use `.js` extensions (e.g. `import './server.js'`), even though source is `.ts`.
- **Path aliases** configured in tsconfig (`@config/*`, `@modules/*`, etc.) — use them for imports.
- **`.env` is committed** with a dev JWT secret. `.env.example` uses a different default DB name (`movies_dm_platform` vs `movies_platform`).

## Pre-commit / CI
- **pre-commit:** `lint-staged` → `eslint --fix && prettier --write` on staged `.ts` files
- **commit messages:** must follow conventional commits (commitlint via husky)
- **CI** (GitHub Actions): `install --frozen-lockfile` → `lint` → `typecheck` → `migrate:up` (needs Postgres on `localhost:5432`)
