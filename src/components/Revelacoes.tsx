'use client';

import { useReveal } from '@/hooks/useReveal';

/** Liga as animações de entrada da página inteira. Não renderiza nada. */
export function Revelacoes() {
  useReveal();
  return null;
}
