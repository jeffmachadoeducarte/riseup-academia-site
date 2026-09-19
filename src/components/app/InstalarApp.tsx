'use client';

import { useState } from 'react';
import { usePwa, useAvisoDispensado, dispensarAvisoInstalacao } from '@/hooks/usePwa';
import { cn } from '@/lib/cn';
import {
  IconBaixar, IconCompartilharIos, IconMaisQuadrado, IconCheck, IconTresPontos, IconClose,
} from '@/components/ui/Icons';

/**
 * Instruções de instalação do app.
 *
 * Cada navegador instala de um jeito, e o iOS nem oferece o evento de
 * instalação — lá só dá pelo menu Compartilhar. Em vez de um botão genérico
 * que não funciona em metade dos aparelhos, cada plataforma recebe o passo a
 * passo que realmente vale para ela.
 */
export function InstalarApp({ compacto = false }: { compacto?: boolean }) {
  const { instalado, podeInstalarDireto, plataforma, ehSafariIos, instalar } = usePwa();
  const [instalando, setInstalando] = useState(false);

  if (instalado) {
    return (
      <p className="flex items-center gap-2.5 rounded-[2px] border border-ink-700 bg-ink-850/60 px-4 py-3 text-[0.8rem] text-bone-300">
        <IconCheck className="h-4 w-4 shrink-0 text-rise-500" />
        App instalado neste aparelho.
      </p>
    );
  }

  async function aoClicar() {
    setInstalando(true);
    await instalar();
    setInstalando(false);
  }

  /* Chrome/Edge (Android e desktop): instalador nativo, um clique. */
  if (podeInstalarDireto) {
    return (
      <div className={cn('space-y-3', compacto && 'space-y-2')}>
        <button
          type="button"
          onClick={aoClicar}
          disabled={instalando}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-6 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rise-400 disabled:opacity-60"
        >
          <IconBaixar className="h-[1.1rem] w-[1.1rem]" />
          {instalando ? 'Instalando…' : 'Instalar o app'}
        </button>
        {!compacto && (
          <p className="text-[0.75rem] leading-relaxed text-bone-500">
            O app fica na sua tela inicial e abre em tela cheia, sem a barra do
            navegador.
          </p>
        )}
      </div>
    );
  }

  /* iPhone e iPad: Safari não expõe instalador. Só pelo Compartilhar. */
  if (plataforma === 'ios') {
    return (
      <Passos
        titulo={ehSafariIos ? 'Instalar no iPhone / iPad' : 'Abra no Safari para instalar'}
        aviso={
          !ehSafariIos
            ? 'No iPhone, só o Safari instala aplicativos na tela inicial. Abra este endereço no Safari e siga os passos.'
            : undefined
        }
        passos={[
          { icone: <IconCompartilharIos className="h-4 w-4" />, texto: <>Toque em <strong className="text-bone-50">Compartilhar</strong>, na barra inferior do Safari.</> },
          { icone: <IconMaisQuadrado className="h-4 w-4" />, texto: <>Role e escolha <strong className="text-bone-50">Adicionar à Tela de Início</strong>.</> },
          { icone: <IconCheck className="h-4 w-4" />, texto: <>Confirme em <strong className="text-bone-50">Adicionar</strong>. O ícone da Rise Up aparece junto dos seus apps.</> },
        ]}
      />
    );
  }

  if (plataforma === 'android') {
    return (
      <Passos
        titulo="Instalar no Android"
        passos={[
          { icone: <IconTresPontos className="h-4 w-4" />, texto: <>Toque nos <strong className="text-bone-50">três pontinhos</strong>, no canto do navegador.</> },
          { icone: <IconBaixar className="h-4 w-4" />, texto: <>Escolha <strong className="text-bone-50">Instalar app</strong> ou <strong className="text-bone-50">Adicionar à tela inicial</strong>.</> },
          { icone: <IconCheck className="h-4 w-4" />, texto: <>Confirme. O app passa a abrir em tela cheia.</> },
        ]}
      />
    );
  }

  return (
    <Passos
      titulo="Instalar no computador"
      passos={[
        { icone: <IconBaixar className="h-4 w-4" />, texto: <>No Chrome ou Edge, clique no ícone de <strong className="text-bone-50">instalar</strong>, à direita da barra de endereço.</> },
        { icone: <IconTresPontos className="h-4 w-4" />, texto: <>Se não aparecer, abra o menu e procure <strong className="text-bone-50">Instalar Rise Up</strong>.</> },
        { icone: <IconCheck className="h-4 w-4" />, texto: <>O app ganha janela própria, separada do navegador.</> },
      ]}
    />
  );
}

function Passos({
  titulo, passos, aviso,
}: {
  titulo: string;
  aviso?: string;
  passos: { icone: React.ReactNode; texto: React.ReactNode }[];
}) {
  return (
    <div className="rounded-[2px] border border-ink-700 bg-ink-850/50 p-5">
      <p className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-bone-50">
        {titulo}
      </p>
      {aviso && <p className="mt-2 text-[0.78rem] leading-relaxed text-rise-400">{aviso}</p>}
      <ol className="mt-4 space-y-3.5">
        {passos.map((p, i) => (
          <li key={i} className="flex gap-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-600 text-rise-500">
              {p.icone}
            </span>
            <span className="pt-1.5 text-[0.82rem] leading-relaxed text-bone-300">
              <span className="mr-1.5 font-display text-[0.7rem] font-bold text-bone-500">
                {i + 1}.
              </span>
              {p.texto}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Faixa discreta no topo do app sugerindo a instalação.
 * Some para sempre se a pessoa dispensar (guardado no próprio aparelho).
 */
export function FaixaInstalar() {
  const { instalado } = usePwa();
  const dispensado = useAvisoDispensado();

  if (instalado || dispensado) return null;

  return (
    <div className="flex items-center gap-3 border-b border-ink-800 bg-rise-500/10 px-4 py-2.5">
      <IconBaixar className="h-4 w-4 shrink-0 text-rise-500" />
      <p className="flex-1 text-[0.78rem] leading-snug text-bone-200">
        Instale o app na tela inicial.{' '}
        <a href="/app/instalar" className="font-semibold text-rise-400 underline underline-offset-2">
          Ver como
        </a>
      </p>
      <button
        type="button"
        onClick={dispensarAvisoInstalacao}
        aria-label="Dispensar aviso de instalação"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-bone-500 transition-colors hover:text-bone-200"
      >
        <IconClose className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
