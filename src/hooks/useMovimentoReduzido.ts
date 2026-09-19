'use client';

import { useSyncExternalStore } from 'react';

const CONSULTA = '(prefers-reduced-motion: reduce)';

function assinar(aoMudar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', aoMudar);
  return () => mq.removeEventListener('change', aoMudar);
}

const ler = () => window.matchMedia(CONSULTA).matches;

/**
 * O visitante pediu para reduzir animações?
 *
 * Lido com `useSyncExternalStore` em vez de `useState` + `useEffect`: a
 * preferência vive no navegador, não no React. Ler por aqui evita o render
 * extra do setState dentro de efeito e mantém servidor e cliente coerentes —
 * no servidor devolve `false`, e o valor real entra na primeira leitura do
 * cliente.
 */
export function useMovimentoReduzido() {
  return useSyncExternalStore(assinar, ler, () => false);
}
