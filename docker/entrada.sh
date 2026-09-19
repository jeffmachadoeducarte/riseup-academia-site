#!/bin/sh
set -e

# O banco é um arquivo no volume. Um deploy novo aplica o que mudou de schema
# antes de começar a servir.
echo "[riseup] aplicando migrações..."
node scripts/migrar.mjs

# Só faz alguma coisa se RISEUP_SEMEAR_DEMO=true E o banco estiver vazio.
echo "[riseup] conferindo dados de demonstração..."
node scripts/semear-producao.mjs

echo "[riseup] servindo na porta ${PORT:-3000}"
exec node server.js
