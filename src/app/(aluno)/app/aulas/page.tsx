import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { grade, DIAS_SEMANA, resumoFrequencia, diaSemanaHojeBR } from '@/lib/dados-aluno';
import { TituloTela, Cartao, Vazio } from '@/components/app/Cartao';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Aulas' };
export const dynamic = 'force-dynamic';

export default async function Aulas() {
  const { aluno } = await alunoAtual();
  const [aulas, freq] = await Promise.all([grade(), resumoFrequencia(aluno.id)]);

  const hoje = diaSemanaHojeBR();
  // Semana começa no dia de hoje, para o que interessa ficar no topo.
  const ordem = Array.from({ length: 7 }, (_, i) => (hoje + i) % 7);

  return (
    <div className="space-y-5">
      <TituloTela titulo="Aulas" descricao="Grade semanal das aulas coletivas." />

      <div className="grid grid-cols-3 gap-3">
        <Indicador valor={String(freq.semana)} rotulo="Esta semana" />
        <Indicador valor={String(freq.mes)} rotulo="Em 30 dias" />
        <Indicador valor={String(freq.total)} rotulo="Total" />
      </div>

      {aulas.length === 0 ? (
        <Vazio titulo="Grade não publicada" texto="A academia ainda não cadastrou a grade de aulas." />
      ) : (
        ordem.map((dia, i) => {
          const doDia = aulas.filter((a) => a.diaSemana === dia);
          if (doDia.length === 0) return null;
          return (
            <Cartao key={dia} titulo={i === 0 ? `${DIAS_SEMANA[dia]} · hoje` : DIAS_SEMANA[dia]}>
              <ul className="-my-1">
                {doDia.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-4 border-b border-ink-800/60 py-3 last:border-0"
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.9rem] text-bone-50">{a.nome}</span>
                      <span className="mt-0.5 block text-[0.7rem] text-bone-500">
                        {a.modalidade}
                        {a.professor ? ` · ${a.professor}` : ''}
                        {a.vagas ? ` · ${a.vagas} vagas` : ''}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-[0.85rem] font-bold tabular-nums text-bone-100">
                      {a.horaInicio}
                      <span className="text-bone-500"> – {a.horaFim}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Cartao>
          );
        })
      )}

      <p className="px-1 text-[0.72rem] leading-relaxed text-bone-500">
        ⚠️ Grade de demonstração. Os horários reais das aulas precisam ser
        confirmados pela academia. Em caso de dúvida, fale com a recepção pelo{' '}
        <a
          href={site.contato.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rise-400 underline underline-offset-2"
        >
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}

function Indicador({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="rounded-[3px] border border-ink-700 bg-ink-850/60 px-3 py-4 text-center">
      <p className="font-display text-2xl text-bone-50">{valor}</p>
      <p className="mt-1 text-[0.62rem] uppercase leading-tight tracking-wider text-bone-500">{rotulo}</p>
    </div>
  );
}
