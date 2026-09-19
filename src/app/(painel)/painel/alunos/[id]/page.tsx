import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { ROTULO_PERFIL } from '@/db/schema';
import { exigirPerfil } from '@/lib/auth';
import { resumoFrequencia, resumoAgua, resumoFinanceiro } from '@/lib/dados-aluno';
import { IconArrow } from '@/components/ui/Icons';
import { FormularioPerfil } from './formulario';

export const dynamic = 'force-dynamic';

export default async function DetalheAluno({ params }: { params: Promise<{ id: string }> }) {
  await exigirPerfil('master');
  const { id } = await params;

  const aluno = await db.query.alunos.findFirst({
    where: eq(schema.alunos.id, Number(id)),
  });
  if (!aluno) notFound();

  const [usuario, freq, agua, financeiro, definidoPor] = await Promise.all([
    db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, aluno.usuarioId) }),
    resumoFrequencia(aluno.id),
    resumoAgua(aluno.id),
    resumoFinanceiro(aluno.id),
    aluno.perfilDefinidoPor
      ? db.query.usuarios.findFirst({ where: eq(schema.usuarios.id, aluno.perfilDefinidoPor) })
      : null,
  ]);

  return (
    <div className="space-y-7">
      <Link
        href="/painel/alunos"
        className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-wider text-bone-500 transition-colors hover:text-rise-400"
      >
        <IconArrow className="h-3.5 w-3.5 rotate-180" />
        Alunos
      </Link>

      <header>
        <h1 className="t-display text-[2rem] text-bone-50">{usuario?.nome}</h1>
        <p className="mt-1.5 text-[0.85rem] text-bone-500">{usuario?.email}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Metrica valor={String(freq.total)} rotulo="Treinos" />
        <Metrica valor={String(freq.mes)} rotulo="Em 30 dias" />
        <Metrica valor={`${agua.percentual}%`} rotulo="Água hoje" />
        <Metrica
          valor={String(financeiro.atrasados.length)}
          rotulo="Em atraso"
          alerta={financeiro.atrasados.length > 0}
        />
      </div>

      <section className="rounded-[3px] border border-ink-700 bg-ink-850/50 p-6">
        <header className="mb-5">
          <h2 className="font-display text-[1rem] font-bold uppercase tracking-wide text-bone-50">
            Perfil de treino
          </h2>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-bone-400">
            Esta escolha define o treino e as receitas que aparecem no app do
            aluno. Só a direção pode alterar.
          </p>
          {aluno.perfilTreino && aluno.perfilDefinidoEm && (
            <p className="mt-2 text-[0.72rem] text-bone-600">
              Atual: <span className="text-bone-300">{ROTULO_PERFIL[aluno.perfilTreino]}</span>
              {' · definido em '}
              {new Date(aluno.perfilDefinidoEm).toLocaleDateString('pt-BR')}
              {definidoPor ? ` por ${definidoPor.nome}` : ''}
            </p>
          )}
        </header>

        <FormularioPerfil
          alunoId={aluno.id}
          perfilAtual={aluno.perfilTreino}
          observacoes={aluno.observacoes}
        />
      </section>

      <section className="rounded-[3px] border border-ink-700 bg-ink-850/50 p-6">
        <h2 className="mb-4 font-display text-[1rem] font-bold uppercase tracking-wide text-bone-50">
          Cadastro
        </h2>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
          <Dado rotulo="Telefone" valor={aluno.telefone} />
          <Dado rotulo="Nascimento" valor={aluno.nascimento ? new Date(`${aluno.nascimento}T12:00:00Z`).toLocaleDateString('pt-BR') : null} />
          <Dado rotulo="Gênero" valor={aluno.genero} />
          <Dado rotulo="Altura" valor={aluno.alturaCm ? `${(aluno.alturaCm / 100).toFixed(2).replace('.', ',')} m` : null} />
          <Dado rotulo="Peso inicial" valor={aluno.pesoInicialG ? `${(aluno.pesoInicialG / 1000).toFixed(1).replace('.', ',')} kg` : null} />
          <Dado rotulo="Aluno desde" valor={aluno.matriculaEm ? new Date(`${aluno.matriculaEm}T12:00:00Z`).toLocaleDateString('pt-BR') : null} />
        </dl>
      </section>
    </div>
  );
}

function Metrica({ valor, rotulo, alerta }: { valor: string; rotulo: string; alerta?: boolean }) {
  return (
    <div className="rounded-[3px] border border-ink-700 bg-ink-850/50 px-5 py-5">
      <p className={alerta ? 'font-display text-[1.7rem] leading-none text-rise-500' : 'font-display text-[1.7rem] leading-none text-bone-50'}>
        {valor}
      </p>
      <p className="mt-2 text-[0.65rem] uppercase tracking-wider text-bone-500">{rotulo}</p>
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string | null }) {
  return (
    <div>
      <dt className="text-[0.62rem] uppercase tracking-wider text-bone-500">{rotulo}</dt>
      <dd className="mt-1 text-[0.88rem] capitalize text-bone-100">{valor ?? '—'}</dd>
    </div>
  );
}
