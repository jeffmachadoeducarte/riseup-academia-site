# syntax=docker/dockerfile:1
# ══════════════════════════════════════════════════════════════════════════
#  RISE UP ACADEMIA — imagem de produção
#
#  Debian slim, não Alpine: better-sqlite3 é módulo nativo e precisa compilar
#  contra a mesma ABI do Node desta imagem.
# ══════════════════════════════════════════════════════════════════════════

# ---------------------------------------------------------- dependências
FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --build-from-source=better-sqlite3

# ----------------------------------------------------------------- build
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Lidas no BUILD: entram no HTML estático (canonical, sitemap, Open Graph).
# Mudou o domínio ou saiu da prévia? Precisa refazer o deploy.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

ARG NEXT_PUBLIC_MODO_PREVIA=true
ENV NEXT_PUBLIC_MODO_PREVIA=${NEXT_PUBLIC_MODO_PREVIA}

RUN npm run build

# -------------------------------------------------------------- runtime
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=/app/dados/riseup.db

RUN groupadd -r riseup && useradd -r -g riseup riseup

# O standalone traz o server.js e o better-sqlite3 já compilado.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Migração e semeadura rodam no boot. O drizzle-orm fica fora do standalone
# (é embutido nas rotas), então vai explícito para os scripts.
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts/migrar.mjs ./scripts/migrar.mjs
COPY --from=build /app/scripts/semear-producao.mjs ./scripts/semear-producao.mjs
COPY --from=build /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

COPY docker/entrada.sh /usr/local/bin/entrada.sh
RUN chmod +x /usr/local/bin/entrada.sh

# O banco vive num volume: sobrevive a redeploy.
RUN mkdir -p /app/dados && chown -R riseup:riseup /app/dados
VOLUME /app/dados

# O Next grava cache aqui. Sem o chown o servidor (que roda como `riseup`)
# leva EACCES e refaz trabalho a cada visita.
RUN mkdir -p /app/.next/cache && chown -R riseup:riseup /app/.next

USER riseup
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/local/bin/entrada.sh"]
