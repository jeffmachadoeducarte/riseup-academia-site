/**
 * Aplica as migrações do Drizzle. JavaScript puro de propósito: roda no
 * contêiner de produção, onde não existe `tsx` nem TypeScript.
 *
 * Migração é SQL — não precisa do schema tipado para rodar.
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const caminho = process.env.DATABASE_URL ?? './dados/riseup.db';
mkdirSync(dirname(caminho), { recursive: true });

const sqlite = new Database(caminho);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

migrate(drizzle(sqlite), { migrationsFolder: './drizzle' });
sqlite.close();

console.log(`[riseup] banco migrado em ${caminho}`);
