import { site } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { IconPin, IconPhone, IconWhatsApp, IconClock, IconArrow } from '@/components/ui/Icons';

const { localizacao, endereco, contato, horarios, marca } = site;

export function Localizacao() {
  return (
    <section id="localizacao" className="relative bg-ink-900 py-24 sm:py-32 lg:py-40">
      <Container size="wide">
        <SectionTitle
          indice={localizacao.indice}
          etiqueta={localizacao.etiqueta}
          titulo={localizacao.titulo}
        />

        <div className="mt-14 grid gap-3 lg:mt-18 lg:grid-cols-12">
          {/* ------------------------------------------------- dados */}
          <div className="reveal lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-10 rounded-[2px] border border-ink-700 bg-ink-850/50 p-7 sm:p-9">
              <div className="space-y-8">
                <Bloco icone={<IconPin className="h-4 w-4" />} rotulo="Endereço">
                  <address className="not-italic">
                    <span className="block text-[0.975rem] leading-relaxed text-bone-50">
                      {endereco.logradouro}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-bone-400">
                      {endereco.bairro} · {endereco.cidade}/{endereco.uf}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-bone-500">
                      CEP {endereco.cep}
                    </span>
                  </address>
                </Bloco>

                <Bloco icone={<IconClock className="h-4 w-4" />} rotulo="Horários">
                  <ul className="space-y-2">
                    {horarios.lista.map((h) => (
                      <li key={h.dias} className="flex items-baseline justify-between gap-4">
                        <span className="text-[0.875rem] text-bone-200">{h.dias}</span>
                        <span
                          className={
                            h.aberto
                              ? 'font-display text-[0.875rem] font-bold tracking-wide text-bone-50'
                              : 'text-[0.8125rem] text-bone-500'
                          }
                        >
                          {h.horas}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Bloco>

                <Bloco icone={<IconPhone className="h-4 w-4" />} rotulo="Contato">
                  <a
                    href={contato.telefoneHref}
                    className="-my-1 block py-1.5 text-[0.975rem] text-bone-50 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
                  >
                    {contato.telefone.exibicao}
                  </a>
                  <a
                    href={contato.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-1.5 text-[0.875rem] text-bone-400 underline-offset-4 transition-colors hover:text-rise-400 hover:underline"
                  >
                    <IconWhatsApp className="h-3.5 w-3.5" />
                    {contato.whatsapp.exibicao} · WhatsApp
                  </a>
                </Bloco>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={endereco.rotaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-1 items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-6 py-4 font-display text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rise-400"
                >
                  Como chegar
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href={contato.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-[2px] border border-ink-600 px-6 py-4 font-display text-[0.75rem] font-bold uppercase tracking-[0.14em] text-bone-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-bone-400"
                >
                  <IconWhatsApp className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------- mapa */}
          <div className="reveal lg:col-span-7">
            <div className="relative h-[22rem] overflow-hidden rounded-[2px] border border-ink-700 sm:h-[28rem] lg:h-full lg:min-h-[32rem]">
              <iframe
                src={endereco.mapaEmbed}
                title={`Mapa com a localização da ${marca.nome} em ${endereco.cidade}/${endereco.uf}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                /* O embed do Google Maps não tem tema escuro. A inversão com
                   rotação de matiz é o caminho padrão para escurecê-lo sem
                   trocar as cores das vias e da água por algo irreconhecível.
                   No hover o mapa volta ao normal, para leitura. */
                className="h-full w-full border-0 transition-[filter] duration-500 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.7)_contrast(0.92)] hover:[filter:none]"
              />
              {/* Fio da marca no topo do mapa, costurando com o resto da página. */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-rise-500" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Bloco({
  icone,
  rotulo,
  children,
}: {
  icone: React.ReactNode;
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rise-500">
        <span aria-hidden>{icone}</span>
        {rotulo}
      </p>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}
