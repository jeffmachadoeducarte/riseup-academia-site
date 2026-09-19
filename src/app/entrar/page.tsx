import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site } from '@/config/site';
import { usuarioAtual, destinoDoPerfil } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';
import { IconArrow } from '@/components/ui/Icons';
import { versionado } from '@/config/midia';
import { FormularioEntrar } from './formulario';

export const metadata: Metadata = {
  title: 'Área do aluno',
  description: `Acesso dos alunos da ${site.marca.nome}.`,
  robots: { index: false, follow: false },
};

export default async function Entrar() {
  // Quem já está logado não vê a tela de login de novo.
  const usuario = await usuarioAtual();
  if (usuario) redirect(destinoDoPerfil(usuario.perfil));

  return (
    <main className="grid min-h-[100svh] lg:grid-cols-2">
      {/* ─────────────────────────────────────────────── formulário */}
      <div className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(240,74,37,0.10),transparent_70%)]"
        />

        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2.5 text-lg"
          aria-label={`${site.marca.nome} — voltar ao site`}
        >
          <Logo />
        </Link>

        <div className="mx-auto w-full max-w-sm py-12">
          <p className="t-eyebrow text-rise-500">Área do aluno</p>
          <h1 className="t-display mt-4 text-[clamp(2rem,5vw,2.75rem)] text-bone-50">
            Bem-vindo de volta.
          </h1>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-bone-400">
            Acesse seu treino, sua dieta, seus pagamentos e o acompanhamento da
            sua evolução.
          </p>

          <div className="mt-9">
            <FormularioEntrar />
          </div>

          <p className="mt-7 border-t border-ink-800 pt-6 text-[0.8rem] leading-relaxed text-bone-500">
            Ainda não tem acesso? Fale com a recepção da academia ou chame no{' '}
            <a
              href={site.contato.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rise-400 underline underline-offset-4 hover:text-rise-500"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>

        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-bone-500 transition-colors hover:text-rise-400"
        >
          <IconArrow className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
          Voltar ao site
        </Link>
      </div>

      {/* ──────────────────────────────────────────── painel visual */}
      <aside className="relative hidden overflow-hidden lg:block">
        {/* Mesmo tratamento do hero: o vídeo se dissolve na borda esquerda,
            em vez de terminar num corte reto contra o formulário. */}
        <div
          aria-hidden
          className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_0%,#000_22%,#000_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_22%,#000_100%)]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={versionado(site.hero.video.poster)}
            aria-hidden="true"
            tabIndex={-1}
            className="h-full w-full object-cover"
          >
            <source src={versionado(site.hero.video.mp4)} type="video/mp4" />
          </video>
        </div>

        {/* gradiente horizontal + vertical, como no hero */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent"
        />
        {/* vinheta */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,9,0.8)_100%)]"
        />
        {/* brilho quente da marca */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_80%_60%_at_40%_100%,rgba(240,74,37,0.16),transparent_70%)]"
        />
        <div aria-hidden className="grain absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="t-display text-[clamp(2rem,3.5vw,3rem)] leading-[0.95] text-bone-50">
            Seu treino
            <br />
            <span className="text-rise-500">no seu bolso.</span>
          </p>
          <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed text-bone-200">
            Treino, alimentação, hidratação e frequência — tudo no mesmo lugar,
            direto do celular.
          </p>
        </div>
      </aside>
    </main>
  );
}
