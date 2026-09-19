import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { ROTULO_PERFIL } from '@/db/schema';
import { receitasDoAluno } from '@/lib/dados-aluno';
import { TituloTela, Vazio } from '@/components/app/Cartao';
import { AvisoDemonstracao, SeloDemonstracao } from '@/components/app/AvisoDemonstracao';

export const metadata: Metadata = { title: 'Alimentação' };
export const dynamic = 'force-dynamic';

const ROTULO_REFEICAO: Record<string, string> = {
  cafe: 'Café da manhã',
  lanche: 'Lanche',
  almoco: 'Almoço',
  jantar: 'Jantar',
  'pre-treino': 'Pré-treino',
  'pos-treino': 'Pós-treino',
};

const ORDEM = ['cafe', 'pre-treino', 'almoco', 'pos-treino', 'lanche', 'jantar'];

export default async function Dieta() {
  const { aluno } = await alunoAtual();
  const receitas = await receitasDoAluno(aluno.perfilTreino, aluno.genero);

  if (!aluno.perfilTreino) {
    return (
      <>
        <TituloTela titulo="Alimentação" />
        <Vazio
          titulo="Perfil ainda não definido"
          texto="As sugestões de alimentação aparecem aqui depois da sua avaliação com a equipe da academia."
        />
      </>
    );
  }

  const porRefeicao = ORDEM
    .map((r) => ({ refeicao: r, itens: receitas.filter((x) => x.refeicao === r) }))
    .filter((g) => g.itens.length > 0);

  return (
    <div className="space-y-5">
      <TituloTela
        titulo="Alimentação"
        descricao={`Sugestões para o perfil ${ROTULO_PERFIL[aluno.perfilTreino].toLowerCase()}.`}
      />

      {receitas.some((r) => !r.assinadoPor) && <AvisoDemonstracao tipo="dieta" />}

      {porRefeicao.length === 0 && (
        <Vazio
          titulo="Nada publicado ainda"
          texto="A academia ainda não publicou receitas para este perfil."
        />
      )}

      {porRefeicao.map((grupo) => (
        <section key={grupo.refeicao}>
          <h2 className="t-eyebrow mb-3 text-rise-500">{ROTULO_REFEICAO[grupo.refeicao]}</h2>
          <ul className="space-y-3">
            {grupo.itens.map((r) => {
              const ingredientes: string[] = JSON.parse(r.ingredientes);
              const preparo: string[] = JSON.parse(r.preparo);
              return (
                <li key={r.id} className="rounded-[3px] border border-ink-700 bg-ink-850/60">
                  <details className="group">
                    <summary className="flex cursor-pointer items-start justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[1rem] font-bold uppercase tracking-wide text-bone-50">
                            {r.titulo}
                          </span>
                          {!r.assinadoPor && <SeloDemonstracao />}
                        </span>
                        {r.resumo && (
                          <span className="mt-1.5 block text-[0.8rem] leading-relaxed text-bone-400">
                            {r.resumo}
                          </span>
                        )}
                        <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-bone-500">
                          {r.tempoMin ? <span>{r.tempoMin} min</span> : null}
                          {r.calorias ? <span>{r.calorias} kcal</span> : null}
                          {r.proteinaG ? <span>{r.proteinaG}g proteína</span> : null}
                          {r.carboidratoG ? <span>{r.carboidratoG}g carbo</span> : null}
                          {r.gorduraG ? <span>{r.gorduraG}g gordura</span> : null}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 text-bone-500 transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>

                    <div className="space-y-5 border-t border-ink-800 p-5">
                      <div>
                        <p className="t-eyebrow mb-2.5 text-bone-500">Ingredientes</p>
                        <ul className="space-y-1.5">
                          {ingredientes.map((ing, i) => (
                            <li key={i} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-bone-200">
                              <span aria-hidden className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-rise-500" />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="t-eyebrow mb-2.5 text-bone-500">Preparo</p>
                        <ol className="space-y-2.5">
                          {preparo.map((passo, i) => (
                            <li key={i} className="flex gap-3 text-[0.82rem] leading-relaxed text-bone-200">
                              <span className="font-display text-[0.75rem] font-bold text-rise-500">
                                {i + 1}
                              </span>
                              {passo}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="px-1 text-[0.7rem] leading-relaxed text-bone-500">
        Valores nutricionais são estimativas por porção. Restrição alimentar,
        alergia ou condição de saúde exigem acompanhamento de nutricionista.
      </p>
    </div>
  );
}
