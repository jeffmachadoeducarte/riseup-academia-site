import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { IconStar } from '@/components/ui/Icons';

const { provaSocial } = site;

/**
 * Prova social honesta: só avaliações públicas reais, reproduzidas na íntegra,
 * com o nome de quem escreveu. Nenhum depoimento foi criado aqui.
 *
 * As avaliações passam da direita para a esquerda numa faixa contínua. A faixa
 * ocupa só a medida central da página, não a largura inteira da tela, e não é
 * clicável — é leitura, não navegação. Quem passa o mouse (ou chega pelo
 * teclado) pausa o movimento para conseguir ler.
 */
export function ProvaSocial() {
  const itens = provaSocial.depoimentos;
  // A faixa precisa da lista duplicada: o keyframe desloca 50% e emenda.
  const faixa = [...itens, ...itens];
  const duracao = `${itens.length * 13}s`;

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32 lg:py-36">
      <Container size="wide">
        <SectionTitle
          indice={provaSocial.indice}
          etiqueta={provaSocial.etiqueta}
          titulo={provaSocial.titulo}
          alinhamento="centro"
        />

        {provaSocial.exibirNota && (
          <div className="reveal mx-auto mt-12 flex w-fit items-center gap-4 rounded-[2px] border border-ink-700 bg-ink-850/60 px-6 py-4">
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
          </div>
        )}
      </Container>

      {/* ───────────────────────── faixa de avaliações ────────────────────
          `mx-auto max-w-5xl` mantém o movimento na medida central da página.
          `overflow-hidden` recorta; as pontas dissolvem em degradê. */}
      <div className="reveal relative mx-auto mt-14 max-w-5xl overflow-hidden px-5 sm:px-8">
        <ul
          className="marquee-lento flex w-max select-none items-stretch gap-4"
          style={{ '--marquee-duracao': duracao } as React.CSSProperties}
        >
          {faixa.map((d, i) => (
            <li
              key={`${d.autor}-${i}`}
              // Metade da faixa é cópia visual: leitores de tela leem só a
              // primeira, senão cada avaliação seria anunciada duas vezes.
              aria-hidden={i >= itens.length}
              className="w-[19rem] shrink-0 rounded-[3px] border border-ink-700 bg-ink-850/70 p-6 sm:w-[23rem]"
            >
              <figure className="flex h-full flex-col">
                <span className="flex items-center gap-1 text-rise-500" aria-hidden>
                  {Array.from({ length: 5 }, (_, n) => (
                    <IconStar key={n} className="h-3 w-3" />
                  ))}
                </span>

                <blockquote className="mt-4 flex-1">
                  <p className="text-[0.925rem] leading-relaxed text-bone-100">
                    <span aria-hidden className="text-rise-500">“</span>
                    {d.texto}
                    <span aria-hidden className="text-rise-500">”</span>
                  </p>
                </blockquote>

                <figcaption className="mt-5 border-t border-ink-800 pt-4 text-[0.78rem] text-bone-400">
                  {d.autor}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* pontas dissolvidas, para a faixa não terminar em corte seco */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ink-900 to-transparent sm:w-20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink-900 to-transparent sm:w-20"
        />
      </div>

      <Container size="wide">
        <p className="reveal mx-auto mt-12 max-w-lg border-t border-ink-700 pt-6 text-center text-[0.7rem] leading-relaxed text-bone-500">
          {provaSocial.rodape}
          {provaSocial.exibirNota && ` ${provaSocial.nota.aviso}`}
        </p>
      </Container>
    </section>
  );
}
