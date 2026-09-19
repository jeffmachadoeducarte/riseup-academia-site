import type { Metadata } from 'next';
import { alunoAtual } from '@/lib/auth';
import { TituloTela, Cartao } from '@/components/app/Cartao';
import { InstalarApp } from '@/components/app/InstalarApp';
import { IconCheck } from '@/components/ui/Icons';

export const metadata: Metadata = { title: 'Instalar o app' };
export const dynamic = 'force-dynamic';

const VANTAGENS = [
  'Abre em tela cheia, sem a barra do navegador',
  'Ícone da Rise Up junto dos seus outros apps',
  'Atalhos diretos para treino, água e aulas',
  'Abre mais rápido nas próximas vezes',
];

export default async function Instalar() {
  await alunoAtual();

  return (
    <div className="space-y-5">
      <TituloTela
        titulo="Instalar o app"
        descricao="Coloque a Rise Up na tela inicial do seu celular. Leva 20 segundos e não ocupa espaço como um aplicativo comum."
      />

      <InstalarApp />

      <Cartao titulo="O que muda">
        <ul className="space-y-2.5">
          {VANTAGENS.map((v) => (
            <li key={v} className="flex gap-3 text-[0.83rem] leading-relaxed text-bone-300">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-rise-500" />
              {v}
            </li>
          ))}
        </ul>
      </Cartao>

      <p className="px-1 text-[0.75rem] leading-relaxed text-bone-500">
        Não é preciso baixar nada de loja de aplicativos. O app é o próprio site,
        salvo no seu aparelho — por isso está sempre atualizado.
      </p>
    </div>
  );
}
