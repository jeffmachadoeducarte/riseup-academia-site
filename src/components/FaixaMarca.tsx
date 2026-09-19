import { Triangulo } from '@/components/ui/Logo';

const PALAVRAS = ['Musculação', 'Cardio', 'Funcional', 'Lutas', 'Aulas coletivas', 'Acompanhamento'];

/**
 * Faixa contínua entre seções — quebra o ritmo vertical da página e reforça a
 * marca sem ocupar uma seção inteira. Puro CSS, some com `prefers-reduced-motion`.
 */
export function FaixaMarca() {
  const conteudo = [...PALAVRAS, ...PALAVRAS];

  return (
    <div
      aria-hidden
      className="relative flex overflow-hidden border-y border-ink-800 bg-ink-950 py-5 select-none"
    >
      <div className="marquee-track flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
        {conteudo.map((palavra, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 sm:gap-12">
            <span className="t-display text-lg text-bone-500/70 sm:text-2xl">{palavra}</span>
            <Triangulo className="h-2.5 w-2.5 shrink-0 text-rise-500" />
          </span>
        ))}
      </div>
      {/* dissolve as duas pontas para a faixa não terminar em corte seco */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-950 to-transparent sm:w-32"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-950 to-transparent sm:w-32"
      />
    </div>
  );
}
