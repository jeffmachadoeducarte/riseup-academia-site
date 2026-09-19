'use client';

import { useRegistrarServiceWorker } from '@/hooks/usePwa';

/** Registra o service worker. Não renderiza nada. */
export function RegistrarSW() {
  useRegistrarServiceWorker();
  return null;
}
