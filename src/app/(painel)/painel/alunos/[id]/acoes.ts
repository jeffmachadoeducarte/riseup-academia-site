'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { PERFIS_TREINO, type PerfilTreino } from '@/db/schema';
import { exigirPerfil } from '@/lib/auth';

/**
 * A direção aponta o perfil de treino do aluno.
 *
 * É a decisão que comanda o que o app mostra — treino, receitas e avisos
 * seguem daqui. Por isso guardamos quem definiu e quando.
 */
export async function definirPerfil(alunoId: number, dados: FormData) {
  const master = await exigirPerfil('master');

  const bruto = String(dados.get('perfil') ?? '');
  const perfil = PERFIS_TREINO.includes(bruto as PerfilTreino)
    ? (bruto as PerfilTreino)
    : null;

  if (!perfil) return { erro: 'Perfil inválido.' };

  await db.update(schema.alunos).set({
    perfilTreino: perfil,
    perfilDefinidoEm: new Date().toISOString(),
    perfilDefinidoPor: master.id,
    observacoes: String(dados.get('observacoes') ?? '') || null,
  }).where(eq(schema.alunos.id, alunoId));

  revalidatePath(`/painel/alunos/${alunoId}`);
  revalidatePath('/painel');
  revalidatePath('/painel/alunos');
  return { ok: true };
}
