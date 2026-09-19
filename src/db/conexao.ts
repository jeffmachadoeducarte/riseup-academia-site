/** Conexão crua, usável fora do Next (scripts de migração e semeadura). */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import * as schema from './schema';

export function abrirBanco(caminho = process.env.DATABASE_URL ?? './dados/riseup.db') {
  mkdirSync(dirname(caminho), { recursive: true });
  const sqlite = new Database(caminho);
  sqlite.pragma('journal_mode = WAL');   // leitura não trava na escrita
  sqlite.pragma('foreign_keys = ON');    // ON DELETE CASCADE depende disto
  return { sqlite, db: drizzle(sqlite, { schema }) };
}
