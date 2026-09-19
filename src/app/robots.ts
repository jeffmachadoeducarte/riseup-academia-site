import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  // Prévia: bloqueia tudo e não anuncia sitemap, para a URL temporária não
  // ser indexada e concorrer depois com o domínio oficial.
  if (site.previa) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.seo.url}/sitemap.xml`,
    host: site.seo.url,
  };
}
