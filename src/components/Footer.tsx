import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { IconInstagram, IconFacebook, IconWhatsApp } from '@/components/ui/Icons';

const { marca, endereco, contato, redes, navegacao, horarios, footer } = site;
const ano = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative border-t border-ink-700 bg-ink-950">
      <Container size="wide">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------- marca */}
          <div className="lg:col-span-4">
            <a
              href="#inicio"
              aria-label={`${marca.nome} — voltar ao início`}
              className="-my-2 inline-flex items-center py-2 text-xl"
            >
              <Logo />
            </a>

            <p className="mt-5 max-w-xs text-[0.875rem] leading-relaxed text-bone-400">
              {footer.assinatura}
            </p>

            <ul className="mt-7 flex items-center gap-2.5">
              <Social href={redes.instagram.url} rotulo={`Instagram da ${marca.nome}`}>
                <IconInstagram className="h-4 w-4" />
              </Social>
              <Social href={redes.facebook.url} rotulo={`Facebook da ${marca.nome}`}>
                <IconFacebook className="h-4 w-4" />
              </Social>
              <Social href={contato.whatsappHref} rotulo={`WhatsApp da ${marca.nome}`}>
                <IconWhatsApp className="h-4 w-4" />
              </Social>
            </ul>
          </div>

          {/* --------------------------------------------- navegação */}
          <nav aria-label="Navegação do rodapé" className="lg:col-span-3">
            <h2 className="t-eyebrow text-bone-500">Navegação</h2>
            <ul className="mt-5 space-y-3">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="-my-1 block py-1 text-[0.875rem] text-bone-200 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ----------------------------------------------- contato */}
          <div className="lg:col-span-3">
            <h2 className="t-eyebrow text-bone-500">Contato</h2>
            <address className="mt-5 space-y-3 not-italic">
              <p className="text-[0.875rem] leading-relaxed text-bone-200">
                {endereco.logradouro}
                <br />
                {endereco.bairro} · {endereco.cidade}/{endereco.uf}
                <br />
                CEP {endereco.cep}
              </p>
              <a
                href={contato.telefoneHref}
                className="-my-1 block py-1.5 text-[0.875rem] text-bone-200 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
              >
                {contato.telefone.exibicao}
              </a>
              <a
                href={contato.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-1 block py-1.5 text-[0.875rem] text-bone-200 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
              >
                {contato.whatsapp.exibicao}
              </a>
            </address>
            <a
              href={endereco.mapaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-rise-500 underline-offset-4 hover:underline"
            >
              Ver no mapa
            </a>
          </div>

          {/* ---------------------------------------------- horários */}
          <div className="lg:col-span-2">
            <h2 className="t-eyebrow text-bone-500">Horários</h2>
            <ul className="mt-5 space-y-3">
              {horarios.lista.map((h) => (
                <li key={h.dias} className="text-[0.875rem] leading-tight">
                  <span className="block text-bone-400">{h.dias}</span>
                  <span className={h.aberto ? 'text-bone-50' : 'text-bone-500'}>{h.horas}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------- rodapé */}
        <div className="flex flex-col gap-5 border-t border-ink-800 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-bone-500">
            © {ano} {marca.razaoSocial} · CNPJ {marca.cnpj}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footer.legal.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="-my-1 block py-1.5 text-[0.75rem] text-bone-500 underline-offset-4 transition-colors hover:text-bone-200 hover:underline"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function Social({
  href,
  rotulo,
  children,
}: {
  href: string;
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={rotulo}
        className="grid h-10 w-10 place-items-center rounded-[2px] border border-ink-700 text-bone-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-rise-500 hover:bg-rise-500 hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}
