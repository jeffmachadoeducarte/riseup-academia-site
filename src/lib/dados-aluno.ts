import 'server-only';
import { and, eq, gte, desc, sql } from 'drizzle-orm';
import { db, schema } from '@/db';

/** Dia de hoje em AAAA-MM-DD, no fuso de Brasília. */
export function hojeBR() {
  return new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
}

/** Dia da semana de hoje (0 = domingo) no fuso de Brasília. */
export function diaSemanaHojeBR() {
  return new Date(Date.now() - 3 * 3600e3).getUTCDay();
}

/** Idade em anos a partir de uma data AAAA-MM-DD. */
export function idadeEmAnos(nascimento: string | null) {
  if (!nascimento) return null;
  const ms = Date.now() - new Date(`${nascimento}T12:00:00Z`).getTime();
  return Math.floor(ms / 31557600000);
}

/** Data de hoje por extenso, para cabeçalhos. */
export function hojePorExtenso() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  });
}

export function formatarReal(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ───────────────────────────────────────────────── hidratação ────────── */

export async function resumoAgua(alunoId: number) {
  const meta = await db.query.metasAgua.findFirst({
    where: eq(schema.metasAgua.alunoId, alunoId),
  });

  const hoje = hojeBR();
  const somaHoje = await db
    .select({ total: sql<number>`coalesce(sum(${schema.registrosAgua.ml}), 0)` })
    .from(schema.registrosAgua)
    .where(and(eq(schema.registrosAgua.alunoId, alunoId), eq(schema.registrosAgua.dia, hoje)))
    .get();

  const consumido = somaHoje?.total ?? 0;
  const metaMl = meta?.metaDiariaMl ?? 2000;

  return {
    meta,
    metaMl,
    consumido,
    copoMl: meta?.copoMl ?? 250,
    percentual: metaMl > 0 ? Math.min(100, Math.round((consumido / metaMl) * 100)) : 0,
  };
}

/** Consumo dos últimos `dias` dias, do mais antigo para o mais novo. */
export async function historicoAgua(alunoId: number, dias = 7) {
  const limite = new Date(Date.now() - (dias - 1) * 864e5).toISOString().slice(0, 10);

  const linhas = await db
    .select({
      dia: schema.registrosAgua.dia,
      total: sql<number>`sum(${schema.registrosAgua.ml})`,
    })
    .from(schema.registrosAgua)
    .where(and(eq(schema.registrosAgua.alunoId, alunoId), gte(schema.registrosAgua.dia, limite)))
    .groupBy(schema.registrosAgua.dia)
    .all();

  const porDia = new Map(linhas.map((l) => [l.dia, l.total]));

  return Array.from({ length: dias }, (_, i) => {
    const d = new Date(Date.now() - (dias - 1 - i) * 864e5).toISOString().slice(0, 10);
    return { dia: d, ml: porDia.get(d) ?? 0 };
  });
}

/* ───────────────────────────────────────────────── frequência ────────── */

export async function resumoFrequencia(alunoId: number) {
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const semana = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.checkins)
    .where(and(
      eq(schema.checkins.alunoId, alunoId),
      gte(schema.checkins.em, inicioSemana.toISOString()),
    ))
    .get();

  const mes = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.checkins)
    .where(and(
      eq(schema.checkins.alunoId, alunoId),
      gte(schema.checkins.em, new Date(Date.now() - 30 * 864e5).toISOString()),
    ))
    .get();

  const total = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.checkins)
    .where(eq(schema.checkins.alunoId, alunoId))
    .get();

  const ultimo = await db.query.checkins.findFirst({
    where: eq(schema.checkins.alunoId, alunoId),
    orderBy: desc(schema.checkins.em),
  });

  return {
    semana: semana?.n ?? 0,
    mes: mes?.n ?? 0,
    total: total?.n ?? 0,
    ultimo: ultimo?.em ?? null,
    jaTreinouHoje: ultimo ? ultimo.em.slice(0, 10) === hojeBR() : false,
  };
}

/** Sequência de semanas seguidas com ao menos um treino. */
export async function sequenciaSemanas(alunoId: number) {
  const linhas = await db
    .select({ em: schema.checkins.em })
    .from(schema.checkins)
    .where(eq(schema.checkins.alunoId, alunoId))
    .orderBy(desc(schema.checkins.em))
    .all();

  if (linhas.length === 0) return 0;

  const semanasComTreino = new Set(
    linhas.map((l) => {
      const d = new Date(l.em);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().slice(0, 10);
    }),
  );

  let sequencia = 0;
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - cursor.getDay());

  while (semanasComTreino.has(cursor.toISOString().slice(0, 10))) {
    sequencia += 1;
    cursor.setDate(cursor.getDate() - 7);
  }
  return sequencia;
}

/* ──────────────────────────────────────────────────── aulas ──────────── */

export async function grade() {
  return db.query.aulas.findMany({
    where: eq(schema.aulas.ativa, true),
    orderBy: [schema.aulas.diaSemana, schema.aulas.horaInicio],
  });
}

export const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** Próxima aula a partir de agora, varrendo a semana. */
export async function proximaAula() {
  const aulas = await grade();
  if (aulas.length === 0) return null;

  const agora = new Date(Date.now() - 3 * 3600e3); // Brasília
  const diaHoje = agora.getUTCDay();
  const horaAgora = agora.toISOString().slice(11, 16);

  for (let salto = 0; salto < 7; salto++) {
    const dia = (diaHoje + salto) % 7;
    const doDia = aulas
      .filter((a) => a.diaSemana === dia)
      .filter((a) => salto > 0 || a.horaInicio > horaAgora)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    if (doDia[0]) return { aula: doDia[0], emDias: salto };
  }
  return null;
}

/* ───────────────────────────────────────────── financeiro ────────────── */

export async function resumoFinanceiro(alunoId: number) {
  const pagamentos = await db.query.pagamentos.findMany({
    where: eq(schema.pagamentos.alunoId, alunoId),
    orderBy: desc(schema.pagamentos.competencia),
  });

  const matricula = await db.query.matriculas.findFirst({
    where: and(eq(schema.matriculas.alunoId, alunoId), eq(schema.matriculas.situacao, 'ativa')),
  });

  const plano = matricula
    ? await db.query.planos.findFirst({ where: eq(schema.planos.id, matricula.planoId) })
    : null;

  const hoje = hojeBR();
  const emAberto = pagamentos.filter(
    (p) => p.situacao === 'aberto' || p.situacao === 'atrasado',
  );
  const atrasados = emAberto.filter((p) => p.vencimento < hoje);

  return { pagamentos, matricula, plano, emAberto, atrasados };
}

/* ─────────────────────────────────────── treinos e receitas ──────────── */

export async function treinoDoAluno(
  perfil: (typeof schema.PERFIS_TREINO)[number] | null,
  genero: 'masculino' | 'feminino' | 'outro' | null,
) {
  if (!perfil) return [];

  const todos = await db.query.treinos.findMany({
    where: and(eq(schema.treinos.perfil, perfil), eq(schema.treinos.publicado, true)),
    orderBy: schema.treinos.ordem,
  });

  // Conteúdo sem gênero serve para todo mundo; com gênero, só para aquele.
  return todos.filter((t) => !t.genero || t.genero === genero);
}

export async function exerciciosDe(treinoId: number) {
  return db.query.exerciciosTreino.findMany({
    where: eq(schema.exerciciosTreino.treinoId, treinoId),
    orderBy: [schema.exerciciosTreino.bloco, schema.exerciciosTreino.ordem],
  });
}

export async function receitasDoAluno(
  perfil: (typeof schema.PERFIS_TREINO)[number] | null,
  genero: 'masculino' | 'feminino' | 'outro' | null,
) {
  if (!perfil) return [];
  const todas = await db.query.receitas.findMany({
    where: and(eq(schema.receitas.perfil, perfil), eq(schema.receitas.publicada, true)),
  });
  return todas.filter((r) => !r.genero || r.genero === genero);
}

/* ─────────────────────────────────────────────────── avisos ──────────── */

export async function avisosPara(perfil: (typeof schema.PERFIS_TREINO)[number] | null) {
  const todos = await db.query.avisos.findMany({
    where: eq(schema.avisos.ativo, true),
    orderBy: desc(schema.avisos.publicadoEm),
  });
  const agora = new Date().toISOString();
  return todos
    .filter((a) => !a.expiraEm || a.expiraEm > agora)
    .filter((a) => !a.perfil || a.perfil === perfil);
}
