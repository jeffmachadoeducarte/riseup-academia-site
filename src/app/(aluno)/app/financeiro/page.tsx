import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { resumoFinanceiro, formatarReal, hojeBR } from '@/lib/dados-aluno';
import { TituloTela, Cartao, Vazio } from '@/components/app/Cartao';
import { site } from '@/config/site';
import { IconWhatsApp } from '@/components/ui/Icons';

export const metadata: Metadata = { title: 'Financeiro' };
export const dynamic = 'force-dynamic';

const ROTULO_MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function competenciaLegivel(c: string) {
  const [ano, mes] = c.split('-');
  return `${ROTULO_MES[Number(mes) - 1]}/${ano}`;
}

export default async function Financeiro() {
  const { aluno } = await alunoAtual();
  const { pagamentos, plano, matricula, atrasados } = await resumoFinanceiro(aluno.id);
  const hoje = hojeBR();

  return (
    <div className="space-y-5">
      <TituloTela titulo="Financeiro" />

      <Cartao titulo="Seu plano">
        {plano ? (
          <>
            <p className="font-display text-[1.3rem] uppercase tracking-wide text-bone-50">
              {plano.nome}
            </p>
            {plano.descricao && (
              <p className="mt-1.5 text-[0.82rem] leading-relaxed text-bone-400">{plano.descricao}</p>
            )}
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-800 pt-4">
              <div>
                <dt className="text-[0.6rem] uppercase tracking-wider text-bone-500">Valor</dt>
                <dd className="mt-0.5 font-display text-[1rem] text-bone-50">
                  {plano.valorCentavos > 0
                    ? formatarReal(plano.valorCentavos)
                    : <span className="text-[0.85rem] text-bone-500">a confirmar</span>}
                </dd>
              </div>
              <div>
                <dt className="text-[0.6rem] uppercase tracking-wider text-bone-500">Situação</dt>
                <dd className="mt-0.5 font-display text-[1rem] capitalize text-bone-50">
                  {matricula?.situacao ?? '—'}
                </dd>
              </div>
              {matricula && (
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-wider text-bone-500">Aluno desde</dt>
                  <dd className="mt-0.5 font-display text-[1rem] text-bone-50">
                    {new Date(`${matricula.inicio}T12:00:00Z`).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
              )}
            </dl>
          </>
        ) : (
          <p className="text-[0.85rem] text-bone-400">Nenhum plano ativo no momento.</p>
        )}
      </Cartao>

      {atrasados.length > 0 && (
        <div className="rounded-[3px] border border-rise-700/50 bg-rise-500/10 p-5">
          <p className="font-display text-[0.9rem] font-bold uppercase tracking-wide text-rise-400">
            {atrasados.length === 1 ? '1 parcela em atraso' : `${atrasados.length} parcelas em atraso`}
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-bone-200">
            Procure a recepção para regularizar.
          </p>
          <a
            href={site.contato.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-[2px] bg-rise-500 px-5 py-3 font-display text-[0.72rem] font-bold uppercase tracking-wider text-white"
          >
            <IconWhatsApp className="h-4 w-4" />
            Falar com a recepção
          </a>
        </div>
      )}

      <Cartao titulo="Histórico">
        {pagamentos.length === 0 ? (
          <Vazio titulo="Sem lançamentos" texto="Nenhum pagamento registrado até agora." />
        ) : (
          <ul className="-my-1">
            {pagamentos.map((p) => {
              const atrasado = p.situacao !== 'pago' && p.vencimento < hoje;
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 border-b border-ink-800/60 py-3.5 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.88rem] capitalize text-bone-50">
                      {competenciaLegivel(p.competencia)}
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] text-bone-500">
                      {p.pagoEm
                        ? `Pago em ${new Date(p.pagoEm).toLocaleDateString('pt-BR')}${p.meio ? ` · ${p.meio}` : ''}`
                        : `Vence em ${new Date(`${p.vencimento}T12:00:00Z`).toLocaleDateString('pt-BR')}`}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-3">
                    {p.valorCentavos > 0 && (
                      <span className="font-display text-[0.9rem] tabular-nums text-bone-100">
                        {formatarReal(p.valorCentavos)}
                      </span>
                    )}
                    <Situacao
                      valor={p.situacao === 'pago' ? 'pago' : atrasado ? 'atrasado' : 'aberto'}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Cartao>

      <p className="px-1 text-[0.72rem] leading-relaxed text-bone-500">
        ⚠️ Valores de demonstração. Os preços reais dos planos precisam ser
        informados pela academia. Pagamento pelo app ainda não está integrado —
        a quitação é registrada pela recepção.
      </p>
    </div>
  );
}

function Situacao({ valor }: { valor: 'pago' | 'aberto' | 'atrasado' }) {
  const estilos = {
    pago: 'border-emerald-500/40 text-emerald-300/90',
    aberto: 'border-ink-600 text-bone-400',
    atrasado: 'border-rise-600/60 text-rise-400',
  };
  return (
    <span
      className={`w-[4.6rem] shrink-0 rounded-full border px-2 py-1 text-center text-[0.6rem] font-semibold uppercase tracking-wider ${estilos[valor]}`}
    >
      {valor}
    </span>
  );
}
