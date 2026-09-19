import { cn } from '@/lib/cn';

type Variante = 'primario' | 'secundario' | 'fantasma';

type Props = {
  href: string;
  children: React.ReactNode;
  variante?: Variante;
  className?: string;
  /** Links externos ganham target/rel automaticamente. */
  externo?: boolean;
  'aria-label'?: string;
};

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden ' +
  'rounded-[2px] font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] ' +
  'px-7 py-4 transition-all duration-300 ease-out select-none';

const variantes: Record<Variante, string> = {
  primario:
    'bg-rise-500 text-white hover:bg-rise-400 ' +
    'shadow-[0_10px_30px_-12px_rgba(240,74,37,0.7)] hover:shadow-[0_16px_40px_-12px_rgba(240,74,37,0.85)] ' +
    'hover:-translate-y-0.5 active:translate-y-0 active:bg-rise-600',
  secundario:
    'border border-bone-50/25 text-bone-50 backdrop-blur-sm bg-white/[0.04] ' +
    'hover:border-bone-50/60 hover:bg-white/[0.09] hover:-translate-y-0.5 active:translate-y-0',
  fantasma:
    'px-0 py-1 text-bone-200 hover:text-rise-400 ' +
    'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right ' +
    'after:scale-x-0 after:bg-rise-500 after:transition-transform after:duration-300 ' +
    'hover:after:origin-left hover:after:scale-x-100',
};

export function Button({ href, children, variante = 'primario', className, externo, ...rest }: Props) {
  const externoDetectado = externo ?? /^https?:|^tel:|^mailto:/.test(href);

  return (
    <a
      href={href}
      className={cn(base, variantes[variante], className)}
      {...(externoDetectado ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
