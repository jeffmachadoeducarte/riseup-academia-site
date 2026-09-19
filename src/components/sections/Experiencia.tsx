'use client';

import { useRef, useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Figura } from '@/components/ui/Figura';
import { IconPlay } from '@/components/ui/Icons';
import { Triangulo } from '@/components/ui/Logo';

const { experiencia, marca } = site;

/**
 * Segunda aparição do vídeo — composição editorial, não repete o hero.
 *
 * Aqui o reel roda inteiro, com áudio e controles, e só é baixado quando o
 * visitante aperta play (`preload="none"`). O poster carrega em lazy.
 */
export function Experiencia() {
  const video = useRef<HTMLVideoElement>(null);
  const [iniciado, setIniciado] = useState(false);

  function reproduzir() {
    const el = video.current;
    if (!el) return;
    setIniciado(true);
    el.play().catch(() => undefined);
  }

  return (
    <section
      id="experiencia"
      className="relative overflow-hidden bg-ink-950 py-24 sm:py-32 lg:py-40"
    >
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------- texto */}
          <div className="lg:col-span-5">
            <div className="reveal flex items-center gap-3">
              <span className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-bone-500">
                {experiencia.indice}
              </span>
              <span aria-hidden className="h-px w-6 bg-rise-500" />
              <span className="t-eyebrow text-rise-500">{experiencia.etiqueta}</span>
            </div>

            <h2 className="reveal t-display mt-6 text-[clamp(2.25rem,6vw,4rem)] text-bone-50">
              {experiencia.titulo}
            </h2>

            <p
              className="reveal mt-6 max-w-md text-[0.975rem] leading-[1.75] text-bone-200"
              style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
            >
              {experiencia.texto}
            </p>

            <ul
              className="reveal mt-10 space-y-3.5 border-t border-ink-700 pt-8"
              style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            >
              {site.treinos.itens.map((t) => (
                <li key={t.nome} className="flex items-center gap-3 text-sm text-bone-400">
                  <Triangulo className="h-2 w-2 shrink-0 text-rise-500" />
                  {t.nome}
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------- vídeo */}
          <div className="reveal lg:col-span-7">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* moldura deslocada — dá profundidade sem sombra pesada */}
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 border border-ink-700/70 sm:-inset-5"
              />
              <div
                aria-hidden
                className="absolute -right-6 -top-6 -z-10 h-32 w-32 bg-[radial-gradient(circle,rgba(240,74,37,0.22),transparent_70%)] blur-xl"
              />

              <div className="relative aspect-[9/16] overflow-hidden rounded-[2px] bg-ink-850 sm:aspect-[4/5] lg:aspect-[16/11]">
                {/* Sem `poster`: o atributo baixa a imagem no carregamento da
                    página, mesmo com a seção longe da primeira dobra. A capa é
                    uma <img lazy> por cima, que sai quando o vídeo começa. */}
                <video
                  ref={video}
                  src={experiencia.video.src}
                  preload="none"
                  playsInline
                  controls={iniciado}
                  controlsList="nodownload"
                  onEnded={() => setIniciado(false)}
                  aria-label={`Vídeo institucional da ${marca.nome}`}
                  style={{ objectPosition: experiencia.video.foco }}
                  className="h-full w-full object-cover"
                />

                {/* Capa com botão de play — some quando o vídeo começa. */}
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    iniciado ? 'pointer-events-none opacity-0' : 'opacity-100',
                  )}
                >
                  <Figura
                    base={experiencia.video.capa}
                    alt={experiencia.video.capaAlt}
                    foco={experiencia.video.foco}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="absolute inset-0"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-ink-950/20"
                  />
                  <button
                    type="button"
                    onClick={reproduzir}
                    aria-label={`Reproduzir vídeo institucional da ${marca.nome} (${experiencia.video.duracao})`}
                    className="group absolute inset-0 grid place-items-center"
                  >
                    <span className="relative grid h-20 w-20 place-items-center rounded-full border border-bone-50/30 bg-ink-950/50 backdrop-blur-sm transition-all duration-400 group-hover:scale-105 group-hover:border-rise-500 group-hover:bg-rise-500 sm:h-24 sm:w-24">
                      <IconPlay className="h-6 w-6 translate-x-0.5 text-bone-50 sm:h-7 sm:w-7" />
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full border border-rise-500/40 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-0"
                      />
                    </span>
                  </button>

                  <span className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-bone-200">
                      Assistir
                    </span>
                    <span className="rounded-full border border-bone-50/20 bg-ink-950/60 px-3 py-1 text-[0.65rem] tracking-wider text-bone-200 backdrop-blur-sm">
                      {experiencia.video.duracao}
                    </span>
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[0.7rem] tracking-wide text-bone-500">
                {experiencia.legenda}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
