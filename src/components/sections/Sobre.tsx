import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Figura } from '@/components/ui/Figura';
import { Triangulo } from '@/components/ui/Logo';

const { sobre, marca } = site;
const anos = new Date().getFullYear() - marca.fundacao;

export function Sobre() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink-950 py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* ------------------------------------------------- imagem */}
          <div className="reveal relative lg:col-span-5 lg:order-last">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] sm:aspect-[3/4] lg:aspect-[4/5]">
              <Figura
                base={sobre.imagem.src}
                alt={sobre.imagem.alt}
                foco={sobre.imagem.foco}
                sizes="(max-width: 1024px) 100vw, 40vw"
                imgClassName="scale-[1.01] transition-transform duration-[1.2s] ease-out"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"
              />
            </div>

            {/* Selo do ano, montado sobre a borda da imagem. */}
            <div className="absolute -bottom-6 -left-4 border border-ink-700 bg-ink-950/95 px-6 py-5 backdrop-blur-sm sm:-left-8 sm:px-8 sm:py-6">
              <p className="t-display text-4xl text-rise-500 sm:text-5xl">{sobre.destaque.valor}</p>
              <p className="mt-2 max-w-[13rem] text-[0.7rem] leading-relaxed text-bone-400">
                {sobre.destaque.texto}
              </p>
            </div>
          </div>

          {/* -------------------------------------------------- texto */}
          <div className="lg:col-span-7">
            <div className="reveal flex items-center gap-3">
              <span className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-bone-500">
                {sobre.indice}
              </span>
              <span aria-hidden className="h-px w-6 bg-rise-500" />
              <span className="t-eyebrow text-rise-500">{sobre.etiqueta}</span>
            </div>

            <h2 className="reveal t-display mt-6 text-[clamp(2.25rem,6vw,4.25rem)] text-bone-50">
              {sobre.titulo}
            </h2>

            <div className="mt-8 space-y-6 border-l border-ink-700 pl-6 sm:pl-8">
              {sobre.paragrafos.map((p, i) => (
                <p
                  key={i}
                  className="reveal max-w-xl text-[0.975rem] leading-[1.75] text-bone-200"
                  style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
                >
                  {p}
                </p>
              ))}
            </div>

            <p
              className="reveal mt-10 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-bone-500"
              style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
            >
              <Triangulo className="h-2.5 w-2.5 text-rise-500" />
              {anos} anos em {marca.cidade}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
