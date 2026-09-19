import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db, schema, } from '@/db';
import { ROTULO_PERFIL } from '@/db/schema';
import { exigirPerfil } from '@/lib/auth';
import { IconArrow } from '@/components/ui/Icons';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Alunos' };

export default async function Alunos() {
  await exigirPerfil('master');

  const alunos = await db.query.alunos.findMany();
  const linhas = await Promise.all(alunos.map(async (a) => ({
    aluno: a,
    usuario: await db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, a.usuarioId) }),
  })));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-display text-[2rem] text-bone-50">Alunos</h1>
          <p className="mt-1.5 text-[0.88rem] text-bone-400">
            {linhas.length} {linhas.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-[3px] border border-ink-700">
        <table className="w-full text-left">
          <thead className="bg-ink-900/70">
            <tr>
              <Th>Aluno</Th>
              <Th className="hidden sm:table-cell">E-mail</Th>
              <Th>Perfil de treino</Th>
              <Th className="w-10"><span className="sr-only">Abrir</span></Th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ aluno, usuario }) => (
              <tr key={aluno.id} className="border-t border-ink-800 transition-colors hover:bg-ink-850/60">
                <td className="px-5 py-4">
                  <Link href={`/painel/alunos/${aluno.id}`} className="text-[0.9rem] text-bone-50">
                    {usuario?.nome ?? `Aluno ${aluno.id}`}
                  </Link>
                </td>
                <td className="hidden px-5 py-4 text-[0.82rem] text-bone-500 sm:table-cell">
                  {usuario?.email}
                </td>
                <td className="px-5 py-4">
                  {aluno.perfilTreino ? (
                    <span className="rounded-full border border-ink-600 px-3 py-1 text-[0.68rem] uppercase tracking-wider text-bone-200">
                      {ROTULO_PERFIL[aluno.perfilTreino]}
                    </span>
                  ) : (
                    <span className="rounded-full border border-rise-600/60 px-3 py-1 text-[0.68rem] uppercase tracking-wider text-rise-400">
                      a definir
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/painel/alunos/${aluno.id}`} aria-label={`Abrir ${usuario?.nome}`}>
                    <IconArrow className="h-4 w-4 text-bone-500" />
                  </Link>
                </td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-[0.85rem] text-bone-500">
                  Nenhum aluno cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-bone-500 ${className}`}>
      {children}
    </th>
  );
}
