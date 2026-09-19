'use client';

import { useEffect, useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { IconWhatsApp } from '@/components/ui/Icons';

/**
 * Atalho flutuante de WhatsApp.
 *
 * Aparece depois que o visitante passa do hero — no topo os CTAs do hero já
 * cumprem o papel e o botão flutuante só poluiria a composição — e some de
 * novo quando o rodapé entra em cena, onde ele cobriria os links legais.
 */
export function BotaoWhatsApp() {
  const [passouDoHero, setPassouDoHero] = useState(false);
  const [noRodape, setNoRodape] = useState(false);
  const visivel = passouDoHero && !noRodape;

  useEffect(() => {
    const aoRolar = () => setPassouDoHero(window.scrollY > window.innerHeight * 0.85);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => {
    const rodape = document.querySelector('footer');
    if (!rodape) return;
    const observer = new IntersectionObserver(
      ([entrada]) => setNoRodape(entrada.isIntersecting),
      { rootMargin: '0px 0px -25% 0px' },
    );
    observer.observe(rodape);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={site.contato.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a ${site.marca.nome} no WhatsApp`}
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel}
      className={cn(
        'group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-rise-500 py-3.5 pl-4 pr-5 text-white',
        'shadow-[0_14px_40px_-12px_rgba(240,74,37,0.85)] transition-all duration-400 ease-out',
        'hover:bg-rise-400 hover:shadow-[0_18px_48px_-12px_rgba(240,74,37,1)] sm:bottom-8 sm:right-8',
        visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <IconWhatsApp className="h-5 w-5 shrink-0" />
      <span className="hidden font-display text-[0.75rem] font-bold uppercase tracking-[0.12em] sm:inline">
        Fale conosco
      </span>
    </a>
  );
}
