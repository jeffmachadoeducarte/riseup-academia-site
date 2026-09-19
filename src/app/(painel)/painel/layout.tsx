import type { Metadata } from 'next';
import Link from 'next/link';
import { exigirPerfil } from '@/lib/auth';
import { sair } from '@/app/entrar/acoes';
import { Logo } from '@/components/ui/Logo';
import { IconSair } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s · Painel Rise Up' },
  robots: { index: false, follow: false, nocache: true },
};

const MENU = [
  { href: '/painel', rotulo: 'Visão geral' },
  { href: '/painel/alunos', rotulo: 'Alunos' },
  { href: '/painel/conteudo', rotulo: 'Conteúdo' },
];

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const usuario = await exigirPerfil('master');

  return (
    <div className="min-h-[100svh] bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/painel" className="text-lg" aria-label="Painel Rise Up">
              <Logo compacto />
            </Link>
            <nav aria-label="Navegação do painel">
              <ul className="flex items-center gap-6">
                {MENU.map((m) => (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-bone-400 transition-colors hover:text-bone-50"
                    >
                      {m.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-[0.75rem] text-bone-200">{usuario.nome}</span>
              <span className="block text-[0.6rem] uppercase tracking-wider text-rise-500">
                Direção
              </span>
            </span>
            <form action={sair}>
              <button
                type="submit"
                aria-label="Sair da conta"
                className="grid h-9 w-9 place-items-center rounded-[2px] border border-ink-700 text-bone-400 transition-colors hover:border-rise-600 hover:text-rise-400"
              >
                <IconSair className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
