'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgressoScroll } from '@/hooks/useProgressoScroll';
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
/**
 * As quatro cenas da sequência pinned, na ordem em que aparecem.
 * `indice` aponta para a imagem em `estrutura.galeria`.
 */
const CENAS = [
  { indice: 0, etiqueta: 'Salão principal', titulo: 'O espaço que sustenta o treino.', texto: 'Área de musculação e funcional dividindo o mesmo salão, com grama sintética e o letreiro da marca ao fundo.' },
  { indice: 2, etiqueta: 'Cardio', titulo: 'Ritmo em qualquer horário.', texto: 'Esteiras, escada e bikes sob iluminação própria — a área que enche às 6h e às 22h.' },
  { indice: 3, etiqueta: 'Funcional', titulo: 'Intensidade fora da máquina.', texto: 'Corda naval, assault bike e piso emborrachado para treino intervalado.' },
  { indice: 4, etiqueta: 'Aulas coletivas', titulo: 'Treinar junto muda o rendimento.', texto: 'Sala espelhada com barras, steps e colchonetes para as turmas.' },
] as const;

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

  /**
   * Palco da narrativa. A seção fica alta (400svh) e o conteúdo gruda no
   * topo com `position: sticky` — rolagem nativa, sem interceptar nada.
   * No mobile o palco é desligado e vira o grid de sempre: prender a tela
   * num aparelho pequeno atrapalha mais do que ajuda.
   */
  const palco = useRef<HTMLDivElement>(null);
  useProgressoScroll(palco, { desligarEmMobile: true });

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
    <section id="estrutura" className="relative bg-ink-900">
      {/* ═════════════════════ palco pinned (desktop) ═════════════════════
          Quatro cenas se revezam enquanto a área rola por trás. É scroll
          nativo: dá para subir, descer, usar teclado e sair quando quiser. */}
      <div ref={palco} className="palco hidden lg:block" style={{ height: '400svh' }}>
        <div className="palco-tela">
          {CENAS.map((cena, i) => {
            const de = i / CENAS.length;
            const ate = (i + 1) / CENAS.length;
            const item = itens[cena.indice];
            return (
              <div
                key={cena.indice}
                data-ultima={i === CENAS.length - 1 ? 'true' : 'false'}
                style={{ '--de': de, '--ate': ate } as React.CSSProperties}
                className="camada absolute inset-0"
              >
                <Figura
                  base={item.src}
                  alt={item.alt}
                  foco={'foco' in item ? item.foco : undefined}
                  sizes="100vw"
                  className="camada-zoom absolute inset-0"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/65"
                />

                <div className="camada-texto absolute inset-x-0 bottom-0">
                  <Container size="wide" className="pb-24">
                    <p className="t-eyebrow text-rise-500">{cena.etiqueta}</p>
                    <h3 className="t-display mt-4 max-w-2xl text-[clamp(2.25rem,5vw,4rem)] text-bone-50">
                      {cena.titulo}
                    </h3>
                    <p className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-bone-200">
                      {cena.texto}
                    </p>
                  </Container>
                </div>
              </div>
            );
          })}

          {/* título da seção, fixo por cima das cenas */}
          <div className="pointer-events-none absolute inset-x-0 top-0">
            <Container size="wide" className="pt-28">
              <div className="flex items-center gap-3">
                <span className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-bone-400">
                  {estrutura.indice}
                </span>
                <span aria-hidden className="h-px w-6 bg-rise-500" />
                <span className="t-eyebrow text-rise-500">{estrutura.etiqueta}</span>
              </div>
            </Container>
          </div>

          {/* progresso da sequência */}
          <div className="absolute inset-x-0 bottom-0">
            <Container size="wide" className="pb-8">
              <span aria-hidden className="block h-px w-full bg-ink-700">
                <span className="barra-progresso block h-px w-full bg-rise-500" />
              </span>
            </Container>
          </div>
        </div>
      </div>

      {/* ═════════════ grade completa — pausa depois da sequência ═════════
          No mobile é a seção inteira; no desktop entra depois do palco, com
          todas as imagens e o lightbox. */}
      <div className="py-24 sm:py-32 lg:py-32">
        <Container size="wide">
          <SectionTitle
            indice={estrutura.indice}
            etiqueta={estrutura.etiqueta}
            titulo={estrutura.titulo}
            descricao={estrutura.descricao}
            className="titulo-sem-palco lg:hidden"
          />
          <p className="reveal hidden max-w-xl text-[0.975rem] leading-relaxed text-bone-400 [@media(prefers-reduced-motion:reduce)]:hidden lg:block">
            {estrutura.descricao}
          </p>

          <div className="mt-14 grid auto-rows-[130px] grid-cols-2 gap-2.5 sm:auto-rows-[160px] sm:gap-3 lg:mt-12 lg:auto-rows-[175px] lg:grid-cols-4">
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
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-rise-500 transition-all duration-500 ease-out group-hover:w-full"
                />
              </button>
            ))}
          </div>
        </Container>
      </div>

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
