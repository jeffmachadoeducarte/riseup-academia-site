import { NextResponse } from 'next/server';
import { usuarioAtual } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { integracaoDisponivel, trocarCodigoPorToken, salvarConexao } from '@/lib/strava';

export const dynamic = 'force-dynamic';

/** Retorno do OAuth do Strava. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const destino = new URL('/app/strava', url.origin);

  if (!integracaoDisponivel()) {
    destino.searchParams.set('erro', 'indisponivel');
    return NextResponse.redirect(destino);
  }

  // A sessão manda em quem é o aluno — nunca o `state` que volta do Strava,
  // que é controlado por quem montou a URL.
  const usuario = await usuarioAtual();
  if (!usuario || usuario.perfil !== 'aluno') {
    return NextResponse.redirect(new URL('/entrar', url.origin));
  }

  const aluno = await db.query.alunos.findFirst({
    where: eq(schema.alunos.usuarioId, usuario.id),
  });
  if (!aluno) return NextResponse.redirect(new URL('/entrar', url.origin));

  const codigo = url.searchParams.get('code');
  if (url.searchParams.get('error') || !codigo) {
    destino.searchParams.set('erro', 'recusado');
    return NextResponse.redirect(destino);
  }

  try {
    const dados = await trocarCodigoPorToken(codigo);
    await salvarConexao(aluno.id, dados);
  } catch {
    destino.searchParams.set('erro', 'falha');
    return NextResponse.redirect(destino);
  }

  destino.searchParams.set('conectado', '1');
  return NextResponse.redirect(destino);
}
