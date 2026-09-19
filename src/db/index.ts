import 'server-only';
import { abrirBanco } from './conexao';
import * as schema from './schema';

/**
 * Instância única por processo.
 *
 * Em desenvolvimento o Next recarrega os módulos a cada alteração; sem o cache
 * no globalThis cada recarga abriria outra conexão com o arquivo e o SQLite
 * acabaria travando em "database is locked".
 */
const cache = globalThis as unknown as { __riseupDb?: ReturnType<typeof abrirBanco> };
const conexao = (cache.__riseupDb ??= abrirBanco());

if (process.env.NODE_ENV !== 'production') cache.__riseupDb = conexao;

export const db = conexao.db;
export const sqlite = conexao.sqlite;
export { schema };
