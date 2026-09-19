import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Figura } from '@/components/ui/Figura';
import { IconArrow } from '@/components/ui/Icons';

const { treinos, contato } = site;

export function Treinos() {
  return (
    <section id="treinos" className="relative bg-ink-950 py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionTitle
          indice={treinos.indice}
          etiqueta={treinos.etiqueta}
          titulo={treinos.titulo}
          descricao={treinos.descricao}
        />

        <ul className="mt-14 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:mt-20 lg:grid-cols-3">
          {treinos.itens.map((item, i) => (
            <li
              key={item.nome}
              className="reveal group relative overflow-hidden rounded-[2px] bg-ink-850"
              style={{ '--reveal-delay': `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <a
                href={contato.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.nome} — falar no WhatsApp sobre ${item.nome.toLowerCase()}`}
                className="block"
              >
                <div className="relative aspect-[5/6] overflow-hidden sm:aspect-[4/5]">
                  <Figura
                    base={item.imagem}
                    alt={item.alt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/5 transition-opacity duration-500"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="t-display text-2xl text-bone-50 sm:text-[1.7rem]">
                      {item.nome}
                    </h3>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-bone-50/25 text-bone-50 transition-all duration-400 group-hover:border-rise-500 group-hover:bg-rise-500"
                    >
                      <IconArrow className="h-4 w-4" />
                    </span>
                  </div>

                  {/* altura mínima de 3 linhas: mantém todos os títulos do
                      grid na mesma linha de base, independentemente do texto */}
                  <p className="mt-3 min-h-[4.5rem] max-w-[30ch] text-[0.85rem] leading-relaxed text-bone-400 transition-colors duration-500 group-hover:text-bone-200">
                    {item.texto}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-rise-500 transition-all duration-500 ease-out group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
