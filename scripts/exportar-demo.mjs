/**
 * Ferramenta LOCAL: exporta o banco de demonstração para SQL.
 *
 * O arquivo gerado (`drizzle/dados-demo.sql`) vai junto na imagem e é aplicado
 * no primeiro boot quando RISEUP_SEMEAR_DEMO=true. Assim a prévia sobe com
 * dados plausíveis sem duplicar a lógica dos scripts de semeadura.
 *
 *   npm run semear && node scripts/exportar-demo.mjs
 */
import Database from 'better-sqlite3';
import { writeFileSync } from 'node:fs';

const sqlite = new Database(process.env.DATABASE_URL ?? './dados/riseup.db', { readonly: true });

// Ordem importa: chaves estrangeiras.
const TABELAS = [
  'usuarios', 'alunos', 'planos', 'matriculas', 'pagamentos',
  'aulas', 'checkins', 'metas_agua', 'registros_agua',
  'treinos', 'exercicios_treino', 'receitas', 'avisos', 'configuracoes',
];

const partes = [
  '-- Dados de DEMONSTRAÇÃO da Rise Up.',
  '-- Gerado por scripts/exportar-demo.mjs. Não editar à mão.',
  '-- Aplicado apenas quando RISEUP_SEMEAR_DEMO=true e o banco está vazio.',
  'PRAGMA foreign_keys = OFF;',
  'BEGIN TRANSACTION;',
];

const literal = (v) => {
  if (v === null) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (Buffer.isBuffer(v)) return `X'${v.toString('hex')}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
};

let total = 0;
for (const tabela of TABELAS) {
  const linhas = sqlite.prepare(`SELECT * FROM ${tabela}`).all();
  if (linhas.length === 0) continue;
  const colunas = Object.keys(linhas[0]);
  partes.push(`\n-- ${tabela} (${linhas.length})`);
  for (const l of linhas) {
    partes.push(
      `INSERT INTO ${tabela} (${colunas.map((c) => `"${c}"`).join(', ')}) ` +
      `VALUES (${colunas.map((c) => literal(l[c])).join(', ')});`,
    );
  }
  total += linhas.length;
}

partes.push('COMMIT;', 'PRAGMA foreign_keys = ON;', '');
writeFileSync('./drizzle/dados-demo.sql', partes.join('\n'));
sqlite.close();

console.log(`[riseup] drizzle/dados-demo.sql — ${total} registros`);
