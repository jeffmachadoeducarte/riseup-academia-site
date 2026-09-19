import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { integracaoDisponivel, conexaoDoAluno, atividadesDoAluno, urlDeAutorizacao } from '@/lib/strava';
import { site } from '@/config/site';
import { TituloTela, Cartao, Vazio } from '@/components/app/Cartao';
import { BotoesStrava } from './botoes';

export const metadata: Metadata = { title: 'Strava' };
export const dynamic = 'force-dynamic';

function duracao(seg: number) {
  const h = Math.floor(seg / 3600);
  const m = Math.round((seg % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
}

export default async function Strava() {
  const { aluno } = await alunoAtual();
  const disponivel = integracaoDisponivel();

  if (!disponivel) {
    return (
      <div className="space-y-5">
        <TituloTela titulo="Strava" />
        <Vazio
          titulo="Integração ainda não configurada"
          texto="A conexão com o Strava depende de um cadastro que a academia precisa fazer junto ao Strava. Assim que estiver pronto, o botão de conectar aparece aqui."
        />
        <p className="px-1 text-[0.72rem] leading-relaxed text-bone-500">
          Dúvidas? Fale com a recepção pelo{' '}
          <a href={site.contato.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-rise-400 underline underline-offset-2">
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  const conexao = await conexaoDoAluno(aluno.id);
  const atividades = conexao ? await atividadesDoAluno(aluno.id) : [];

  return (
    <div className="space-y-5">
      <TituloTela
        titulo="Strava"
        descricao="Traga suas corridas e pedaladas para o seu histórico na Rise Up."
      />

      {!conexao ? (
        <Cartao>
          <p className="text-[0.85rem] leading-relaxed text-bone-300">
            Ao conectar, o app passa a ler suas atividades do Strava. Pedimos
            apenas permissão de leitura — nada é publicado na sua conta.
          </p>
          <a
            href={urlDeAutorizacao(site.seo.url, String(aluno.id))}
            className="mt-5 flex w-full items-center justify-center rounded-[2px] bg-[#FC4C02] py-4 font-display text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
          >
            Conectar com o Strava
          </a>
        </Cartao>
      ) : (
        <>
          <Cartao titulo="Conta conectada">
            <p className="font-display text-[1.1rem] uppercase tracking-wide text-bone-50">
              {conexao.atletaNome ?? `Atleta ${conexao.atletaId}`}
            </p>
            <p className="mt-1 text-[0.75rem] text-bone-500">
              {conexao.ultimaSincronia
                ? `Última sincronia: ${new Date(conexao.ultimaSincronia).toLocaleString('pt-BR')}`
                : 'Nunca sincronizado'}
            </p>
            <div className="mt-5">
              <BotoesStrava />
            </div>
          </Cartao>

          <Cartao titulo="Atividades recentes">
            {atividades.length === 0 ? (
              <p className="py-4 text-center text-[0.82rem] text-bone-500">
                Nenhuma atividade ainda. Toque em sincronizar.
              </p>
            ) : (
              <ul className="-my-1">
                {atividades.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 border-b border-ink-800/60 py-3.5 last:border-0">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.88rem] text-bone-50">{a.nome}</span>
                      <span className="mt-0.5 block text-[0.7rem] text-bone-500">
                        {a.tipo} · {new Date(a.inicioEm).toLocaleDateString('pt-BR')}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      {a.distanciaM ? (
                        <span className="block font-display text-[0.88rem] tabular-nums text-bone-100">
                          {(a.distanciaM / 1000).toFixed(1).replace('.', ',')} km
                        </span>
                      ) : null}
                      <span className="block text-[0.68rem] tabular-nums text-bone-500">
                        {duracao(a.duracaoSeg ?? 0)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        </>
      )}
    </div>
  );
}
