import { site, resolverHref } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { IconWhatsApp, IconArrow } from '@/components/ui/Icons';
import { Triangulo } from '@/components/ui/Logo';

const { ctaFinal, contato } = site;

export function CtaFinal() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-28 sm:py-36 lg:py-44">
      {/* Fundo: luz quente da marca subindo do rodapé da seção. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_75%_at_50%_115%,rgba(240,74,37,0.24),transparent_70%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <div aria-hidden className="rule absolute inset-x-0 top-0 h-px" />

      <Container size="wide">
        <div className="mx-auto max-w-3xl text-center">
          <Triangulo className="reveal mx-auto h-5 w-5 text-rise-500" />

          <h2 className="reveal-scale t-display mt-8 text-[clamp(2.5rem,8.5vw,6rem)] text-bone-50">
            <span className="block">{ctaFinal.titulo[0]}</span>
            <span className="block text-rise-500">{ctaFinal.titulo[1]}</span>
          </h2>

          <p
            className="reveal mx-auto mt-7 max-w-lg text-[0.975rem] leading-relaxed text-bone-200"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            {ctaFinal.texto}
          </p>

          <div
            className="reveal mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
          >
            <a
              href={contato.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-8 py-4.5 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_18px_44px_-16px_rgba(240,74,37,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400 sm:w-auto"
            >
              <IconWhatsApp className="h-4 w-4" />
              Falar no WhatsApp
            </a>

            <a
              href={resolverHref(ctaFinal.primario.href)}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] border border-bone-50/25 px-8 py-4.5 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-bone-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-bone-50/60 hover:bg-white/[0.06] sm:w-auto"
            >
              {ctaFinal.primario.rotulo}
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <p
            className="reveal mt-8 text-[0.7rem] tracking-wide text-bone-500"
            style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
          >
            Ou ligue para{' '}
            <a
              href={contato.telefoneHref}
              className="inline-block py-1.5 text-bone-200 underline underline-offset-4 transition-colors hover:text-rise-400"
            >
              {contato.telefone.exibicao}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
