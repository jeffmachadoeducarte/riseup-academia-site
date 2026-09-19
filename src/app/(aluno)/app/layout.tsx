import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { alunoAtual } from '@/lib/auth';
import { ROTULO_PERFIL } from '@/db/schema';
import { site } from '@/config/site';
import { Logo } from '@/components/ui/Logo';
import { NavegacaoApp } from '@/components/app/NavegacaoApp';
import { RegistrarSW } from '@/components/app/RegistrarSW';
import { FaixaInstalar } from '@/components/app/InstalarApp';
import { IconUsuario } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: { default: 'Meu treino', template: '%s · Rise Up' },
  manifest: '/app.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rise Up',
  },
  icons: {
    apple: '/assets/icones/icone-apple-180.png',
  },
  // A área do aluno nunca deve ser indexada.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: '#070709',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Impede o zoom automático do iOS ao focar um campo, sem travar o zoom manual.
  maximumScale: 5,
  viewportFit: 'cover',
};

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const { usuario, aluno } = await alunoAtual();
  const primeiroNome = usuario.nome.split(' ')[0];

  return (
    <div className="flex min-h-[100svh] flex-col bg-ink-950">
      <RegistrarSW />
      <FaixaInstalar />

      <header className="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 px-4 py-3">
          <Link href="/app" aria-label={`${site.marca.nome} — início do app`} className="text-base">
            <Logo compacto />
          </Link>

          <Link
            href="/app/perfil"
            className="flex items-center gap-2.5 rounded-full border border-ink-700 py-1.5 pl-3 pr-1.5 transition-colors hover:border-bone-500"
          >
            <span className="text-right leading-tight">
              <span className="block text-[0.75rem] font-semibold text-bone-50">
                {primeiroNome}
              </span>
              <span className="block text-[0.6rem] uppercase tracking-wider text-rise-500">
                {aluno.perfilTreino ? ROTULO_PERFIL[aluno.perfilTreino] : 'Sem perfil'}
              </span>
            </span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-800 text-bone-300">
              <IconUsuario className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </header>

      {/* pb-24 reserva o espaço da barra inferior fixa */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-5">{children}</main>

      <NavegacaoApp />
    </div>
  );
}
