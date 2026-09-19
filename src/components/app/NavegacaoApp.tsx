'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { IconCasa, IconHalter, IconPrato, IconGota, IconCalendario } from '@/components/ui/Icons';

const ITENS = [
  { href: '/app', rotulo: 'Início', Icone: IconCasa },
  { href: '/app/treino', rotulo: 'Treino', Icone: IconHalter },
  { href: '/app/dieta', rotulo: 'Dieta', Icone: IconPrato },
  { href: '/app/agua', rotulo: 'Água', Icone: IconGota },
  { href: '/app/aulas', rotulo: 'Aulas', Icone: IconCalendario },
];

/**
 * Barra inferior — o padrão que todo mundo já conhece de app.
 * `pb-[env(safe-area-inset-bottom)]` afasta do indicador de gestos do iPhone.
 */
export function NavegacaoApp() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Navegação do aplicativo"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-lg">
        {ITENS.map(({ href, rotulo, Icone }) => {
          const ativo = href === '/app' ? caminho === '/app' : caminho.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 py-2.5 transition-colors',
                  ativo ? 'text-rise-500' : 'text-bone-500 hover:text-bone-200',
                )}
              >
                {ativo && (
                  <span aria-hidden className="absolute inset-x-5 top-0 h-[2px] bg-rise-500" />
                )}
                <Icone className="h-[1.3rem] w-[1.3rem]" />
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em]">
                  {rotulo}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
