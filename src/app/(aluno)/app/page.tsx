import Link from 'next/link';
import { alunoAtual } from '@/lib/auth';
import { ROTULO_PERFIL } from '@/db/schema';
import {
  resumoAgua, resumoFrequencia, sequenciaSemanas, proximaAula,
  resumoFinanceiro, avisosPara, DIAS_SEMANA, formatarReal,
} from '@/lib/dados-aluno';
import { Cartao } from '@/components/app/Cartao';
import { AnelProgresso } from '@/components/app/AnelProgresso';
import { site } from '@/config/site';
import {
  IconGota, IconRaio, IconCalendario, IconCartao, IconArrow, IconHalter,
} from '@/components/ui/Icons';

export const dynamic = 'force-dynamic';

function saudacao() {
  const h = Number(new Date().toLocaleString('pt-BR', { hour: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' }));
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default async function Inicio() {
  const { usuario, aluno } = await alunoAtual();
  const [agua, freq, sequencia, proxima, financeiro, avisos] = await Promise.all([
    resumoAgua(aluno.id),
    resumoFrequencia(aluno.id),
    sequenciaSemanas(aluno.id),
    proximaAula(),
    resumoFinanceiro(aluno.id),
    avisosPara(aluno.perfilTreino),
  ]);

  const primeiroNome = usuario.nome.split(' ')[0];

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[0.8rem] text-bone-400">{saudacao()},</p>
        <h1 className="t-display text-[1.9rem] text-bone-50">{primeiroNome}.</h1>
      </header>

      {/* ───────────────────────────── avisos da direção ───────────────── */}
      {avisos.map((a) => (
        <div key={a.id} className="rounded-[3px] border border-rise-700/50 bg-rise-500/10 p-4">
          <p className="font-display text-[0.8rem] font-bold uppercase tracking-wide text-rise-400">
            {a.titulo}
          </p>
          <p className="mt-1.5 text-[0.83rem] leading-relaxed text-bone-200">{a.texto}</p>
        </div>
      ))}

      {/* ─────────────────── perfil ainda não definido pela direção ────── */}
      {!aluno.perfilTreino && (
        <div className="rounded-[3px] border border-dashed border-ink-600 bg-ink-900/60 p-5">
          <p className="font-display text-[0.85rem] font-bold uppercase tracking-wide text-bone-200">
            Avaliação pendente
          </p>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-bone-400">
            Seu treino e sua alimentação aparecem aqui assim que a equipe da
            academia fizer sua avaliação e definir seu perfil. Procure a
            recepção para agendar.
          </p>
          <a
            href={site.contato.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-wider text-rise-500"
          >
            Agendar avaliação
            <IconArrow className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* ───────────────────────────────────── hidratação ──────────────── */}
      <Cartao href="/app/agua" titulo="Hidratação de hoje" acao="Registrar">
        <div className="flex items-center gap-5">
          <AnelProgresso percentual={agua.percentual} tamanho={104} espessura={8}>
            <span>
              <span className="block font-display text-xl font-bold text-bone-50">
                {agua.percentual}%
              </span>
              <IconGota className="mx-auto mt-0.5 h-3.5 w-3.5 text-rise-500" />
            </span>
          </AnelProgresso>

          <div className="min-w-0">
            <p className="font-display text-2xl text-bone-50">
              {(agua.consumido / 1000).toFixed(2).replace('.', ',')}
              <span className="text-base text-bone-500"> / {(agua.metaMl / 1000).toFixed(2).replace('.', ',')} L</span>
            </p>
            <p className="mt-1.5 text-[0.78rem] leading-relaxed text-bone-400">
              {agua.consumido >= agua.metaMl
                ? 'Meta do dia batida. '
                : `Faltam ${((agua.metaMl - agua.consumido) / 1000).toFixed(2).replace('.', ',')} L. `}
              {agua.meta?.lembretesAtivos && 'Lembretes ligados.'}
            </p>
          </div>
        </div>
      </Cartao>

      {/* ───────────────────────────────────── frequência ──────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <Indicador valor={String(freq.semana)} rotulo="Esta semana" />
        <Indicador valor={String(freq.mes)} rotulo="Em 30 dias" />
        <Indicador
          valor={String(sequencia)}
          rotulo={sequencia === 1 ? 'Semana seguida' : 'Semanas seguidas'}
          destaque={sequencia >= 2}
        />
      </div>

      {/* ──────────────────────────────────────── treino ───────────────── */}
      <Cartao href="/app/treino" titulo="Seu treino" acao="Abrir">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rise-500/15 text-rise-500">
            <IconHalter className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[1.05rem] font-bold uppercase tracking-wide text-bone-50">
              {aluno.perfilTreino ? ROTULO_PERFIL[aluno.perfilTreino] : 'A definir'}
            </p>
            <p className="mt-0.5 text-[0.78rem] text-bone-400">
              {freq.jaTreinouHoje ? 'Você já treinou hoje.' : 'Ainda não treinou hoje.'}
            </p>
          </div>
        </div>
      </Cartao>

      {/* ──────────────────────────────────── próxima aula ─────────────── */}
      {proxima && (
        <Cartao href="/app/aulas" titulo="Próxima aula" acao="Ver grade">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-800 text-bone-300">
              <IconCalendario className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[1.05rem] font-bold uppercase tracking-wide text-bone-50">
                {proxima.aula.nome}
              </p>
              <p className="mt-0.5 text-[0.78rem] text-bone-400">
                {proxima.emDias === 0 ? 'Hoje' : DIAS_SEMANA[proxima.aula.diaSemana]}
                {' · '}
                {proxima.aula.horaInicio} às {proxima.aula.horaFim}
              </p>
            </div>
          </div>
        </Cartao>
      )}

      {/* ───────────────────────────────────── financeiro ──────────────── */}
      <Cartao href="/app/financeiro" titulo="Financeiro" acao="Ver tudo">
        <div className="flex items-center gap-4">
          <span
            className={
              financeiro.atrasados.length > 0
                ? 'grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rise-500/15 text-rise-500'
                : 'grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink-800 text-bone-300'
            }
          >
            <IconCartao className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[1.05rem] font-bold uppercase tracking-wide text-bone-50">
              {financeiro.atrasados.length > 0
                ? `${financeiro.atrasados.length} em atraso`
                : financeiro.emAberto.length > 0
                  ? 'Em dia · 1 a vencer'
                  : 'Tudo em dia'}
            </p>
            <p className="mt-0.5 text-[0.78rem] text-bone-400">
              {financeiro.plano
                ? financeiro.plano.valorCentavos > 0
                  ? `Plano ${financeiro.plano.nome} · ${formatarReal(financeiro.plano.valorCentavos)}`
                  : `Plano ${financeiro.plano.nome}`
                : 'Sem plano ativo'}
            </p>
          </div>
        </div>
      </Cartao>

      <Link
        href="/app/instalar"
        className="flex items-center justify-between gap-3 rounded-[3px] border border-ink-800 px-5 py-4 text-[0.8rem] text-bone-400 transition-colors hover:border-ink-600 hover:text-bone-200"
      >
        <span className="flex items-center gap-2.5">
          <IconRaio className="h-3.5 w-3.5 text-rise-500" />
          Instalar o app no celular
        </span>
        <IconArrow className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function Indicador({ valor, rotulo, destaque }: { valor: string; rotulo: string; destaque?: boolean }) {
  return (
    <div className="rounded-[3px] border border-ink-700 bg-ink-850/60 px-3 py-4 text-center">
      <p className={destaque ? 'font-display text-2xl text-rise-500' : 'font-display text-2xl text-bone-50'}>
        {valor}
      </p>
      <p className="mt-1 text-[0.62rem] uppercase leading-tight tracking-wider text-bone-500">
        {rotulo}
      </p>
    </div>
  );
}
