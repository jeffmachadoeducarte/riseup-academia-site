import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import { site } from '@/config/site';
import { gymJsonLd, siteJsonLd } from '@/lib/schema';
import { versionado } from '@/config/midia';
import './globals.css';

/* Display pesado e levemente condensado, no espírito do letreiro da marca. */
const archivo = Archivo({
  subsets: ['latin'],
  // Só os pesos usados pelo design system: 700 (botões, rótulos) e 800 (display).
  weight: ['700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
});

/* Texto corrido — alta legibilidade em fundo escuro. */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: {
    default: site.seo.titulo,
    template: site.seo.tituloTemplate,
  },
  description: site.seo.descricao,
  keywords: [...site.seo.palavrasChave],
  applicationName: site.marca.nome,
  authors: [{ name: site.marca.nome }],
  creator: site.marca.nome,
  alternates: { canonical: '/' },
  // Em modo prévia o site sai do índice por inteiro. Ver site.previa.
  robots: site.previa
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
      },
  openGraph: {
    type: 'website',
    locale: site.seo.locale,
    url: site.seo.url,
    siteName: site.marca.nome,
    title: site.seo.titulo,
    description: site.seo.descricao,
    images: [
      {
        url: versionado(site.seo.ogImage),
        width: 720,
        height: 1280,
        alt: `Fachada da ${site.marca.nome}, em ${site.marca.cidade}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.titulo,
    description: site.seo.descricao,
    images: [versionado(site.seo.ogImage)],
  },
  category: 'fitness',
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#070709',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      // O Next 16 avisa sobre scroll-behavior:smooth em transições de rota;
      // este atributo confirma que o efeito é intencional.
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${inter.variable}`}
    >
      <head>
        {/* O hero é o LCP: o poster precisa chegar antes de qualquer outra imagem. */}
        <link
          rel="preload"
          as="image"
          href={versionado(site.hero.video.poster)}
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          // Conteúdo estático gerado no servidor a partir de src/config/site.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify([gymJsonLd(), siteJsonLd()]) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#conteudo"
          className="sr-only rounded-[2px] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-rise-500 focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
