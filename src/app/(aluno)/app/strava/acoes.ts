'use server';

import { revalidatePath } from 'next/cache';
import { alunoAtual } from '@/lib/auth';
import { sincronizar, desconectar } from '@/lib/strava';

export async function sincronizarAgora() {
  const { aluno } = await alunoAtual();
  const r = await sincronizar(aluno.id);
  revalidatePath('/app/strava');
  return r;
}

export async function desconectarConta() {
  const { aluno } = await alunoAtual();
  await desconectar(aluno.id);
  revalidatePath('/app/strava');
  return { ok: true };
}
