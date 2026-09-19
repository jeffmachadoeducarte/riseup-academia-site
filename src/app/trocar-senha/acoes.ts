'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db, schema } from '@/db';
import {
  usuarioAtual, criarHashSenha, conferirSenha,
  encerrarOutrasSessoes, destinoDoPerfil,
} from '@/lib/auth';

export type EstadoTroca = { erro?: string };

export async function trocarSenha(_estado: EstadoTroca, dados: FormData): Promise<EstadoTroca> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect('/entrar');

  const atual = String(dados.get('atual') ?? '');
  const nova = String(dados.get('nova') ?? '');
  const confirmacao = String(dados.get('confirmacao') ?? '');

  if (nova.length < 8) return { erro: 'A nova senha precisa ter ao menos 8 caracteres.' };
  if (nova !== confirmacao) return { erro: 'A confirmação não bate com a nova senha.' };
  if (nova === atual) return { erro: 'A nova senha precisa ser diferente da atual.' };

  const registro = await db.query.usuarios.findFirst({
    where: eq(schema.usuarios.id, usuario.id),
  });
  if (!registro) redirect('/entrar');

  if (!(await conferirSenha(atual, registro.senhaHash))) {
    return { erro: 'A senha atual está incorreta.' };
  }

  await db.update(schema.usuarios).set({
    senhaHash: await criarHashSenha(nova),
    precisaTrocarSenha: false,
  }).where(eq(schema.usuarios.id, usuario.id));

  // Trocou a senha: derruba os outros aparelhos, mantém este.
  await encerrarOutrasSessoes(usuario.id);

  redirect(destinoDoPerfil(usuario.perfil));
}
