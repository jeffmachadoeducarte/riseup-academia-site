# ══════════════════════════════════════════════════════════════════════════
#  RISE UP ACADEMIA — imagem de produção
#  Build multi-estágio: a imagem final leva só o runtime, sem toolchain.
# ══════════════════════════════════════════════════════════════════════════

# ---------- 1. dependências ------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Só os manifests: essa camada só é refeita quando as dependências mudam.
COPY package.json package-lock.json ./

# `--ignore-scripts` evita postinstall de terceiros durante o build.
# Os binários de ffmpeg são devDependencies e não entram na imagem: a mídia
# já vem gerada em `public/assets`.
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ---------- 2. build -------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Domínio final: usado em canonical, sitemap, robots e Open Graph.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# "true" (padrão) = prévia, sai do índice dos buscadores.
# "false" = site oficial, indexável. Ver docs/deploy-easypanel.md.
ARG NEXT_PUBLIC_MODO_PREVIA=true
ENV NEXT_PUBLIC_MODO_PREVIA=${NEXT_PUBLIC_MODO_PREVIA}

RUN npm run build

# ---------- 3. runtime -----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Nunca rodar como root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# `output: 'standalone'` monta um servidor mínimo com só o que é usado.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# O EasyPanel usa isto para saber se o contêiner subiu de fato.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
