'use client';

import { useEffect } from 'react';

/**
 * Ativa as animações de entrada (`.reveal` / `.reveal-scale`) conforme os
 * elementos entram na viewport.
 *
 * Um único IntersectionObserver para a página inteira — sem biblioteca de
 * animação e sem listener de scroll. Elementos são revelados uma vez e
 * deixam de ser observados.
 *
 * Se o usuário pedir movimento reduzido, tudo é revelado de imediato.
 */
export function useReveal() {
  useEffect(() => {
    const alvos = document.querySelectorAll<HTMLElement>('.reveal, .reveal-scale');
    if (alvos.length === 0) return;

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento) {
      alvos.forEach((el) => el.setAttribute('data-visible', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.setAttribute('data-visible', 'true');
          observer.unobserve(entrada.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    alvos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
