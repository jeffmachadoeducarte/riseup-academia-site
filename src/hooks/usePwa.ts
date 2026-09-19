'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/** Evento do Chrome/Edge que permite disparar o instalador nativo. */
type EventoInstalacao = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type Plataforma = 'ios' | 'android' | 'desktop' | 'desconhecida';

export type EstadoPwa = {
  instalado: boolean;
  podeInstalarDireto: boolean;
  plataforma: Plataforma;
  ehSafariIos: boolean;
  instalar: () => Promise<boolean>;
};

/* ─────────────────────────────────────────────────────────────────────────
   As informações abaixo vivem no navegador, não no React. Ler com
   useSyncExternalStore evita duas armadilhas de uma vez: a diferença entre
   o HTML do servidor e o do cliente (erro de hidratação) e o render extra
   que um setState dentro de useEffect provoca.
   ───────────────────────────────────────────────────────────────────────── */

const naoAssinar = () => () => {};

function detectarPlataforma(): Plataforma {
  const ua = navigator.userAgent;
  // iPadOS 13+ se apresenta como Mac; o toque é o que o denuncia.
  const ehIos = /iPhone|iPad|iPod/i.test(ua)
    || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (ehIos) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

function assinarInstalacao(aoMudar: () => void) {
  const mq = window.matchMedia('(display-mode: standalone)');
  mq.addEventListener('change', aoMudar);
  window.addEventListener('appinstalled', aoMudar);
  return () => {
    mq.removeEventListener('change', aoMudar);
    window.removeEventListener('appinstalled', aoMudar);
  };
}

function lerInstalado() {
  return window.matchMedia('(display-mode: standalone)').matches
    // iOS não implementa display-mode; usa esta propriedade própria.
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function detectarSafariIos() {
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

export function usePwa(): EstadoPwa {
  const instalado = useSyncExternalStore(assinarInstalacao, lerInstalado, () => false);
  const plataforma = useSyncExternalStore(naoAssinar, detectarPlataforma, () => 'desconhecida' as Plataforma);
  const safari = useSyncExternalStore(naoAssinar, detectarSafariIos, () => false);

  const [evento, setEvento] = useState<EventoInstalacao | null>(null);

  useEffect(() => {
    const aoPoderInstalar = (e: Event) => {
      // Sem isto o Chrome mostra a própria barra e some com o evento.
      e.preventDefault();
      setEvento(e as EventoInstalacao);
    };
    const aoInstalar = () => setEvento(null);

    window.addEventListener('beforeinstallprompt', aoPoderInstalar);
    window.addEventListener('appinstalled', aoInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', aoPoderInstalar);
      window.removeEventListener('appinstalled', aoInstalar);
    };
  }, []);

  const instalar = useCallback(async () => {
    if (!evento) return false;
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    // O evento é de uso único: depois de consumido, não serve mais.
    setEvento(null);
    return outcome === 'accepted';
  }, [evento]);

  return {
    instalado,
    podeInstalarDireto: evento !== null,
    plataforma,
    ehSafariIos: plataforma === 'ios' && safari,
    instalar,
  };
}

/* ───────────────────────────── aviso de instalação dispensado ─────────── */

const CHAVE = 'riseup_instalar_dispensado';
const ouvintes = new Set<() => void>();

function assinarDispensa(aoMudar: () => void) {
  ouvintes.add(aoMudar);
  return () => { ouvintes.delete(aoMudar); };
}

function lerDispensado() {
  try { return localStorage.getItem(CHAVE) === '1'; }
  catch { return false; } // modo privado: mostra o aviso
}

export function dispensarAvisoInstalacao() {
  try { localStorage.setItem(CHAVE, '1'); } catch { /* modo privado */ }
  ouvintes.forEach((f) => f());
}

/** No servidor devolve `true`: o aviso nasce escondido e aparece só no cliente. */
export function useAvisoDispensado() {
  return useSyncExternalStore(assinarDispensa, lerDispensado, () => true);
}

/** Registra o service worker. Silencioso: falhar aqui não pode quebrar o app. */
export function useRegistrarServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;
    navigator.serviceWorker.register('/sw.js', { scope: '/app' }).catch(() => undefined);
  }, []);
}
