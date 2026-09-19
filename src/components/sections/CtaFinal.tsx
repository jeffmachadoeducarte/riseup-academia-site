import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Triangulo } from '@/components/ui/Logo';

const { ctaFinal } = site;

/**
 * Fecho da página: só a manchete.
 *
 * Os botões saíram por decisão do cliente — WhatsApp e "quero conhecer" já
 * aparecem no hero, no header e no botão flutuante, que segue visível aqui.
 * Sem a repetição, a página termina num respiro, não num amontoado de CTAs.
 */
export function CtaFinal() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-32 sm:py-40 lg:py-48">
      {/* luz quente da marca subindo do rodapé da seção */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_75%_at_50%_115%,rgba(240,74,37,0.24),transparent_70%)]"
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <div aria-hidden className="rule absolute inset-x-0 top-0 h-px" />

      <Container size="wide">
        <div className="mx-auto max-w-4xl text-center">
          <Triangulo className="reveal mx-auto h-5 w-5 text-rise-500" />

          <h2 className="reveal-scale t-display mt-8 text-[clamp(2.5rem,8.5vw,6rem)] text-bone-50">
            <span className="block">{ctaFinal.titulo[0]}</span>
            <span className="block text-rise-500">{ctaFinal.titulo[1]}</span>
          </h2>
        </div>
      </Container>
    </section>
  );
}
