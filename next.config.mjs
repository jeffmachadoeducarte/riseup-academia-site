/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build independente para container enxuto (EasyPanel / Docker).
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  async headers() {
    const desenvolvimento = process.env.NODE_ENV !== 'production';

    // O React em modo de desenvolvimento usa eval() para reconstruir stack
    // traces. Em produção a política fica restrita, sem 'unsafe-eval'.
    const scriptSrc = desenvolvimento
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";

    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ...(desenvolvimento
        ? []
        : [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }]),
      {
        // O mapa é o único terceiro embutido; nenhum script externo é carregado.
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          scriptSrc,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "media-src 'self' blob:",
          "font-src 'self' data:",
          "frame-src https://www.google.com https://maps.google.com",
          "connect-src 'self'",
          "form-action 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          'frame-ancestors \'self\'',
          ...(desenvolvimento ? [] : ['upgrade-insecure-requests']),
        ].join('; '),
      },
    ];

    return [
      { source: '/:path*', headers: security },
      {
        // Os nomes dos arquivos de mídia são estáveis, então o cache longo só
        // é seguro porque cada URL carrega `?v=<hash do conteúdo>`, escrito
        // por scripts/media.mjs em src/config/midia.ts. Trocar uma foto muda
        // o hash, muda a URL, e o navegador busca a nova.
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
