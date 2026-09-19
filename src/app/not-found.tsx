import Link from 'next/link';
import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Logo, Triangulo } from '@/components/ui/Logo';
import { IconArrow } from '@/components/ui/Icons';

export default function NaoEncontrado() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden py-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(240,74,37,0.14),transparent_70%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <Container className="text-center">
        <Triangulo className="mx-auto h-5 w-5 text-rise-500" />
        <p className="t-display mt-8 text-[clamp(4.5rem,18vw,10rem)] leading-none text-bone-50">
          404
        </p>
        <h1 className="t-display mt-2 text-[clamp(1.5rem,4vw,2.25rem)] text-rise-500">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-[0.95rem] leading-relaxed text-bone-400">
          O endereço que você acessou não existe — ou deixou de existir. Volte para
          a página inicial e siga o treino.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-[2px] bg-rise-500 px-7 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400"
          >
            Ir para o início
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={site.contato.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-[2px] border border-ink-600 px-7 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-bone-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-bone-400"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div className="mt-16 text-base opacity-60">
          <Logo />
        </div>
      </Container>
    </main>
  );
}
