import { cn } from '@/lib/cn';

/**
 * Anel de progresso em SVG puro — sem biblioteca de gráfico.
 * `stroke-dasharray` + `stroke-dashoffset` desenham o arco proporcional.
 */
export function AnelProgresso({
  percentual, tamanho = 148, espessura = 10, className, children,
}: {
  percentual: number;
  tamanho?: number;
  espessura?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = Math.max(0, Math.min(100, percentual));
  const recuo = circunferencia - (preenchido / 100) * circunferencia;

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: tamanho, height: tamanho }}>
      <svg
        width={tamanho}
        height={tamanho}
        viewBox={`0 0 ${tamanho} ${tamanho}`}
        role="img"
        aria-label={`${preenchido}% da meta`}
        className="-rotate-90"
      >
        <circle
          cx={tamanho / 2} cy={tamanho / 2} r={raio}
          fill="none" stroke="currentColor" strokeWidth={espessura}
          className="text-ink-700"
        />
        <circle
          cx={tamanho / 2} cy={tamanho / 2} r={raio}
          fill="none" stroke="currentColor" strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={recuo}
          className="text-rise-500 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
