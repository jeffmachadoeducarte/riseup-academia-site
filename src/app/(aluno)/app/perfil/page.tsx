import type { Metadata } from 'next';
import Link from 'next/link';
import { alunoAtual } from '@/lib/auth';
import { ROTULO_PERFIL } from '@/db/schema';
import { resumoFrequencia, sequenciaSemanas, idadeEmAnos } from '@/lib/dados-aluno';
import { TituloTela, Cartao } from '@/components/app/Cartao';
import { InstalarApp } from '@/components/app/InstalarApp';
import { sair } from '@/app/entrar/acoes';
import { site } from '@/config/site';
import { IconSair, IconArrow } from '@/components/ui/Icons';

export const metadata: Metadata = { title: 'Meu perfil' };
export const dynamic = 'force-dynamic';

export default async function Perfil() {
  const { usuario, aluno } = await alunoAtual();
  const [freq, sequencia] = await Promise.all([
    resumoFrequencia(aluno.id),
    sequenciaSemanas(aluno.id),
  ]);

  const idade = idadeEmAnos(aluno.nascimento);

  return (
    <div className="space-y-5">
      <TituloTela titulo="Meu perfil" />

      <Cartao>
        <p className="font-display text-[1.4rem] uppercase tracking-wide text-bone-50">
          {usuario.nome}
        </p>
        <p className="mt-1 text-[0.8rem] text-bone-500">{usuario.email}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-800 pt-5">
          <Dado rotulo="Perfil de treino" valor={aluno.perfilTreino ? ROTULO_PERFIL[aluno.perfilTreino] : 'A definir'} destaque />
          {idade && <Dado rotulo="Idade" valor={`${idade} anos`} />}
          {aluno.alturaCm && <Dado rotulo="Altura" valor={`${(aluno.alturaCm / 100).toFixed(2).replace('.', ',')} m`} />}
          {aluno.pesoInicialG && <Dado rotulo="Peso inicial" valor={`${(aluno.pesoInicialG / 1000).toFixed(1).replace('.', ',')} kg`} />}
          {aluno.telefone && <Dado rotulo="Telefone" valor={aluno.telefone} />}
          {aluno.matriculaEm && (
            <Dado rotulo="Aluno desde" valor={new Date(`${aluno.matriculaEm}T12:00:00Z`).toLocaleDateString('pt-BR')} />
          )}
        </dl>

        <p className="mt-5 border-t border-ink-800 pt-4 text-[0.72rem] leading-relaxed text-bone-500">
          O perfil de treino é definido pela equipe da academia depois da
          avaliação. Para alterar qualquer dado acima, fale com a recepção.
        </p>
      </Cartao>

      <Cartao titulo="Sua evolução">
        <div className="grid grid-cols-3 gap-3">
          <Numero valor={String(freq.total)} rotulo="Treinos" />
          <Numero valor={String(freq.mes)} rotulo="Em 30 dias" />
          <Numero valor={String(sequencia)} rotulo="Semanas seguidas" destaque={sequencia >= 2} />
        </div>
        {freq.ultimo && (
          <p className="mt-4 border-t border-ink-800 pt-3 text-[0.75rem] text-bone-500">
            Último treino: {new Date(freq.ultimo).toLocaleDateString('pt-BR')}
          </p>
        )}
      </Cartao>

      <Cartao titulo="Strava">
        <p className="text-[0.82rem] leading-relaxed text-bone-400">
          Conecte sua conta para trazer corridas e pedaladas para o histórico.
        </p>
        <Link
          href="/app/strava"
          className="mt-4 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-wider text-rise-500"
        >
          Conectar
          <IconArrow className="h-3.5 w-3.5" />
        </Link>
      </Cartao>

      <Cartao titulo="Aplicativo">
        <InstalarApp compacto />
      </Cartao>

      <Cartao titulo="Academia">
        <div className="space-y-2.5 text-[0.82rem] text-bone-300">
          <p>{site.endereco.logradouro}</p>
          <p className="text-bone-500">{site.endereco.bairro} · {site.endereco.cidade}/{site.endereco.uf}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            <a href={site.contato.telefoneHref} className="text-rise-400 underline underline-offset-4">
              {site.contato.telefone.exibicao}
            </a>
            <a href={site.contato.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-rise-400 underline underline-offset-4">
              WhatsApp
            </a>
            <Link href="/" className="text-bone-500 underline underline-offset-4">
              Site
            </Link>
          </div>
        </div>
      </Cartao>

      <form action={sair}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2.5 rounded-[3px] border border-ink-700 py-4 font-display text-[0.78rem] font-bold uppercase tracking-[0.12em] text-bone-400 transition-colors hover:border-rise-600 hover:text-rise-400"
        >
          <IconSair className="h-4 w-4" />
          Sair da conta
        </button>
      </form>
    </div>
  );
}

function Dado({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div>
      <dt className="text-[0.6rem] uppercase tracking-wider text-bone-500">{rotulo}</dt>
      <dd className={destaque ? 'mt-1 font-display text-[0.95rem] uppercase text-rise-500' : 'mt-1 text-[0.88rem] text-bone-100'}>
        {valor}
      </dd>
    </div>
  );
}

function Numero({ valor, rotulo, destaque }: { valor: string; rotulo: string; destaque?: boolean }) {
  return (
    <div className="text-center">
      <p className={destaque ? 'font-display text-2xl text-rise-500' : 'font-display text-2xl text-bone-50'}>
        {valor}
      </p>
      <p className="mt-1 text-[0.62rem] uppercase leading-tight tracking-wider text-bone-500">{rotulo}</p>
    </div>
  );
}
