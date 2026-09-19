'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { db, schema } from '@/db';
import { conferirSenha, abrirSessao, destinoDoPerfil, encerrarSessao } from '@/lib/auth';

export type EstadoEntrar = { erro?: string };

/**
 * Freio de tentativas por e-mail, em memória do processo.
 *
 * Não substitui um rate limit de verdade na borda, mas já corta o ataque de
 * força bruta mais banal sem depender de infraestrutura extra. Reinicia a cada
 * deploy — o que é aceitável para o porte deste sistema.
 */
const tentativas = new Map<string, { contador: number; bloqueadoAte: number }>();
const MAX_TENTATIVAS = 6;
const BLOQUEIO_MS = 10 * 60 * 1000;

function registrarFalha(chave: string) {
  const atual = tentativas.get(chave) ?? { contador: 0, bloqueadoAte: 0 };
  atual.contador += 1;
  if (atual.contador >= MAX_TENTATIVAS) {
    atual.bloqueadoAte = Date.now() + BLOQUEIO_MS;
    atual.contador = 0;
  }
  tentativas.set(chave, atual);
}

export async function entrar(
  _estado: EstadoEntrar,
  dados: FormData,
): Promise<EstadoEntrar> {
  const email = String(dados.get('email') ?? '').trim().toLowerCase();
  const senha = String(dados.get('senha') ?? '');

  if (!email || !senha) return { erro: 'Preencha e-mail e senha.' };

  const freio = tentativas.get(email);
  if (freio && freio.bloqueadoAte > Date.now()) {
    const min = Math.ceil((freio.bloqueadoAte - Date.now()) / 60000);
    return { erro: `Muitas tentativas. Tente de novo em ${min} min.` };
  }

  const usuario = await db.query.usuarios.findFirst({
    where: eq(schema.usuarios.email, email),
  });

  // Mensagem única para e-mail inexistente, senha errada e conta desativada:
  // dizer "este e-mail não existe" entregaria quem é aluno da academia.
  const generico = { erro: 'E-mail ou senha incorretos.' };

  if (!usuario || !usuario.ativo) {
    registrarFalha(email);
    return generico;
  }

  const confere = await conferirSenha(senha, usuario.senhaHash);
  if (!confere) {
    registrarFalha(email);
    return generico;
  }

  tentativas.delete(email);
  await abrirSessao(usuario.id);

  redirect(usuario.precisaTrocarSenha ? '/trocar-senha' : destinoDoPerfil(usuario.perfil));
}

export async function sair() {
  await encerrarSessao();
  redirect('/entrar');
}
