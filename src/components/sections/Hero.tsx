'use client';

import { useEffect, useRef, useState } from 'react';
import { useProgressoScroll } from '@/hooks/useProgressoScroll';
import { versionado } from '@/config/midia';
import { site, resolverHref } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Triangulo } from '@/components/ui/Logo';
import Link from 'next/link';
import {
  IconWhatsApp, IconArrow, IconUsuario, IconHalter, IconCoracao,
  IconGrupo, IconLuva, IconClock,
} from '@/components/ui/Icons';

/** Liga a chave do config ao componente de ícone. */
const ICONES = {
  halter: IconHalter,
  coracao: IconCoracao,
  grupo: IconGrupo,
  luva: IconLuva,
} as const;

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
  const secao = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Progresso de saída: 0 com o hero parado, 1 quando terminou de subir.
  // Alimenta as classes `hero-*` do CSS. Nada aqui prende a rolagem.
  useProgressoScroll(secao, { modo: 'saida' });
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
    el.src = versionado(
      mobile ? hero.video.mp4Mobile : suportaWebm ? hero.video.webm : hero.video.mp4,
    );

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
      ref={secao}
      id="inicio"
      aria-label="Apresentação da Rise Up Academia"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 pb-14 pt-28 [@media(max-height:700px)]:pt-24 sm:pb-16 sm:pt-32 lg:justify-center lg:pb-32"
    >
      {/* ═══════════════════════════════════════════════ camada de vídeo */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10',
          // Desktop: painel vertical à direita, dissolvido na borda esquerda.
          'lg:left-auto lg:right-0 lg:w-[52%]',
          'lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_20%,#000_100%)]',
          'lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_20%,#000_100%)]',
        )}
      >
        <video
          ref={video}
          poster={versionado(hero.video.poster)}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          className="hero-video-zoom h-full w-full object-cover object-center"
        />
      </div>

      {/* ══════════════════════════════════════ tratamento de imagem */}
      {/* Escurece o vídeo o bastante para o texto passar em contraste AA. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/15 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/70 lg:to-transparent"
      />
      {/* Vinheta lateral — fecha a composição como em cinema. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,7,9,0.7)_100%)]"
      />
      {/* Brilho quente da marca, saindo de baixo. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_80%_60%_at_20%_100%,rgba(240,74,37,0.16),transparent_70%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10 opacity-60" />

      {/* ═══════════════════════════════════════════════════ conteúdo */}
      <Container size="wide" className="hero-saida">
        <div className="max-w-2xl lg:max-w-[43rem]">
          <p className="reveal t-eyebrow flex items-center gap-3 text-bone-200" data-visible="true">
            <Triangulo className="h-2.5 w-2.5 text-rise-500" />
            {hero.etiqueta}
          </p>

          <h1 className="t-display mt-6 text-[clamp(2.85rem,12.5vw,8.5rem)] text-bone-50 [@media(max-height:700px)]:mt-5 [@media(max-height:700px)]:text-[2.5rem]">
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

          {/* ── chamada + descrição ─────────────────────────────────── */}
          <p
            className="reveal mt-5 max-w-lg text-[clamp(1rem,2.1vw,1.35rem)] sm:mt-6 leading-snug text-bone-50"
            style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
            data-visible="true"
          >
            {hero.chamada}
          </p>

          <p
            className="reveal mt-3 max-w-md text-[0.9rem] sm:mt-4 sm:text-[0.925rem] leading-relaxed text-bone-400"
            style={{ '--reveal-delay': '260ms' } as React.CSSProperties}
            data-visible="true"
          >
            {hero.subtitulo}
          </p>

          {/* ── selos de destaque ───────────────────────────────────── */}
          <ul
            className="reveal mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3"
            style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
            data-visible="true"
          >
            {hero.destaques.map((d) => {
              const Icone = ICONES[d.icone as keyof typeof ICONES];
              return (
                <li key={d.linhas.join(' ')} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] border border-rise-500/25 bg-rise-500/10 text-rise-500">
                    <Icone className="h-[1.05rem] w-[1.05rem]" />
                  </span>
                  <span className="text-[0.66rem] font-semibold uppercase leading-[1.25] tracking-[0.1em] text-bone-200">
                    {d.linhas[0]}
                    <br />
                    {d.linhas[1]}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* ── horários de funcionamento ───────────────────────────── */}
          <div
            className="reveal mt-5 w-fit rounded-[4px] border border-ink-700/90 bg-ink-950/50 px-4 py-3.5 backdrop-blur-sm sm:mt-7 sm:px-5 sm:py-4"
            style={{ '--reveal-delay': '380ms' } as React.CSSProperties}
            data-visible="true"
          >
            <dl className="flex flex-wrap items-center gap-x-5 gap-y-4 sm:flex-nowrap sm:gap-x-6">
              <div className="flex shrink-0 items-center gap-3 sm:border-r sm:border-ink-700 sm:pr-6">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rise-500/30 text-rise-500">
                  <IconClock className="h-[1.05rem] w-[1.05rem]" />
                </span>
                <span className="text-[0.62rem] font-semibold uppercase leading-[1.3] tracking-[0.14em] text-bone-300">
                  Horários
                  <br />
                  de funcionamento
                </span>
              </div>

              {site.horarios.lista.map((h, i) => (
                <div
                  key={h.dias}
                  className={
                    i < site.horarios.lista.length - 1
                      ? 'shrink-0 sm:border-r sm:border-ink-700 sm:pr-6'
                      : 'shrink-0'
                  }
                >
                  <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-rise-500">
                    {h.dias}
                  </dt>
                  <dd
                    className={
                      h.aberto
                        ? 'mt-1 font-display text-[1.05rem] font-bold text-bone-50'
                        : 'mt-1 text-[0.95rem] text-bone-500'
                    }
                  >
                    {h.horas}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── chamadas para ação ──────────────────────────────────── */}
          <div
            className="reveal mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3"
            style={{ '--reveal-delay': '440ms' } as React.CSSProperties}
            data-visible="true"
          >
            {/* CTA de conversão — abre o WhatsApp da academia */}
            <a
              href={resolverHref(hero.ctaPrimario.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-[2px] bg-rise-500 px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-white sm:px-9 sm:py-5 shadow-[0_18px_44px_-14px_rgba(240,74,37,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400 hover:shadow-[0_24px_56px_-14px_rgba(240,74,37,1)]"
            >
              {/* brilho que atravessa o botão no hover */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <IconWhatsApp className="relative h-[1.15rem] w-[1.15rem]" />
              <span className="relative">{hero.ctaPrimario.rotulo}</span>
              <IconArrow className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Acesso de quem já treina na academia */}
            <Link
              href={hero.ctaSecundario.href}
              className="group inline-flex items-center justify-center gap-3 rounded-[2px] border border-bone-50/30 bg-white/[0.05] px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-bone-50 backdrop-blur-md sm:px-9 sm:py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rise-500 hover:bg-rise-500/10"
            >
              <IconUsuario className="h-[1.15rem] w-[1.15rem] text-rise-500 transition-transform duration-300 group-hover:scale-110" />
              {hero.ctaSecundario.rotulo}
            </Link>
          </div>
        </div>
      </Container>

      {/* ══════════════════════════════ rodapé do hero ═══════════════════ */}
      <Container size="wide" className="hero-saida relative mt-9 sm:mt-12 lg:absolute lg:inset-x-0 lg:bottom-10 lg:mt-0">
        <div className="flex items-end gap-8">
          {/* indicador de rolagem */}
          <a
            href="#sobre"
            className="reveal group flex flex-1 items-center gap-4"
            style={{ '--reveal-delay': '520ms' } as React.CSSProperties}
            data-visible="true"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-bone-50/25 text-bone-200 transition-colors duration-300 group-hover:border-rise-500 group-hover:text-rise-500">
              <IconArrow className="h-4 w-4 rotate-90 transition-transform duration-500 group-hover:translate-y-0.5" />
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-bone-400 transition-colors group-hover:text-bone-200">
              {hero.rolar}
            </span>
            {/* régua que se estende até a borda da composição */}
            <span
              aria-hidden
              className="hidden h-px flex-1 bg-gradient-to-r from-ink-600 via-ink-700 to-transparent sm:block"
            />
          </a>

        </div>
      </Container>

      {/* ══════════════════════════════════ controle de reprodução
          A WCAG 2.2.2 exige um jeito de parar conteúdo em movimento que passa
          de 5 s. O controle não aparece na composição — ele só se materializa
          quando alguém chega nele pelo teclado (Tab). Visualmente o hero fica
          limpo; para quem navega por teclado, o vídeo continua controlável. */}
      {pronto && (
        <button
          type="button"
          onClick={alternar}
          aria-label={tocando ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-6 focus-visible:right-5 focus-visible:z-20 focus-visible:flex focus-visible:items-center focus-visible:gap-2 focus-visible:rounded-full focus-visible:border focus-visible:border-bone-50/40 focus-visible:bg-ink-950/90 focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[0.625rem] focus-visible:font-semibold focus-visible:uppercase focus-visible:tracking-[0.18em] focus-visible:text-bone-50 focus-visible:backdrop-blur-md sm:focus-visible:bottom-8 lg:focus-visible:right-12"
        >
          <span
            aria-hidden
            className={cn(
              'block h-1.5 w-1.5 rounded-full',
              tocando ? 'bg-rise-500' : 'bg-bone-500',
            )}
          />
          {tocando ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        </button>
      )}
    </section>
  );
}
