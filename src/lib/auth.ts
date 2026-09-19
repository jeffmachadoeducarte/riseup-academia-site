import 'server-only';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq, ne, lt } from 'drizzle-orm';
import { db, schema } from '@/db';

const scrypt = promisify(_scrypt) as (
  senha: string, sal: Buffer, tamanho: number,
) => Promise<Buffer>;

const COOKIE = 'riseup_sessao';
const DIAS_SESSAO = 30; // app de aluno: relogar toda semana afasta o uso diário

export type Perfil = 'master' | 'aluno';

export type UsuarioSessao = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  precisaTrocarSenha: boolean;
};

/* ─────────────────────────────────────────────────── senha ───────────── */

/**
 * Hash de senha com scrypt (nativo do Node, sem dependência externa).
 * Formato: scrypt$<sal-hex>$<hash-hex>
 *
 * A senha em texto puro deixa de existir depois deste ponto — nem a direção
 * da academia consegue ler a senha de um aluno.
 */
export async function criarHashSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const hash = await scrypt(senha, sal, 64);
  return `scrypt$${sal.toString('hex')}$${hash.toString('hex')}`;
}

export async function conferirSenha(senha: string, guardado: string): Promise<boolean> {
  const [algoritmo, salHex, hashHex] = guardado.split('$');
  if (algoritmo !== 'scrypt' || !salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const obtido = await scrypt(senha, Buffer.from(salHex, 'hex'), esperado.length);
  // timingSafeEqual: comparar com === vazaria o tamanho do acerto pelo tempo
  return esperado.length === obtido.length && timingSafeEqual(esperado, obtido);
}

/** Senha provisória curta, sem caracteres que confundem ao ditar no balcão. */
export function gerarSenhaProvisoria() {
  return randomBytes(6).toString('base64url').replace(/[-_]/g, 'x');
}

/* ────────────────────────────────────────────────── sessão ───────────── */

export async function abrirSessao(usuarioId: number) {
  const id = randomBytes(32).toString('hex');
  const expira = new Date(Date.now() + DIAS_SESSAO * 864e5);

  await db.insert(schema.sessoes).values({
    id,
    usuarioId,
    expiraEm: expira.toISOString(),
    ultimoUso: new Date().toISOString(),
  });

  (await cookies()).set(COOKIE, id, {
    httpOnly: true,                                   // fora do alcance de JS
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expira,
  });

  await db.update(schema.usuarios)
    .set({ ultimoAcesso: new Date().toISOString() })
    .where(eq(schema.usuarios.id, usuarioId));
}

export async function encerrarSessao() {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (id) await db.delete(schema.sessoes).where(eq(schema.sessoes.id, id));
  jar.delete(COOKIE);
}

/** Depois de trocar a senha: derruba as sessões de outros aparelhos, mantém esta. */
export async function encerrarOutrasSessoes(usuarioId: number) {
  const atual = (await cookies()).get(COOKIE)?.value ?? '';
  await db.delete(schema.sessoes).where(
    and(eq(schema.sessoes.usuarioId, usuarioId), ne(schema.sessoes.id, atual)),
  );
}

/** Limpeza oportunista de sessões vencidas. */
async function limparVencidas() {
  await db.delete(schema.sessoes)
    .where(lt(schema.sessoes.expiraEm, new Date().toISOString()));
}

/* ───────────────────────────────────────── leitura da sessão ─────────── */

/** Usuário da sessão atual, ou `null`. Não redireciona. */
export async function usuarioAtual(): Promise<UsuarioSessao | null> {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;

  const linha = await db
    .select({
      sessaoId: schema.sessoes.id,
      expiraEm: schema.sessoes.expiraEm,
      id: schema.usuarios.id,
      nome: schema.usuarios.nome,
      email: schema.usuarios.email,
      perfil: schema.usuarios.perfil,
      ativo: schema.usuarios.ativo,
      precisaTrocarSenha: schema.usuarios.precisaTrocarSenha,
    })
    .from(schema.sessoes)
    .innerJoin(schema.usuarios, eq(schema.usuarios.id, schema.sessoes.usuarioId))
    .where(eq(schema.sessoes.id, id))
    .get();

  if (!linha) return null;

  // Sessão vencida ou usuário desativado: derruba na hora.
  if (new Date(linha.expiraEm) < new Date() || !linha.ativo) {
    await db.delete(schema.sessoes).where(eq(schema.sessoes.id, linha.sessaoId));
    void limparVencidas();
    return null;
  }

  await db.update(schema.sessoes)
    .set({ ultimoUso: new Date().toISOString() })
    .where(eq(schema.sessoes.id, linha.sessaoId));

  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    perfil: linha.perfil,
    precisaTrocarSenha: linha.precisaTrocarSenha,
  };
}

/** Exige alguém logado. Manda para /entrar se não houver. */
export async function exigirUsuario(): Promise<UsuarioSessao> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect('/entrar');
  if (usuario.precisaTrocarSenha) redirect('/trocar-senha');
  return usuario;
}

/** Exige um perfil específico. Aluno tentando abrir o painel vai para o app. */
export async function exigirPerfil(perfil: Perfil): Promise<UsuarioSessao> {
  const usuario = await exigirUsuario();
  if (usuario.perfil !== perfil) {
    redirect(usuario.perfil === 'master' ? '/painel' : '/app');
  }
  return usuario;
}

/** Registro do aluno ligado ao usuário logado. */
export async function alunoAtual() {
  const usuario = await exigirUsuario();
  if (usuario.perfil !== 'aluno') redirect('/painel');

  const aluno = await db.query.alunos.findFirst({
    where: eq(schema.alunos.usuarioId, usuario.id),
  });
  if (!aluno) redirect('/entrar');

  return { usuario, aluno };
}

/** Para onde mandar alguém depois do login, conforme o perfil. */
export function destinoDoPerfil(perfil: Perfil) {
  return perfil === 'master' ? '/painel' : '/app';
}
