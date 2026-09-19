import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

const { diferenciais } = site;

export function Diferenciais() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32 lg:py-40">
      {/* brilho quente muito sutil, ancorado no canto */}
      <div
        aria-hidden
        className="absolute -right-1/4 top-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(240,74,37,0.09),transparent_65%)]"
      />

      <Container size="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle
              indice={diferenciais.indice}
              etiqueta={diferenciais.etiqueta}
              titulo={diferenciais.titulo}
            />
            <p className="reveal mt-7 max-w-sm text-[0.85rem] leading-relaxed text-bone-500">
              Apenas fatos verificáveis. Condições comerciais, planos e grade de
              aulas são informados pela recepção.
            </p>
          </div>

          <ul className="lg:col-span-8">
            {diferenciais.itens.map((item, i) => (
              <li
                key={item.numero}
                className="reveal group border-t border-ink-700 py-8 transition-colors duration-500 last:border-b hover:border-rise-500/60 sm:py-10"
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <div className="flex gap-6 sm:gap-10">
                  <span className="font-display text-[0.75rem] font-bold tracking-[0.15em] text-rise-500 transition-transform duration-500 group-hover:-translate-y-0.5">
                    {item.numero}
                  </span>

                  <div className="min-w-0">
                    <h3 className="t-display text-xl text-bone-50 sm:text-2xl">{item.titulo}</h3>
                    <p className="mt-3 max-w-xl text-[0.925rem] leading-relaxed text-bone-400">
                      {item.texto}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
