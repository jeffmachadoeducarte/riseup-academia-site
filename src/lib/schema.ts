import { site } from '@/config/site';

/**
 * Dados estruturados schema.org para SEO local.
 *
 * Usa `HealthAndBeautyBusiness > ExerciseGym`, que é o tipo correto para
 * academia e é o que o Google usa para o painel de conhecimento local.
 * Só entram campos que temos confirmados — nada de preço ou nota inventada.
 */
export function gymJsonLd() {
  const { marca, endereco, contato, horarios, redes, seo, provaSocial } = site;

  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['ExerciseGym', 'LocalBusiness'],
    '@id': `${seo.url}/#academia`,
    name: marca.nome,
    legalName: marca.razaoSocial,
    description: seo.descricao,
    url: seo.url,
    image: `${seo.url}${seo.ogImage}`,
    logo: `${seo.url}/icon.svg`,
    telephone: contato.telefone.e164,
    foundingDate: String(marca.fundacao),
    taxID: marca.cnpj,
    currenciesAccepted: 'BRL',
    address: {
      '@type': 'PostalAddress',
      streetAddress: endereco.logradouro,
      addressLocality: endereco.cidade,
      addressRegion: endereco.uf,
      postalCode: endereco.cep,
      addressCountry: endereco.pais,
    },
    areaServed: {
      '@type': 'City',
      name: endereco.cidade,
      containedInPlace: { '@type': 'State', name: 'Santa Catarina' },
    },
    openingHoursSpecification: horarios.schema.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    sameAs: [redes.instagram.url, redes.facebook.url],
    hasMap: endereco.mapaLink,
    // Cada frente de treino é declarada como serviço oferecido.
    makesOffer: site.treinos.itens.map((t) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: t.nome, description: t.texto },
    })),
  };

  // A nota agregada só entra se houver avaliação pública e o cliente mantiver.
  if (provaSocial.exibirNota) {
    dados.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: provaSocial.nota.valor.replace(',', '.'),
      reviewCount: provaSocial.nota.total,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return dados;
}

/** Breadcrumb simples — a Home é a única página indexável de conteúdo. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.seo.url}/#site`,
    url: site.seo.url,
    name: site.marca.nome,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${site.seo.url}/#academia` },
  };
}
