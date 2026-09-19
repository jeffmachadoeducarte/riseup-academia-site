/**
 * Aplica as migrações do Drizzle no banco.
 * Roda no boot do contêiner e também localmente (`npm run migrar`).
 */
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { abrirBanco } from '../src/db/conexao';

const { db, sqlite } = abrirBanco();
migrate(db, { migrationsFolder: './drizzle' });
sqlite.close();
console.log('✔ Banco migrado.');
