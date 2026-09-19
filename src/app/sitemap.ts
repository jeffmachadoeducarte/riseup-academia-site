import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  // Sem sitemap enquanto for prévia — nada aqui deve ser indexado.
  if (site.previa) return [];

  const agora = new Date();
  return [
    { url: site.seo.url, lastModified: agora, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.seo.url}/politica-de-privacidade`, lastModified: agora, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.seo.url}/termos-de-uso`, lastModified: agora, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
