/**
 * Aplica os dados de demonstração no primeiro boot.
 *
 * Só age quando as DUAS condições valem:
 *   1. RISEUP_SEMEAR_DEMO=true
 *   2. a tabela de usuários está vazia
 *
 * A segunda condição é a que protege: depois que existir gente de verdade no
 * banco, este script nunca mais escreve nada, mesmo que a variável fique
 * ligada por engano.
 */
import Database from 'better-sqlite3';
import { readFileSync, existsSync } from 'node:fs';

const caminho = process.env.DATABASE_URL ?? './dados/riseup.db';
const arquivo = './drizzle/dados-demo.sql';

if (process.env.RISEUP_SEMEAR_DEMO !== 'true') {
  console.log('[riseup] demonstração desligada (RISEUP_SEMEAR_DEMO != true)');
  process.exit(0);
}

if (!existsSync(arquivo)) {
  console.log('[riseup] dados-demo.sql ausente — nada a semear');
  process.exit(0);
}

const sqlite = new Database(caminho);
const { n } = sqlite.prepare('SELECT count(*) AS n FROM usuarios').get();

if (n > 0) {
  console.log(`[riseup] banco já tem ${n} usuário(s) — semeadura ignorada`);
  sqlite.close();
  process.exit(0);
}

sqlite.exec(readFileSync(arquivo, 'utf8'));
const { total } = sqlite.prepare('SELECT count(*) AS total FROM usuarios').get();
sqlite.close();

console.log(`[riseup] dados de demonstração aplicados (${total} usuários)`);
console.log('[riseup] ⚠️  contas de teste ativas — não use com alunos reais');
