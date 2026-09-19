import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { resumoAgua, historicoAgua, DIAS_CURTO } from '@/lib/dados-aluno';
import { TituloTela, Cartao } from '@/components/app/Cartao';
import { AnelProgresso } from '@/components/app/AnelProgresso';
import { Registrador } from './registrador';
import { Programacao } from './programacao';

export const metadata: Metadata = { title: 'Hidratação' };
export const dynamic = 'force-dynamic';

export default async function Agua() {
  const { aluno } = await alunoAtual();
  const [resumo, historico] = await Promise.all([
    resumoAgua(aluno.id),
    historicoAgua(aluno.id, 7),
  ]);

  // 35 ml/kg é a referência de uso geral mais difundida. Só sugerimos quando
  // existe peso registrado — e a tela diz de onde o número veio.
  const sugestao = aluno.pesoInicialG
    ? Math.round((aluno.pesoInicialG / 1000) * 35 / 50) * 50
    : null;

  const maximo = Math.max(resumo.metaMl, ...historico.map((h) => h.ml), 1);

  return (
    <div className="space-y-5">
      <TituloTela titulo="Hidratação" />

      <Cartao>
        <div className="flex flex-col items-center">
          <AnelProgresso percentual={resumo.percentual} tamanho={168} espessura={12}>
            <span>
              <span className="block font-display text-[2.1rem] leading-none text-bone-50">
                {(resumo.consumido / 1000).toFixed(2).replace('.', ',')}
                <span className="text-sm text-bone-500">L</span>
              </span>
              <span className="mt-1.5 block text-[0.7rem] uppercase tracking-wider text-bone-500">
                de {(resumo.metaMl / 1000).toFixed(2).replace('.', ',')} L
              </span>
            </span>
          </AnelProgresso>

          <p className="mt-4 text-center text-[0.82rem] text-bone-400">
            {resumo.consumido >= resumo.metaMl
              ? 'Meta do dia batida.'
              : `Faltam ${((resumo.metaMl - resumo.consumido) / 1000).toFixed(2).replace('.', ',')} L para a meta.`}
          </p>
        </div>

        <div className="mt-6">
          <Registrador copoMl={resumo.copoMl} />
        </div>
      </Cartao>

      {/* ──────────────────────────── últimos sete dias ───────────────── */}
      <Cartao titulo="Últimos 7 dias">
        <ul className="flex items-end justify-between gap-2" style={{ height: 120 }}>
          {historico.map((h) => {
            const altura = Math.round((h.ml / maximo) * 88);
            const bateu = h.ml >= resumo.metaMl;
            const diaSemana = DIAS_CURTO[new Date(`${h.dia}T12:00:00Z`).getUTCDay()];
            return (
              <li key={h.dia} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[0.6rem] tabular-nums text-bone-500">
                  {h.ml > 0 ? (h.ml / 1000).toFixed(1).replace('.', ',') : '–'}
                </span>
                <span
                  className={bateu ? 'w-full rounded-t-[2px] bg-rise-500' : 'w-full rounded-t-[2px] bg-ink-700'}
                  style={{ height: Math.max(altura, 3) }}
                  title={`${h.dia}: ${h.ml} ml`}
                />
                <span className="text-[0.62rem] uppercase text-bone-500">{diaSemana}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 border-t border-ink-800 pt-3 text-[0.7rem] text-bone-500">
          Barras em laranja são os dias em que você bateu a meta.
        </p>
      </Cartao>

      {/* ──────────────────────────────── programação ─────────────────── */}
      <Cartao titulo="Meta e lembretes">
        <Programacao
          metaMl={resumo.metaMl}
          copoMl={resumo.copoMl}
          lembretesAtivos={resumo.meta?.lembretesAtivos ?? false}
          inicio={resumo.meta?.lembreteInicio ?? '08:00'}
          fim={resumo.meta?.lembreteFim ?? '21:00'}
          intervalo={resumo.meta?.lembreteIntervaloMin ?? 90}
          sugestaoMl={sugestao}
        />
      </Cartao>

      <p className="px-1 text-[0.7rem] leading-relaxed text-bone-500">
        Os lembretes ficam salvos na sua conta. O envio por notificação no
        celular depende da configuração de push do app — ver pendências do
        projeto.
      </p>
    </div>
  );
}
