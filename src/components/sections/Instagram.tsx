import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Figura } from '@/components/ui/Figura';
import { IconInstagram, IconArrow } from '@/components/ui/Icons';

const { instagram, redes } = site;

/**
 * Seção de Instagram 100% local.
 *
 * Nada aqui depende da API, de embed ou de script de terceiro: a prévia usa
 * frames do vídeo institucional servidos do próprio domínio. Se o Instagram
 * cair, mudar de política ou bloquear o embed, a seção continua idêntica.
 * O espaço está pronto para receber um feed real depois, sem mudar o layout.
 */
export function Instagram() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Container size="wide">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="reveal max-w-md">
            <div className="flex items-center gap-3">
              <span className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-bone-500">
                {instagram.indice}
              </span>
              <span aria-hidden className="h-px w-6 bg-rise-500" />
              <span className="t-eyebrow text-rise-500">{instagram.etiqueta}</span>
            </div>

            <h2 className="t-display mt-5 text-[clamp(2rem,5vw,3.25rem)] text-bone-50">
              {instagram.titulo}
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-400">
              {instagram.texto}
            </p>
          </div>

          <a
            href={redes.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group inline-flex w-fit items-center gap-3 rounded-[2px] border border-ink-600 px-6 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rise-500 hover:bg-rise-500"
          >
            <IconInstagram className="h-5 w-5 text-rise-500 transition-colors group-hover:text-white" />
            <span className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-bone-50">
              {redes.instagram.usuario}
            </span>
            <IconArrow className="h-4 w-4 text-bone-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {instagram.previa.map((item, i) => (
            <li
              key={`${item.src}-${i}`}
              className="reveal group relative aspect-square overflow-hidden rounded-[2px] bg-ink-850"
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <a
                href={redes.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.alt} — abrir o perfil ${redes.instagram.usuario} no Instagram`}
                className="block h-full w-full"
              >
                <Figura
                  base={item.src}
                  alt={item.alt}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-ink-950/45 transition-colors duration-500 group-hover:bg-ink-950/15"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                >
                  <IconInstagram className="h-7 w-7 text-bone-50" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="reveal mt-5 text-[0.7rem] tracking-wide text-bone-500">
          {instagram.aviso}
        </p>
      </Container>
    </section>
  );
}
