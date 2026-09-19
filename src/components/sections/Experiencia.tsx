'use client';

import { useRef } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Triangulo } from '@/components/ui/Logo';
import { IconSom, IconSomMudo } from '@/components/ui/Icons';
import { useProgressoScroll } from '@/hooks/useProgressoScroll';
import { useVideoNaTela } from '@/hooks/useVideoNaTela';

const { experiencia, marca } = site;

/**
 * Vídeo com som automático e botão de fallback.
 *
 * Existe como componente próprio porque a seção o renderiza duas vezes — uma
 * no palco do desktop, outra na composição do mobile. Cada instância precisa
 * do seu próprio `ref` e do seu próprio observador; um `ref` compartilhado
 * entre duas tags seria sobrescrito pela última a montar.
 *
 * A instância escondida por `display:none` nunca dispara o
 * IntersectionObserver, então só a visível toca.
 */
function VideoExperiencia({ className }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const { mudo, somBloqueado, alternarSom, semMovimento } = useVideoNaTela(video, { limiar: 0.4 });

  return (
    <>
      <video
        ref={video}
        src={experiencia.video.src}
        poster={`${experiencia.video.capa}-720.jpg`}
        preload="metadata"
        playsInline
        loop
        muted
        controls={semMovimento}
        controlsList="nodownload"
        aria-label={`Vídeo institucional da ${marca.nome}`}
        className={cn('h-full w-full object-cover', className)}
        style={{ objectPosition: experiencia.video.foco }}
      />

      {/* Com controles nativos à mostra, este botão seria redundante. */}
      {!semMovimento && (
      <button
        type="button"
        onClick={alternarSom}
        aria-label={mudo ? 'Ativar som do vídeo' : 'Desativar som do vídeo'}
        className={cn(
          'absolute right-5 top-5 z-10 inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5',
          'text-[0.65rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition-colors',
          // Quando o navegador barra o som, o botão ganha destaque — é ele
          // que devolve ao visitante o áudio que o autoplay não pôde dar.
          somBloqueado
            ? 'border-rise-500 bg-rise-500/90 text-white hover:bg-rise-400'
            : 'border-bone-50/25 bg-ink-950/60 text-bone-200 hover:border-bone-50/60 hover:text-bone-50',
        )}
      >
        {mudo ? <IconSomMudo className="h-3.5 w-3.5" /> : <IconSom className="h-3.5 w-3.5" />}
        {mudo ? 'Ativar som' : 'Som ligado'}
      </button>
      )}
    </>
  );
}

/**
 * EXPERIÊNCIA — o grande momento cinematográfico da página.
 *
 * Sequência no desktop:
 *   0%   vídeo enquadrado na composição, texto presente
 *   50%  a moldura abre, o vídeo cresce
 *   100% vídeo no tamanho máximo, texto já saiu
 *
 * A seção é alta e o conteúdo gruda com `position: sticky` — rolagem nativa.
 * O visitante sobe, desce, usa teclado e sai quando quiser; nada intercepta
 * a roda do mouse.
 *
 * No mobile o palco é desligado: prender a tela num aparelho pequeno rende
 * pouco e atrapalha muito. Lá a seção é uma composição normal, com o mesmo
 * vídeo e o mesmo comportamento de áudio.
 */
export function Experiencia() {
  const palco = useRef<HTMLDivElement>(null);
  useProgressoScroll(palco, { desligarEmMobile: true });

  return (
    <section id="experiencia" className="relative bg-ink-950">
      {/* ═══════════════════════ palco pinned (desktop) ═══════════════════ */}
      <div ref={palco} className="palco hidden lg:block" style={{ height: '240svh' }}>
        <div className="palco-tela relative grid place-items-center">
          {/* Fundo ambiente: a mesma cena, desfocada e ampliada. Como está
              borrada, a ampliação não aparece — e é ela que dá a sensação de
              tela cheia sem esticar o vídeo nítido. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${experiencia.video.capa}-720.jpg`}
            alt=""
            aria-hidden
            className="exp-ambiente pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-ink-950/55" />

          {/* Texto à esquerda; o quadro de vídeo à direita. */}
          <Container size="wide" className="relative grid w-full grid-cols-12 items-center gap-10">
            <div className="exp-texto col-span-5">
              <p className="t-eyebrow flex items-center gap-3 text-rise-500">
                <Triangulo className="h-2.5 w-2.5" />
                {experiencia.etiqueta}
              </p>
              <h2 className="t-display mt-5 text-[clamp(2rem,4vw,3.5rem)] text-bone-50">
                {experiencia.titulo}
              </h2>
              <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-bone-200">
                {experiencia.texto}
              </p>
              <p className="mt-8 max-w-xs text-[0.7rem] leading-relaxed text-bone-400">
                {experiencia.legenda}
              </p>
            </div>

            <div className="col-span-7 flex justify-center">
              <div className="exp-moldura relative overflow-hidden rounded-[3px] bg-ink-850 shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]">
                <VideoExperiencia />
                <span
                  aria-hidden
                  className="exp-veu pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 to-transparent"
                />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ═════════════════════════ versão mobile ═════════════════════════ */}
      <div className="py-24 sm:py-28 lg:hidden">
        <Container size="wide">
          <p className="reveal t-eyebrow flex items-center gap-3 text-rise-500">
            <Triangulo className="h-2.5 w-2.5" />
            {experiencia.etiqueta}
          </p>
          <h2 className="reveal t-display mt-5 text-[clamp(2rem,7vw,2.75rem)] text-bone-50">
            {experiencia.titulo}
          </h2>
          <p className="reveal mt-4 max-w-md text-[0.95rem] leading-relaxed text-bone-200">
            {experiencia.texto}
          </p>

          <div className="reveal relative mt-8 aspect-[9/16] overflow-hidden rounded-[3px] bg-ink-850 sm:aspect-[4/5]">
            <VideoExperiencia />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent"
            />
          </div>

          <p className="reveal mt-4 text-[0.7rem] text-bone-500">{experiencia.legenda}</p>
        </Container>
      </div>
    </section>
  );
}
