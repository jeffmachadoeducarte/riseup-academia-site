import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { ROTULO_PERFIL } from '@/db/schema';
import { treinoDoAluno, exerciciosDe } from '@/lib/dados-aluno';
import { TituloTela, Vazio } from '@/components/app/Cartao';
import { AvisoDemonstracao, SeloDemonstracao } from '@/components/app/AvisoDemonstracao';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Meu treino' };
export const dynamic = 'force-dynamic';

export default async function Treino() {
  const { aluno } = await alunoAtual();
  const treinos = await treinoDoAluno(aluno.perfilTreino, aluno.genero);

  if (!aluno.perfilTreino) {
    return (
      <>
        <TituloTela titulo="Meu treino" />
        <Vazio
          titulo="Perfil ainda não definido"
          texto="A equipe da academia precisa fazer sua avaliação para montar o treino. Procure a recepção."
          acao={
            <a
              href={site.contato.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-[2px] bg-rise-500 px-6 py-3 font-display text-[0.75rem] font-bold uppercase tracking-wider text-white"
            >
              Agendar avaliação
            </a>
          }
        />
      </>
    );
  }

  const semAssinatura = treinos.some((t) => !t.assinadoPor);

  return (
    <div className="space-y-5">
      <TituloTela
        titulo="Meu treino"
        descricao={`Perfil ${ROTULO_PERFIL[aluno.perfilTreino].toLowerCase()}, definido pela equipe da academia.`}
      />

      {semAssinatura && <AvisoDemonstracao tipo="treino" />}

      {treinos.length === 0 && (
        <Vazio
          titulo="Nenhum treino publicado"
          texto="A academia ainda não publicou um treino para este perfil."
        />
      )}

      {await Promise.all(treinos.map(async (treino) => {
        const exercicios = await exerciciosDe(treino.id);
        const blocos = [...new Set(exercicios.map((e) => e.bloco))];

        return (
          <section key={treino.id} className="rounded-[3px] border border-ink-700 bg-ink-850/60">
            <header className="border-b border-ink-800 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="t-display text-[1.15rem] text-bone-50">{treino.titulo}</h2>
                {!treino.assinadoPor && <SeloDemonstracao />}
              </div>
              {treino.resumo && (
                <p className="mt-2 text-[0.82rem] leading-relaxed text-bone-400">{treino.resumo}</p>
              )}
              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <Meta rotulo="Nível" valor={treino.nivel} />
                {treino.diasPorSemana && <Meta rotulo="Frequência" valor={`${treino.diasPorSemana}x / semana`} />}
                {treino.duracaoMin && <Meta rotulo="Duração" valor={`${treino.duracaoMin} min`} />}
              </dl>
            </header>

            {blocos.map((bloco) => (
              <div key={bloco} className="border-b border-ink-800 last:border-0">
                {blocos.length > 1 && (
                  <p className="bg-ink-900/60 px-5 py-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-rise-500">
                    Treino {bloco}
                  </p>
                )}
                <ul>
                  {exercicios.filter((e) => e.bloco === bloco).map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between gap-4 border-b border-ink-800/60 px-5 py-3.5 last:border-0"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.88rem] leading-snug text-bone-100">{e.nome}</span>
                        {e.descansoSeg ? (
                          <span className="mt-0.5 block text-[0.7rem] text-bone-500">
                            Descanso {e.descansoSeg}s
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-display text-[0.95rem] font-bold text-bone-50">
                          {e.series}×{e.repeticoes}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="px-5 py-3.5 text-[0.7rem] text-bone-500">
              {treino.assinadoPor
                ? `Prescrito por ${treino.assinadoPor}`
                : 'Sem responsável técnico atribuído'}
            </p>
          </section>
        );
      }))}
    </div>
  );
}

function Meta({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-[0.6rem] uppercase tracking-wider text-bone-500">{rotulo}</dt>
      <dd className="mt-0.5 text-[0.8rem] capitalize text-bone-200">{valor}</dd>
    </div>
  );
}
