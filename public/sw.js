/**
 * Service worker do app do aluno — Rise Up Academia.
 *
 * REGRA DE PRIVACIDADE (a decisão mais importante deste arquivo):
 * nada autenticado é gravado em cache. Treino, pagamento, hidratação e dados
 * pessoais passam direto pela rede, sempre. Um celular emprestado ou um
 * segundo aluno no mesmo aparelho não pode encontrar a tela do anterior.
 *
 * O que fica em cache é só o que é público e imutável: ícones, fontes,
 * imagens do site e a tela de "sem conexão".
 */
const VERSAO = 'riseup-v1';
const ESTATICO = `${VERSAO}-estatico`;
// Fora de /app de propósito: a tela precisa abrir sem sessão e sem banco.
const SEM_CONEXAO = '/sem-conexao';

const PRE_CACHE = [
  SEM_CONEXAO,
  '/assets/icones/icone-192.png',
  '/assets/icones/icone-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(ESTATICO)
      .then((c) => c.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves.filter((c) => !c.startsWith(VERSAO)).map((c) => caches.delete(c)),
      ))
      .then(() => self.clients.claim()),
  );
});

/** Recursos públicos e versionados, seguros para cache longo. */
function ehEstatico(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/app.webmanifest'
  );
}

self.addEventListener('fetch', (evento) => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Estático: responde do cache e atualiza em segundo plano.
  if (ehEstatico(url)) {
    evento.respondWith(
      caches.match(req).then((emCache) => {
        const daRede = fetch(req).then((resp) => {
          if (resp.ok) {
            const copia = resp.clone();
            caches.open(ESTATICO).then((c) => c.put(req, copia));
          }
          return resp;
        }).catch(() => emCache);
        return emCache || daRede;
      }),
    );
    return;
  }

  // Navegação: SEMPRE rede. Sem internet, mostra a tela de sem conexão.
  // Nada de servir uma página de aluno guardada de outra sessão.
  if (req.mode === 'navigate') {
    evento.respondWith(
      fetch(req).catch(() => caches.match(SEM_CONEXAO).then(
        (r) => r || new Response('Sem conexão', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
      )),
    );
  }

  // Todo o resto (dados, ações) não é interceptado: vai direto para a rede.
});
