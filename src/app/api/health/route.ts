/**
 * Health check do contêiner (EasyPanel / Docker HEALTHCHECK).
 * Resposta mínima, sem cache, sem tocar em nada externo.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    { status: 'ok', servico: 'rise-up-academia', em: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
