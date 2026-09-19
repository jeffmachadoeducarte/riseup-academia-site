import Link from 'next/link';
import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { IconArrow } from '@/components/ui/Icons';

export function PaginaLegal({
  titulo,
  atualizacao,
  children,
}: {
  titulo: string;
  atualizacao: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink-800 py-5">
        <Container size="wide" className="flex items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.marca.nome} — voltar ao início`} className="text-lg">
            <Logo />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-bone-400 transition-colors hover:text-rise-400"
          >
            <IconArrow className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
            Voltar ao site
          </Link>
        </Container>
      </header>

      <main className="py-20 sm:py-28">
        <Container size="narrow">
          <p className="t-eyebrow text-rise-500">Documento legal</p>
          <h1 className="t-display mt-4 text-[clamp(2rem,6vw,3.5rem)] text-bone-50">{titulo}</h1>
          <p className="mt-4 text-[0.75rem] tracking-wide text-bone-500">
            Última atualização: {atualizacao}
          </p>

          <div className="mt-12 space-y-8 text-[0.95rem] leading-[1.8] text-bone-200 [&_a]:text-rise-400 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-bone-50 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
            {children}
          </div>

          <p className="mt-16 border-t border-ink-800 pt-8 text-[0.8125rem] leading-relaxed text-bone-500">
            Dúvidas sobre este documento? Fale com a {site.marca.nome} pelo telefone{' '}
            <a href={site.contato.telefoneHref} className="text-bone-200 hover:text-rise-400">
              {site.contato.telefone.exibicao}
            </a>{' '}
            ou presencialmente em {site.endereco.linha}.
          </p>
        </Container>
      </main>
    </>
  );
}
