import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { cifrar, decifrar, cofreConfigurado } from './segredos';

/**
 * Integração com o Strava (OAuth 2.0).
 *
 * Depende de credenciais que a academia precisa criar em
 * https://www.strava.com/settings/api — não existe jeito de contornar isso.
 * Enquanto as variáveis não estiverem definidas, `integracaoDisponivel()`
 * devolve false e a tela explica o que falta, em vez de quebrar.
 */
const AUTORIZAR = 'https://www.strava.com/oauth/authorize';
const TOKEN = 'https://www.strava.com/oauth/token';
const API = 'https://www.strava.com/api/v3';

export function integracaoDisponivel() {
  return Boolean(
    process.env.STRAVA_CLIENT_ID &&
    process.env.STRAVA_CLIENT_SECRET &&
    cofreConfigurado(),
  );
}

/** O que falta configurar — mostrado ao master, não ao aluno. */
export function pendenciasDaIntegracao() {
  const faltando: string[] = [];
  if (!process.env.STRAVA_CLIENT_ID) faltando.push('STRAVA_CLIENT_ID');
  if (!process.env.STRAVA_CLIENT_SECRET) faltando.push('STRAVA_CLIENT_SECRET');
  if (!cofreConfigurado()) faltando.push('RISEUP_CHAVE_SEGREDOS');
  return faltando;
}

export function urlDeAutorizacao(baseUrl: string, estado: string) {
  const p = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: `${baseUrl}/api/strava/retorno`,
    response_type: 'code',
    approval_prompt: 'auto',
    // `activity:read` basta para ler as atividades; não pedimos escrita.
    scope: 'read,activity:read',
    state: estado,
  });
  return `${AUTORIZAR}?${p}`;
}

type RespostaToken = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: { id: number; firstname?: string; lastname?: string };
};

export async function trocarCodigoPorToken(codigo: string): Promise<RespostaToken> {
  const r = await fetch(TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: codigo,
      grant_type: 'authorization_code',
    }),
  });
  if (!r.ok) throw new Error(`Strava recusou a troca do código (${r.status}).`);
  return r.json();
}

async function renovarToken(refresh: string): Promise<RespostaToken> {
  const r = await fetch(TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refresh,
      grant_type: 'refresh_token',
    }),
  });
  if (!r.ok) throw new Error(`Falha ao renovar o token do Strava (${r.status}).`);
  return r.json();
}

export async function salvarConexao(alunoId: number, dados: RespostaToken) {
  const valores = {
    atletaId: String(dados.athlete?.id ?? ''),
    atletaNome: [dados.athlete?.firstname, dados.athlete?.lastname].filter(Boolean).join(' ') || null,
    tokenAcessoCifrado: cifrar(dados.access_token),
    tokenRenovacaoCifrado: cifrar(dados.refresh_token),
    expiraEm: new Date(dados.expires_at * 1000).toISOString(),
  };

  const existente = await db.query.conexoesStrava.findFirst({
    where: eq(schema.conexoesStrava.alunoId, alunoId),
  });

  if (existente) {
    await db.update(schema.conexoesStrava).set(valores)
      .where(eq(schema.conexoesStrava.alunoId, alunoId));
  } else {
    await db.insert(schema.conexoesStrava).values({ alunoId, ...valores });
  }
}

export async function conexaoDoAluno(alunoId: number) {
  return db.query.conexoesStrava.findFirst({
    where: eq(schema.conexoesStrava.alunoId, alunoId),
  });
}

export async function desconectar(alunoId: number) {
  await db.delete(schema.conexoesStrava).where(eq(schema.conexoesStrava.alunoId, alunoId));
  await db.delete(schema.atividadesStrava).where(eq(schema.atividadesStrava.alunoId, alunoId));
}

/** Token válido, renovando quando estiver perto de vencer. */
async function tokenValido(alunoId: number): Promise<string | null> {
  const conexao = await conexaoDoAluno(alunoId);
  if (!conexao) return null;

  // Margem de 5 min: um token que vence durante a chamada é um erro evitável.
  if (new Date(conexao.expiraEm).getTime() - Date.now() > 5 * 60_000) {
    return decifrar(conexao.tokenAcessoCifrado);
  }

  const novo = await renovarToken(decifrar(conexao.tokenRenovacaoCifrado));
  await db.update(schema.conexoesStrava).set({
    tokenAcessoCifrado: cifrar(novo.access_token),
    tokenRenovacaoCifrado: cifrar(novo.refresh_token),
    expiraEm: new Date(novo.expires_at * 1000).toISOString(),
  }).where(eq(schema.conexoesStrava.alunoId, alunoId));

  return novo.access_token;
}

type AtividadeStrava = {
  id: number; name: string; type: string; start_date: string;
  distance: number; moving_time: number; total_elevation_gain: number; calories?: number;
};

/** Baixa as atividades recentes e guarda no banco. */
export async function sincronizar(alunoId: number) {
  const token = await tokenValido(alunoId);
  if (!token) return { erro: 'Conta não conectada.' };

  const r = await fetch(`${API}/athlete/activities?per_page=30`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!r.ok) return { erro: `O Strava respondeu ${r.status}.` };

  const atividades: AtividadeStrava[] = await r.json();

  for (const a of atividades) {
    const linha = {
      id: String(a.id),
      alunoId,
      nome: a.name,
      tipo: a.type,
      inicioEm: a.start_date,
      distanciaM: Math.round(a.distance ?? 0),
      duracaoSeg: a.moving_time ?? 0,
      desnivelM: Math.round(a.total_elevation_gain ?? 0),
      calorias: a.calories ?? null,
      sincronizadoEm: new Date().toISOString(),
    };
    await db.insert(schema.atividadesStrava).values(linha)
      .onConflictDoUpdate({ target: schema.atividadesStrava.id, set: linha });
  }

  await db.update(schema.conexoesStrava)
    .set({ ultimaSincronia: new Date().toISOString() })
    .where(eq(schema.conexoesStrava.alunoId, alunoId));

  return { ok: true, quantidade: atividades.length };
}

export async function atividadesDoAluno(alunoId: number, limite = 10) {
  return db.query.atividadesStrava.findMany({
    where: eq(schema.atividadesStrava.alunoId, alunoId),
    orderBy: (t, { desc }) => desc(t.inicioEm),
    limit: limite,
  });
}
