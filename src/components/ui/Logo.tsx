import { cn } from '@/lib/cn';

/**
 * Marca da Rise Up redesenhada em texto + símbolo.
 *
 * O letreiro oficial (fachada e parede interna) usa "▲RISE" em laranja sobre
 * "UP" em branco quente. Aqui a lockup é horizontal, para caber no header e no
 * rodapé sem perder o triângulo, que é o elemento mais reconhecível da marca.
 *
 * → Quando o cliente enviar o logo vetorial oficial, trocar por um <svg>
 *   importado. Ver docs/pendencias-cliente.md.
 */
export function Logo({ className, compacto = false }: { className?: string; compacto?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 leading-none', className)}>
      <Triangulo className="h-[1.15em] w-[1.15em] shrink-0 text-rise-500" />
      <span className="font-display font-extrabold uppercase italic tracking-[-0.03em]">
        <span className="text-rise-500">Rise</span>
        <span className="text-bone-50"> Up</span>
      </span>
      {!compacto && (
        <span className="hidden font-sans text-[0.5rem] font-semibold uppercase tracking-[0.3em] text-bone-500 sm:inline">
          Academia
        </span>
      )}
    </span>
  );
}

/** Triângulo da marca — reaproveitado como marcador gráfico no site. */
export function Triangulo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 3.5 22.5 20.5H1.5z" />
    </svg>
  );
}
