'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { IconWhatsApp, IconClose } from '@/components/ui/Icons';

export function Header() {
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<string>('#inicio');
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  /* Fundo sólido + blur assim que sai do topo. */
  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  /* Marca o item de menu da seção visível. */
  useEffect(() => {
    const secoes = site.navegacao
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    if (secoes.length === 0) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setSecaoAtiva(`#${visivel.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );

    secoes.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Menu mobile: trava o scroll, fecha no Esc e devolve o foco ao botão. */
  useEffect(() => {
    if (!aberto) return;

    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botaoMenu.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !painel.current) return;

      // Mantém o foco dentro do painel enquanto ele está aberto.
      const focaveis = painel.current.querySelectorAll<HTMLElement>('a[href], button');
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener('keydown', aoTeclar);
    painel.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out',
          rolado
            ? 'border-b border-ink-700/80 bg-ink-950/80 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-ink-950/65'
            : 'border-b border-transparent bg-transparent py-5',
        )}
      >
        <Container size="wide" className="flex items-center justify-between gap-6">
          <a
            href="#inicio"
            aria-label={`${site.marca.nome} — ir para o início`}
            className="-my-2 flex items-center py-2 text-lg transition-opacity hover:opacity-80 sm:text-xl"
          >
            <Logo />
          </a>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {site.navegacao.map((item) => {
                const ativo = secaoAtiva === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={ativo ? 'true' : undefined}
                      className={cn(
                        'relative block py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300',
                        ativo ? 'text-bone-50' : 'text-bone-400 hover:text-bone-50',
                      )}
                    >
                      {item.rotulo}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-px bg-rise-500 transition-all duration-300',
                          ativo ? 'w-full' : 'w-0',
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.contato.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-[2px] bg-rise-500 px-5 py-3 font-display text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400 sm:inline-flex"
            >
              <IconWhatsApp className="h-4 w-4" />
              Fale conosco
            </a>

            <button
              ref={botaoMenu}
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              className="relative z-50 grid h-11 w-11 place-items-center rounded-[2px] border border-ink-600 text-bone-50 transition-colors hover:border-bone-400 lg:hidden"
            >
              {aberto ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <span aria-hidden className="flex flex-col gap-[5px]">
                  <span className="block h-px w-5 bg-current" />
                  <span className="block h-px w-5 bg-current" />
                  <span className="block h-px w-3 bg-current" />
                </span>
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* ---------------------------------------------------- menu mobile */}
      <div
        id="menu-mobile"
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        hidden={!aberto}
        className={cn(
          'fixed inset-0 z-40 flex flex-col justify-between bg-ink-950/98 px-6 pb-10 pt-28 backdrop-blur-xl transition-opacity duration-300 lg:hidden',
          aberto ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav aria-label="Navegação principal (mobile)">
          <ul className="flex flex-col">
            {site.navegacao.map((item, i) => (
              <li key={item.href} className="border-b border-ink-800">
                <a
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="flex items-baseline gap-4 py-5 transition-colors hover:text-rise-400"
                >
                  <span className="font-display text-[0.7rem] font-bold text-bone-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-display text-3xl text-bone-50">{item.rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <a
            href={site.contato.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white"
          >
            <IconWhatsApp className="h-5 w-5" />
            Falar no WhatsApp
          </a>
          <a
            href={site.contato.telefoneHref}
            className="flex w-full items-center justify-center rounded-[2px] border border-ink-600 px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-bone-200"
          >
            {site.contato.telefone.exibicao}
          </a>
        </div>
      </div>
    </>
  );
}
