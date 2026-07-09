FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json ./
COPY spectaql-config.yml ./
COPY src/ src/
COPY docs/ docs/
RUN pnpm run build && pnpm run docs:generate

RUN pnpm prune --prod

FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json ./

USER appuser

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
