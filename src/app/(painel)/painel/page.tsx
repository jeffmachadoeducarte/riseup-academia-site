import { sql, eq, isNull, gte } from 'drizzle-orm';
import Link from 'next/link';
import { db, schema } from '@/db';
import { exigirPerfil } from '@/lib/auth';
import { hojeBR, hojePorExtenso } from '@/lib/dados-aluno';
import { IconArrow } from '@/components/ui/Icons';

export const dynamic = 'force-dynamic';

export default async function VisaoGeral() {
  await exigirPerfil('master');

  const [totalAlunos, semPerfil, checkinsHoje, emAtraso] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(schema.alunos).get(),
    db.select({ n: sql<number>`count(*)` }).from(schema.alunos)
      .where(isNull(schema.alunos.perfilTreino)).get(),
    db.select({ n: sql<number>`count(*)` }).from(schema.checkins)
      .where(gte(schema.checkins.em, `${hojeBR()}T00:00:00.000Z`)).get(),
    db.select({ n: sql<number>`count(*)` }).from(schema.pagamentos)
      .where(sql`${schema.pagamentos.situacao} != 'pago' and ${schema.pagamentos.situacao} != 'cancelado' and ${schema.pagamentos.vencimento} < ${hojeBR()}`)
      .get(),
  ]);

  const pendentes = await db.query.alunos.findMany({
    where: isNull(schema.alunos.perfilTreino),
    limit: 8,
  });

  const usuariosPendentes = await Promise.all(
    pendentes.map((a) => db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, a.usuarioId) })),
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="t-display text-[2rem] text-bone-50">Visão geral</h1>
        <p className="mt-1.5 text-[0.88rem] text-bone-400">
          {hojePorExtenso()}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica valor={totalAlunos?.n ?? 0} rotulo="Alunos" />
        <Metrica valor={semPerfil?.n ?? 0} rotulo="Sem perfil definido" alerta={(semPerfil?.n ?? 0) > 0} />
        <Metrica valor={checkinsHoje?.n ?? 0} rotulo="Treinos hoje" />
        <Metrica valor={emAtraso?.n ?? 0} rotulo="Parcelas em atraso" alerta={(emAtraso?.n ?? 0) > 0} />
      </div>

      <section className="rounded-[3px] border border-ink-700 bg-ink-850/50">
        <header className="flex items-center justify-between gap-4 border-b border-ink-800 px-6 py-4">
          <h2 className="font-display text-[0.9rem] font-bold uppercase tracking-wide text-bone-50">
            Aguardando definição de perfil
          </h2>
          <Link href="/painel/alunos" className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wider text-rise-500">
            Todos os alunos
            <IconArrow className="h-3.5 w-3.5" />
          </Link>
        </header>

        {pendentes.length === 0 ? (
          <p className="px-6 py-10 text-center text-[0.85rem] text-bone-500">
            Todos os alunos já têm perfil definido.
          </p>
        ) : (
          <ul>
            {pendentes.map((a, i) => (
              <li key={a.id} className="border-b border-ink-800/60 last:border-0">
                <Link
                  href={`/painel/alunos/${a.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ink-800/40"
                >
                  <span>
                    <span className="block text-[0.9rem] text-bone-50">
                      {usuariosPendentes[i]?.nome ?? `Aluno ${a.id}`}
                    </span>
                    <span className="mt-0.5 block text-[0.72rem] text-bone-500">
                      {usuariosPendentes[i]?.email}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wider text-rise-500">
                    Definir perfil
                    <IconArrow className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metrica({ valor, rotulo, alerta }: { valor: number; rotulo: string; alerta?: boolean }) {
  return (
    <div className="rounded-[3px] border border-ink-700 bg-ink-850/50 px-5 py-6">
      <p className={alerta ? 'font-display text-[2.2rem] leading-none text-rise-500' : 'font-display text-[2.2rem] leading-none text-bone-50'}>
        {valor}
      </p>
      <p className="mt-2 text-[0.68rem] uppercase tracking-wider text-bone-500">{rotulo}</p>
    </div>
  );
}
