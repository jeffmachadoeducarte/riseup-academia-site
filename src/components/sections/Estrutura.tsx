'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Figura } from '@/components/ui/Figura';
import { IconClose, IconArrow } from '@/components/ui/Icons';
import { useProgressoScroll } from '@/hooks/useProgressoScroll';
import { versionado } from '@/config/midia';

const { estrutura } = site;
const itens = estrutura.galeria;

/**
 * ESTRUTURA — galeria que viaja na horizontal conforme o scroll desce.
 *
 * Por que assim, e não cenas em tela cheia:
 * o material vem de um vídeo 720×1280. Espalhado em tela cheia num monitor
 * de 1440px, ele é ampliado 2× e fica visivelmente mole — o efeito chamava
 * atenção para o próprio defeito. Em retrato, perto do tamanho nativo, a
 * mesma imagem fica nítida. O movimento horizontal também combina com a
 * proporção vertical do material: cabem várias lado a lado.
 *
 * A seção é alta e o conteúdo gruda com `position: sticky` — rolagem nativa.
 * Nada intercepta a roda do mouse; dá para subir, descer e sair quando quiser.
 *
 * No mobile o trilho vira rolagem horizontal por toque, que é o gesto que a
 * pessoa já espera ali, e o palco é desligado.
 */
export function Estrutura() {
  const [aberta, setAberta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);

  const palco = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLUListElement>(null);
  useProgressoScroll(palco, { desligarEmMobile: true });

  /**
   * Quanto o trilho precisa andar para a última imagem chegar à borda.
   * Medido do DOM porque depende da largura real da tela e das imagens —
   * chutar um valor deixaria sobra ou corte no fim da sequência.
   */
  useLayoutEffect(() => {
    const el = trilho.current;
    const palcoEl = palco.current;
    if (!el || !palcoEl) return;

    const medir = () => {
      const excedente = el.scrollWidth - window.innerWidth;
      // 6rem de folga para a última imagem não encostar na borda.
      const deslocamento = Math.max(0, excedente + 96);
      palcoEl.style.setProperty('--deslocamento', `${-deslocamento}px`);
    };

    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    window.addEventListener('resize', medir);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, []);

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

  function fechar() {
    setAberta(null);
    gatilho.current?.focus();
  }

  const atual = aberta === null ? null : itens[aberta];

  const quadros = itens.map((item, i) => (
    <li
      key={item.src}
      className="quadro w-[15rem] snap-center sm:w-[17rem] lg:w-[18.5rem]"
    >
      <button
        type="button"
        onClick={(e) => abrir(i, e.currentTarget)}
        aria-label={`Ampliar imagem: ${item.legenda} — ${item.alt}`}
        className="group block w-full text-left"
      >
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[3px] bg-ink-850">
          <Figura
            base={item.src}
            alt={item.alt}
            foco={'foco' in item ? item.foco : undefined}
            sizes="(max-width: 640px) 70vw, 21rem"
            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-[2px] w-0 bg-rise-500 transition-all duration-500 ease-out group-hover:w-full"
          />
        </span>

        <span className="mt-3.5 flex items-center justify-between gap-3">
          <span className="font-display text-[0.9rem] font-bold uppercase tracking-[0.1em] text-bone-50">
            {item.legenda}
          </span>
          <span
            aria-hidden
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-600 text-bone-500 transition-colors group-hover:border-rise-500 group-hover:text-rise-500"
          >
            <IconArrow className="h-3.5 w-3.5 -rotate-45" />
          </span>
        </span>
      </button>
    </li>
  ));

  return (
    <section id="estrutura" className="relative bg-ink-900">
      {/* ═══════════════════ palco pinned (desktop) ═══════════════════════ */}
      <div ref={palco} className="palco hidden lg:block" style={{ height: '320svh' }}>
        {/* pt-24 abre espaço para o header fixo, que é sobreposto */}
        <div className="palco-tela flex flex-col justify-center pt-20">
          <Container size="wide" className="shrink-0">
            <SectionTitle
              indice={estrutura.indice}
              etiqueta={estrutura.etiqueta}
              titulo={estrutura.titulo}
              descricao={estrutura.descricao}
              className="max-w-xl [&_h2]:text-[clamp(1.9rem,3.4vw,3rem)]"
            />
          </Container>

          {/* O trilho começa alinhado ao container e sangra até a borda. */}
          <div className="mt-8 overflow-hidden">
            <ul ref={trilho} className="trilho px-12">
              {quadros}
            </ul>
          </div>

          <Container size="wide" className="mt-7 shrink-0">
            <span aria-hidden className="block h-px w-full bg-ink-700">
              <span className="barra-progresso block h-px w-full bg-rise-500" />
            </span>
          </Container>
        </div>
      </div>

      {/* ══════════════════ versão mobile: arrasta com o dedo ═════════════ */}
      <div className="py-24 sm:py-28 lg:hidden">
        <Container size="wide">
          <SectionTitle
            indice={estrutura.indice}
            etiqueta={estrutura.etiqueta}
            titulo={estrutura.titulo}
            descricao={estrutura.descricao}
            className="titulo-sem-palco"
          />
        </Container>

        <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          {quadros}
        </ul>

        <Container size="wide">
          <p className="mt-4 text-[0.72rem] text-bone-500">Arraste para o lado para ver mais.</p>
        </Container>
      </div>

      {/* ═══════════════════════════════════════════════════ lightbox ═════ */}
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
                src={versionado(`${atual.src}-720.jpg`)}
                alt={atual.alt}
                width={720}
                height={1280}
                className="max-h-[78svh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-5 text-bone-200" onClick={(e) => e.stopPropagation()}>
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
