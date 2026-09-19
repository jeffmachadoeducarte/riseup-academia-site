'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Progresso de scroll de um elemento, escrito como variável CSS.
 *
 * Por que assim:
 * - O valor vai para `--p` (0 → 1) no próprio elemento. Quem anima é o CSS,
 *   com `transform` e `opacity` — o JavaScript não toca em estilo de layout,
 *   então não há reflow por quadro.
 * - Não usa evento de scroll. Um IntersectionObserver liga e desliga um laço
 *   de `requestAnimationFrame`, que só roda enquanto a seção está na tela.
 * - Nada aqui intercepta a rolagem: o navegador continua no controle.
 *
 * Sobre `animation-timeline` nativo: o Chrome já o implementa, o Safari e o
 * Firefox não. Dava para usar o caminho nativo só no Chrome, mas aí o site
 * teria duas mecânicas diferentes para manter e depurar, e a diferença de
 * custo é desprezível — este laço só roda enquanto a seção está visível e
 * escreve uma variável CSS no máximo uma vez por quadro. Mesmo comportamento
 * em todo navegador vale mais do que os microssegundos economizados.
 */
export type ModoProgresso =
  /** Seção mais alta que a tela (pinned): 0 ao encostar no topo, 1 ao soltar. */
  | 'percorrido'
  /** Seção do tamanho da tela: 0 parada, 1 quando terminou de sair por cima. */
  | 'saida'
  /** Seção comum: 0 ao entrar por baixo, 1 ao sair por cima. Para parallax. */
  | 'travessia';

export function useProgressoScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opcoes: { desligarEmMobile?: boolean; modo?: ModoProgresso } = {},
) {
  const { desligarEmMobile = false, modo = 'percorrido' } = opcoes;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Movimento reduzido: fixa o progresso no fim e não anima nada.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }

    if (desligarEmMobile && window.matchMedia('(max-width: 767px)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }

    let quadro = 0;
    let ativo = false;
    let ultimo = -1;

    const limitar = (v: number) => Math.min(1, Math.max(0, v));

    const medir = () => {
      const caixa = el.getBoundingClientRect();
      const vh = window.innerHeight;

      let p: number;
      if (modo === 'saida') {
        // Quanto da seção já passou por cima da borda superior.
        p = limitar(-caixa.top / Math.max(1, caixa.height));
      } else if (modo === 'travessia') {
        p = limitar((vh - caixa.top) / (vh + caixa.height));
      } else {
        const percorrivel = caixa.height - vh;
        p = percorrivel > 0
          ? limitar(-caixa.top / percorrivel)
          : limitar((vh - caixa.top) / (vh + caixa.height));
      }

      // Duas casas bastam e evitam escrever no DOM a cada quadro.
      const arredondado = Math.round(p * 100) / 100;
      if (arredondado !== ultimo) {
        ultimo = arredondado;
        el.style.setProperty('--p', String(arredondado));
      }
      if (ativo) quadro = requestAnimationFrame(medir);
    };

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !ativo) {
          ativo = true;
          quadro = requestAnimationFrame(medir);
        } else if (!entrada.isIntersecting && ativo) {
          ativo = false;
          cancelAnimationFrame(quadro);
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    medir();

    return () => {
      ativo = false;
      cancelAnimationFrame(quadro);
      observer.disconnect();
    };
  }, [ref, desligarEmMobile, modo]);
}

/** Atalho: cria a ref e já liga o progresso. */
export function useSecaoComProgresso<T extends HTMLElement>(
  opcoes?: { desligarEmMobile?: boolean; modo?: ModoProgresso },
) {
  const ref = useRef<T>(null);
  useProgressoScroll(ref, opcoes);
  return ref;
}
