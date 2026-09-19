import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { IconStar } from '@/components/ui/Icons';

const { provaSocial } = site;

/**
 * Prova social honesta: só avaliações públicas reais, reproduzidas na íntegra,
 * com autoria e link para a fonte. Nenhum depoimento foi escrito aqui.
 * A base ainda é pequena (5 avaliações) e isso está dito na própria seção.
 */
export function ProvaSocial() {
  return (
    <section className="relative bg-ink-900 py-24 sm:py-32 lg:py-36">
      <Container size="wide">
        <SectionTitle
          indice={provaSocial.indice}
          etiqueta={provaSocial.etiqueta}
          titulo={provaSocial.titulo}
          alinhamento="centro"
        />

        <div className="mx-auto mt-14 max-w-4xl lg:mt-18">
          {provaSocial.exibirNota && (
            <a
              href={provaSocial.nota.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="reveal mx-auto mb-12 flex w-fit items-center gap-4 rounded-[2px] border border-ink-700 bg-ink-850/60 px-6 py-4 transition-colors hover:border-rise-500/50"
            >
              <span className="flex items-center gap-1 text-rise-500" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <IconStar key={i} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="h-8 w-px bg-ink-700" aria-hidden />
              <span>
                <span className="t-display block text-2xl text-bone-50">
                  {provaSocial.nota.valor}
                  <span className="text-base text-bone-500"> / 5</span>
                </span>
                <span className="mt-0.5 block text-[0.65rem] tracking-wider text-bone-500">
                  {provaSocial.nota.total} avaliações · {provaSocial.nota.fonte}
                </span>
              </span>
            </a>
          )}

          {provaSocial.depoimentos.map((d) => (
            <figure key={d.autor} className="reveal text-center">
              <blockquote>
                <p className="t-display mx-auto max-w-3xl text-[clamp(1.35rem,3.6vw,2.15rem)] leading-[1.22] text-bone-50">
                  <span aria-hidden className="text-rise-500">“</span>
                  {d.texto}
                  <span aria-hidden className="text-rise-500">”</span>
                </p>
              </blockquote>

              <figcaption className="mt-8 flex flex-col items-center gap-1.5">
                <span className="text-[0.8125rem] font-semibold tracking-wide text-bone-200">
                  {d.autor}
                </span>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-block py-1.5 text-[0.7rem] tracking-wider text-bone-500 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
                >
                  {d.fonte}
                </a>
              </figcaption>
            </figure>
          ))}

          <p className="reveal mx-auto mt-14 max-w-lg border-t border-ink-700 pt-6 text-center text-[0.7rem] leading-relaxed text-bone-500">
            {provaSocial.rodape}
            {provaSocial.exibirNota && ` ${provaSocial.nota.aviso}`}
          </p>
        </div>
      </Container>
    </section>
  );
}
