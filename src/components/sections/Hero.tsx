'use client';

import { useEffect, useRef, useState } from 'react';
import { site, resolverHref } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Triangulo } from '@/components/ui/Logo';
import { IconWhatsApp, IconArrow } from '@/components/ui/Icons';

const { hero } = site;

/**
 * HERO CINEMATOGRÁFICO
 * ─────────────────────────────────────────────────────────────────────────
 * O material original é um reel 9:16 (720×1280). Em vez de esticar vídeo
 * vertical sobre uma viewport horizontal — o que destrói o enquadramento e
 * borra a imagem —, a composição muda de forma por breakpoint:
 *
 *   mobile  → vídeo em tela cheia (a proporção bate exatamente com o 9:16)
 *   desktop → painel vertical à direita, com máscara de degradê na borda
 *             esquerda para o vídeo se dissolver no preto onde fica o texto
 *
 * Carregamento: o SSR entrega apenas o poster (LCP). O vídeo só recebe `src`
 * depois da hidratação, e a versão escolhida depende da largura da tela e da
 * qualidade da conexão.
 */
export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Conexão lenta ou modo de economia de dados: fica só no poster.
    type Conexao = { saveData?: boolean; effectiveType?: string };
    const conexao = (navigator as Navigator & { connection?: Conexao }).connection;
    const conexaoRuim =
      conexao?.saveData === true ||
      (conexao?.effectiveType != null && /^(slow-)?2g$/.test(conexao.effectiveType));

    if (semMovimento || conexaoRuim) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;

    // WebM (VP9) quando suportado; MP4 como alternativa universal.
    const suportaWebm = el.canPlayType('video/webm; codecs="vp9"') !== '';
    el.src = mobile
      ? hero.video.mp4Mobile
      : suportaWebm
        ? hero.video.webm
        : hero.video.mp4;

    el.load();

    const aoPoderTocar = () => {
      setPronto(true);
      el.play().then(() => setTocando(true)).catch(() => setTocando(false));
    };

    el.addEventListener('canplay', aoPoderTocar, { once: true });
    return () => el.removeEventListener('canplay', aoPoderTocar);
  }, []);

  /* WCAG 2.2.2 — conteúdo em movimento acima de 5 s precisa de pausa. */
  function alternar() {
    const el = video.current;
    if (!el || !pronto) return;
    if (el.paused) {
      el.play().then(() => setTocando(true)).catch(() => undefined);
    } else {
      el.pause();
      setTocando(false);
    }
  }

  return (
    <section
      id="inicio"
      aria-label="Apresentação da Rise Up Academia"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 pb-16 pt-32 lg:justify-center lg:pb-24"
    >
      {/* ═══════════════════════════════════════════════ camada de vídeo */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10',
          // Desktop: painel vertical à direita, dissolvido na borda esquerda.
          'lg:left-auto lg:right-0 lg:w-[48%]',
          'lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_26%,#000_100%)]',
          'lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_26%,#000_100%)]',
        )}
      >
        <video
          ref={video}
          poster={hero.video.poster}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* ══════════════════════════════════════ tratamento de imagem */}
      {/* Escurece o vídeo o bastante para o texto passar em contraste AA. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/85 lg:to-ink-950/10"
      />
      {/* Vinheta lateral — fecha a composição como em cinema. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,7,9,0.85)_100%)]"
      />
      {/* Brilho quente da marca, saindo de baixo. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_80%_60%_at_20%_100%,rgba(240,74,37,0.16),transparent_70%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      {/* ═══════════════════════════════════════════════════ conteúdo */}
      <Container size="wide">
        <div className="max-w-2xl lg:max-w-[38rem]">
          <p className="reveal t-eyebrow flex items-center gap-3 text-bone-200" data-visible="true">
            <Triangulo className="h-2.5 w-2.5 text-rise-500" />
            {hero.etiqueta}
          </p>

          <h1 className="t-display mt-6 text-[clamp(3.25rem,13vw,8.5rem)] text-bone-50">
            <span className="block overflow-hidden">
              <span className="reveal block" data-visible="true">
                {hero.titulo[0]}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="reveal block text-rise-500"
                style={{ '--reveal-delay': '110ms' } as React.CSSProperties}
                data-visible="true"
              >
                {hero.titulo[1]}
              </span>
            </span>
          </h1>

          <p
            className="reveal mt-7 max-w-lg text-[0.975rem] leading-relaxed text-bone-200 sm:text-base"
            style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
            data-visible="true"
          >
            {hero.subtitulo}
          </p>

          <div
            className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
            data-visible="true"
          >
            <a
              href={resolverHref(hero.ctaPrimario.href)}
              className="group inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-8 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_36px_-14px_rgba(240,74,37,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400"
            >
              {hero.ctaPrimario.rotulo}
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href={resolverHref(hero.ctaSecundario.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-[2px] border border-bone-50/25 bg-white/[0.04] px-8 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-bone-50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-bone-50/60 hover:bg-white/[0.09]"
            >
              <IconWhatsApp className="h-4 w-4" />
              {hero.ctaSecundario.rotulo}
            </a>
          </div>

          {/* ---------------------------------------------- indicadores */}
          <dl
            className="reveal mt-14 grid grid-cols-3 gap-x-4 border-t border-ink-700/70 pt-7 sm:flex sm:flex-wrap sm:items-start sm:gap-x-14"
            style={{ '--reveal-delay': '420ms' } as React.CSSProperties}
            data-visible="true"
          >
            {hero.indicadores.map((item) => (
              <div key={item.rotulo}>
                <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-bone-500">
                  {item.rotulo}
                </dt>
                <dd className="t-display mt-1.5 text-2xl text-bone-50 sm:text-[1.75rem]">
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* ═══════════════════════════════════ controle de reprodução */}
      {pronto && (
        <button
          type="button"
          onClick={alternar}
          aria-label={tocando ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
          className="absolute bottom-6 right-5 z-10 flex items-center gap-2 rounded-full border border-bone-50/25 bg-ink-950/60 px-4 py-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-bone-200 backdrop-blur-md transition-colors hover:border-bone-50/60 hover:text-bone-50 sm:bottom-8 lg:right-12"
        >
          <span
            aria-hidden
            className={cn(
              'block h-1.5 w-1.5 rounded-full transition-colors',
              tocando ? 'bg-rise-500' : 'bg-bone-500',
            )}
          />
          {tocando ? 'Pausar' : 'Reproduzir'}
        </button>
      )}
    </section>
  );
}
