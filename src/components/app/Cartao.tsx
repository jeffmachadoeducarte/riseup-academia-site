import Link from 'next/link';
import { cn } from '@/lib/cn';
import { IconArrow } from '@/components/ui/Icons';

export function Cartao({
  children, className, href, titulo, acao,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  titulo?: string;
  acao?: string;
}) {
  const corpo = (
    <>
      {titulo && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="t-eyebrow text-bone-400">{titulo}</h2>
          {acao && (
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-rise-500">
              {acao}
              <IconArrow className="h-3 w-3" />
            </span>
          )}
        </div>
      )}
      {children}
    </>
  );

  const estilo = cn(
    'block rounded-[3px] border border-ink-700 bg-ink-850/60 p-5',
    href && 'transition-colors hover:border-ink-600 hover:bg-ink-850',
    className,
  );

  return href ? <Link href={href} className={estilo}>{corpo}</Link> : <section className={estilo}>{corpo}</section>;
}

/** Título de tela dentro do app. */
export function TituloTela({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <header className="mb-5">
      <h1 className="t-display text-[1.75rem] text-bone-50">{titulo}</h1>
      {descricao && (
        <p className="mt-1.5 text-[0.85rem] leading-relaxed text-bone-400">{descricao}</p>
      )}
    </header>
  );
}

/** Estado vazio honesto: diz o que falta e quem resolve. */
export function Vazio({
  titulo, texto, acao,
}: {
  titulo: string;
  texto: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="rounded-[3px] border border-dashed border-ink-600 bg-ink-900/40 px-5 py-10 text-center">
      <p className="font-display text-[0.9rem] font-bold uppercase tracking-wide text-bone-200">
        {titulo}
      </p>
      <p className="mx-auto mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-bone-500">
        {texto}
      </p>
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
