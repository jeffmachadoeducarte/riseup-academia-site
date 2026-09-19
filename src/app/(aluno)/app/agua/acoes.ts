'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, desc } from 'drizzle-orm';
import { db, schema } from '@/db';
import { alunoAtual } from '@/lib/auth';
import { hojeBR } from '@/lib/dados-aluno';

/** Registra um consumo. `ml` vem da interface, mas é validado aqui. */
export async function registrarAgua(ml: number) {
  const { aluno } = await alunoAtual();

  // Nunca confiar no valor que chega do cliente.
  if (!Number.isFinite(ml) || ml <= 0 || ml > 3000) {
    return { erro: 'Quantidade inválida.' };
  }

  await db.insert(schema.registrosAgua).values({
    alunoId: aluno.id,
    dia: hojeBR(),
    ml: Math.round(ml),
  });

  revalidatePath('/app/agua');
  revalidatePath('/app');
  return { ok: true };
}

/** Desfaz o último registro do dia. */
export async function desfazerUltimo() {
  const { aluno } = await alunoAtual();

  const ultimo = await db.query.registrosAgua.findFirst({
    where: and(
      eq(schema.registrosAgua.alunoId, aluno.id),
      eq(schema.registrosAgua.dia, hojeBR()),
    ),
    orderBy: desc(schema.registrosAgua.id),
  });

  if (!ultimo) return { erro: 'Nada para desfazer hoje.' };

  await db.delete(schema.registrosAgua).where(eq(schema.registrosAgua.id, ultimo.id));
  revalidatePath('/app/agua');
  revalidatePath('/app');
  return { ok: true };
}

/** Salva meta e programação de lembretes. */
export async function salvarProgramacao(dados: FormData) {
  const { aluno } = await alunoAtual();

  const metaMl = Number(dados.get('metaMl'));
  const copoMl = Number(dados.get('copoMl'));
  const lembretesAtivos = dados.get('lembretesAtivos') === 'on';
  const inicio = String(dados.get('inicio') ?? '08:00');
  const fim = String(dados.get('fim') ?? '21:00');
  const intervalo = Number(dados.get('intervalo'));

  if (!Number.isFinite(metaMl) || metaMl < 500 || metaMl > 8000) {
    return { erro: 'A meta precisa ficar entre 500 ml e 8 L.' };
  }
  if (!Number.isFinite(copoMl) || copoMl < 50 || copoMl > 2000) {
    return { erro: 'O copo precisa ficar entre 50 ml e 2 L.' };
  }
  if (!Number.isFinite(intervalo) || intervalo < 15 || intervalo > 480) {
    return { erro: 'O intervalo precisa ficar entre 15 e 480 minutos.' };
  }
  if (fim <= inicio) {
    return { erro: 'O horário final precisa ser depois do inicial.' };
  }

  const valores = {
    metaDiariaMl: Math.round(metaMl),
    copoMl: Math.round(copoMl),
    lembretesAtivos,
    lembreteInicio: inicio,
    lembreteFim: fim,
    lembreteIntervaloMin: Math.round(intervalo),
    atualizadoEm: new Date().toISOString(),
  };

  const existente = await db.query.metasAgua.findFirst({
    where: eq(schema.metasAgua.alunoId, aluno.id),
  });

  if (existente) {
    await db.update(schema.metasAgua).set(valores)
      .where(eq(schema.metasAgua.alunoId, aluno.id));
  } else {
    await db.insert(schema.metasAgua).values({ alunoId: aluno.id, ...valores });
  }

  revalidatePath('/app/agua');
  revalidatePath('/app');
  return { ok: true };
}
