import { cn } from '@/lib/cn';

type Props = {
  indice?: string;
  etiqueta: string;
  titulo: string;
  descricao?: string;
  className?: string;
  /** Alinha o bloco à direita em telas grandes. */
  alinhamento?: 'esquerda' | 'centro';
};

export function SectionTitle({
  indice,
  etiqueta,
  titulo,
  descricao,
  className,
  alinhamento = 'esquerda',
}: Props) {
  const centro = alinhamento === 'centro';

  return (
    <header className={cn('reveal', centro && 'mx-auto max-w-2xl text-center', className)}>
      <div className={cn('flex items-center gap-3', centro && 'justify-center')}>
        {indice && (
          <span className="font-display text-[0.6875rem] font-bold tracking-[0.2em] text-bone-500">
            {indice}
          </span>
        )}
        <span aria-hidden className="h-px w-6 bg-rise-500" />
        <span className="t-eyebrow text-rise-500">{etiqueta}</span>
      </div>

      <h2 className={cn(
        't-display mt-5 text-[clamp(2.1rem,6vw,4rem)] text-bone-50',
        // limita a medida do título: uma manchete atravessando 1400px fica fraca
        centro ? 'mx-auto max-w-3xl' : 'max-w-[18ch]',
      )}>
        {titulo}
      </h2>

      {descricao && (
        <p
          className={cn(
            'mt-5 max-w-xl text-[0.975rem] leading-relaxed text-bone-400',
            centro && 'mx-auto',
          )}
        >
          {descricao}
        </p>
      )}
    </header>
  );
}
