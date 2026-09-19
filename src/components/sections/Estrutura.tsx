'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Figura } from '@/components/ui/Figura';
import { IconClose, IconArrow } from '@/components/ui/Icons';

const { estrutura } = site;
const itens = estrutura.galeria;

/**
 * Posições explícitas no grid, item a item.
 *
 * O material de origem é vertical (9:16), então a maioria dos blocos é
 * retrato — é onde o enquadramento original sobrevive sem corte agressivo.
 * A primeira célula é o bloco grande (2×2) e as duas últimas são baixas e
 * largas, porque são as únicas cenas panorâmicas do reel.
 *
 * Em 4 colunas × 4 linhas as 16 células são preenchidas exatamente, sem
 * buracos no fim do grid.
 */
const LAYOUT = [
  'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2', // salão (bloco grande)
  'row-span-2',                                        // cross    (retrato)
  'row-span-2',                                        // cardio   (retrato)
  'row-span-2',                                        // funcional(retrato)
  'row-span-2',                                        // coletivas(retrato)
  'row-span-2',                                        // livres   (retrato)
  'row-span-1',                                        // studio   (panorâmica)
  'row-span-1',                                        // máquinas (panorâmica)
];

/**
 * Galeria em grid assimétrico com lightbox próprio.
 *
 * Sem biblioteca: o lightbox é um <dialog> nativo, o que entrega backdrop,
 * trap de foco e fechamento por Esc sem código extra.
 */
export function Estrutura() {
  const [aberta, setAberta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);

  const abrir = useCallback((indice: number, elemento: HTMLButtonElement) => {
    gatilho.current = elemento;
    setAberta(indice);
  }, []);

  const navegar = useCallback((passo: number) => {
    setAberta((atual) => (atual === null ? null : (atual + passo + itens.length) % itens.length));
  }, []);

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;

    if (aberta === null) {
      if (el.open) el.close();
      return;
    }

    if (!el.open) el.showModal();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); navegar(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navegar(-1); }
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberta, navegar]);

  /* Devolve o foco ao card de origem quando o lightbox fecha. */
  function fechar() {
    setAberta(null);
    gatilho.current?.focus();
  }

  const atual = aberta === null ? null : itens[aberta];

  return (
    <section id="estrutura" className="relative bg-ink-900 py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionTitle
          indice={estrutura.indice}
          etiqueta={estrutura.etiqueta}
          titulo={estrutura.titulo}
          descricao={estrutura.descricao}
        />

        {/* ── grid assimétrico: 2 colunas no mobile/tablet, 4 no desktop ── */}
        <div className="mt-14 grid auto-rows-[130px] grid-cols-2 gap-2.5 sm:auto-rows-[160px] sm:gap-3 lg:mt-20 lg:auto-rows-[175px] lg:grid-cols-4">
          {itens.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={(e) => abrir(i, e.currentTarget)}
              aria-label={`Ampliar imagem: ${item.legenda} — ${item.alt}`}
              className={cn(
                'reveal group relative overflow-hidden rounded-[2px] bg-ink-850 text-left',
                'transition-[transform,box-shadow] duration-500 ease-out hover:z-10 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.9)]',
                LAYOUT[i] ?? 'row-span-2',
              )}
              style={{ '--reveal-delay': `${Math.min(i, 6) * 70}ms` } as React.CSSProperties}
            >
              <Figura
                base={item.src}
                alt={item.alt}
                foco={'foco' in item ? item.foco : undefined}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
              />

              {/* Véu escuro constante + reforço no hover, para a legenda ler. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent transition-opacity duration-500 group-hover:from-ink-950/95"
              />

              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <span className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-bone-50">
                  {item.legenda}
                </span>
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 translate-y-1 place-items-center rounded-full border border-bone-50/30 text-bone-50 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <IconArrow className="h-3.5 w-3.5 -rotate-45" />
                </span>
              </span>

              {/* Fio laranja que cresce na borda inferior no hover. */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-0 bg-rise-500 transition-all duration-500 ease-out group-hover:w-full"
              />
            </button>
          ))}
        </div>
      </Container>

      {/* ═══════════════════════════════════════════════════ lightbox */}
      <dialog
        ref={dialogo}
        onClose={() => setAberta(null)}
        onClick={(e) => { if (e.target === dialogo.current) fechar(); }}
        aria-label="Visualização ampliada"
        className="max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink-950/95 backdrop:backdrop-blur-sm"
      >
        {atual && (
          <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 p-4 sm:p-8">
            <div
              className="relative max-h-[78svh] w-auto overflow-hidden rounded-[2px] shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${atual.src}-720.jpg`}
                alt={atual.alt}
                width={720}
                height={1280}
                className="max-h-[78svh] w-auto object-contain"
              />
            </div>

            <div
              className="flex items-center gap-5 text-bone-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => navegar(-1)}
                aria-label="Imagem anterior"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink-600 transition-colors hover:border-bone-200 hover:text-bone-50"
              >
                <IconArrow className="h-4 w-4 rotate-180" />
              </button>

              <p className="min-w-0 text-center">
                <span className="block font-display text-sm font-bold uppercase tracking-[0.12em] text-bone-50">
                  {atual.legenda}
                </span>
                <span className="mt-1 block text-[0.7rem] tracking-wider text-bone-500">
                  {(aberta ?? 0) + 1} / {itens.length}
                </span>
              </p>

              <button
                type="button"
                onClick={() => navegar(1)}
                aria-label="Próxima imagem"
                className="grid h-11 w-11 place-items-center rounded-full border border-ink-600 transition-colors hover:border-bone-200 hover:text-bone-50"
              >
                <IconArrow className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar visualização"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-ink-600 text-bone-200 transition-colors hover:border-bone-200 hover:text-bone-50 sm:right-8 sm:top-8"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
