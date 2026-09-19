# Deploy no EasyPanel — Rise Up Academia

Guia completo para colocar o site no ar. Leva ~10 minutos.

---

## Resumo

| Item | Valor |
|---|---|
| Tipo de serviço | **App** |
| Origem | Repositório Git ou upload |
| Build | **Dockerfile** (na raiz do projeto) |
| Porta interna | **3000** |
| Health check | `GET /api/health` |
| Comando de start | `node server.js` (já definido no Dockerfile) |
| Usuário do contêiner | `nextjs` (não-root, uid 1001) |

O `Dockerfile` é multi-estágio: a imagem final tem só o runtime Node e o build
`standalone` do Next — sem toolchain, sem devDependencies, sem os binários de
ffmpeg.

---

## 1. Antes de subir

### Gere a mídia (uma vez, na sua máquina)

Os vídeos e imagens do site são gerados a partir do reel original. Eles ficam
versionados em `public/assets/` — o contêiner **não** roda ffmpeg.

```bash
npm install
npm run media
```

Confira que existe conteúdo em:

```
public/assets/video/     rise-up-hero.mp4, .webm, -mobile.mp4, rise-up-experiencia.mp4
public/assets/posters/   hero-poster-*.jpg/.webp
public/assets/images/    estrutura-*, modalidade-*, sobre-*, experiencia-*, marca-*
```

> ⚠️ `assets/source/rise-up-reel-original.mp4` (15 MB) é o original. Ele está no
> `.dockerignore` e **não** vai para a imagem — mas mantenha-o no repositório,
> porque é a fonte de tudo que o pipeline regenera.

### Valide localmente

```bash
npm run typecheck
npm run lint
npm run build
```

---

## 2. Criar o serviço no EasyPanel

1. **Project → Create Service → App**
2. Nome sugerido: `rise-up-site`
3. **Source**
   - **Git:** informe o repositório e o branch (`main`)
   - ou **Upload:** envie o projeto compactado
4. **Build**
   - Method: **Dockerfile**
   - Dockerfile path: `Dockerfile`
   - Build context: `/` (raiz)

---

## 3. Variáveis de ambiente

### Prévia (URL gerada pelo EasyPanel)

```env
NEXT_PUBLIC_SITE_URL=https://SUA-URL.easypanel.host
NEXT_PUBLIC_MODO_PREVIA=true
NODE_ENV=production
```

### Domínio definitivo

```env
NEXT_PUBLIC_SITE_URL=https://riseupacademia.com.br
NEXT_PUBLIC_MODO_PREVIA=false
NODE_ENV=production
```

> **`NEXT_PUBLIC_MODO_PREVIA=true` tira o site do índice dos buscadores** —
> `robots.txt` bloqueia tudo, o `<meta name="robots">` vai como `noindex,
> nofollow` e o sitemap sai vazio.
>
> Isso existe para a URL temporária não ser indexada e depois disputar
> conteúdo duplicado com o domínio oficial, justamente no SEO local que o
> site trabalha. **Troque para `false` só no deploy definitivo.**

As duas variáveis são lidas **durante o build**. `NEXT_PUBLIC_SITE_URL` (entra no HTML estático:
> canonical, sitemap, robots, Open Graph). Se você mudar o domínio depois,
> **refaça o deploy** — só reiniciar o contêiner não basta.
>
> Sem barra no final: `https://site.com.br`, não `https://site.com.br/`.

Se preferir passar o domínio como build arg, o `Dockerfile` também aceita
`NEXT_PUBLIC_SITE_URL` em **Build Args**.

---

## 4. Rede e domínio

1. **Deploy → Ports**: porta do contêiner **3000**
2. **Domains → Add Domain**
   - Informe o domínio (ex.: `riseupacademia.com.br`)
   - Ative **HTTPS** (o EasyPanel emite o certificado Let's Encrypt)
   - Ative o redirecionamento **www → apex** (ou o contrário, mas escolha um só
     e mantenha; canonical duplicado prejudica o SEO)
3. No seu provedor de DNS, aponte o registro **A** do domínio para o IP do
   servidor do EasyPanel. Propagação: de minutos a algumas horas.

---

## 5. Deploy

Clique em **Deploy**. O log deve terminar com algo como:

```
✓ Compiled successfully
✓ Generating static pages (8/8)
```

E o contêiner sobe com:

```
▲ Next.js 16.x
- Local: http://0.0.0.0:3000
```

---

## 6. Conferir depois do deploy

```bash
# saúde do contêiner
curl https://SEUDOMINIO.com.br/api/health
# → {"status":"ok","servico":"rise-up-academia", ...}

# SEO
curl https://SEUDOMINIO.com.br/robots.txt
curl https://SEUDOMINIO.com.br/sitemap.xml

# cabeçalhos de segurança
curl -I https://SEUDOMINIO.com.br | grep -i -E "content-security|strict-transport|x-frame"
```

No navegador, confirme:

- [ ] O vídeo do hero roda sozinho, mudo, em loop
- [ ] No celular, o vídeo ocupa a tela inteira
- [ ] O botão **Pausar** do hero funciona
- [ ] A galeria abre o lightbox e navega com as setas
- [ ] O vídeo da seção Experiência toca com som ao clicar em play
- [ ] O mapa carrega e o pino está na academia
- [ ] Os links de WhatsApp e telefone abrem os apps certos
- [ ] `/politica-de-privacidade` e `/termos-de-uso` abrem
- [ ] Uma URL inválida cai no 404 do site
- [ ] O canonical aponta para o domínio certo (veja o `<head>`)
- [ ] **Em prévia:** `curl https://SUA-URL/robots.txt` responde `Disallow: /`
- [ ] **No definitivo:** o mesmo comando responde `Allow: /` e aponta o sitemap

---

## 7. Atualizações

### Mudar texto, telefone, horário, modalidade
Edite **`src/config/site.ts`**, faça commit e push. Com deploy automático
ligado, o EasyPanel reconstrói sozinho.

### Trocar o vídeo
1. Substitua `assets/source/rise-up-reel-original.mp4`
2. Ajuste os segundos dos frames em `scripts/media.mjs` (`FRAMES` e `HERO_CUT`)
3. `npm run media -- --force`
4. Commit dos arquivos gerados em `public/assets/` + push

---

## 8. Quando algo dá errado

| Sintoma | Causa provável | Solução |
|---|---|---|
| Build falha em `npm ci` | `package-lock.json` fora de sincronia | Rode `npm install` local e commite o lock |
| Site no ar, sem CSS | Deploy parcial / cache velho | Rebuild sem cache no EasyPanel |
| Vídeo não aparece | `public/assets/video/` vazio no repositório | Rode `npm run media` e commite |
| Canonical com domínio errado | `NEXT_PUBLIC_SITE_URL` mudou sem rebuild | Refaça o deploy (a variável é lida no build) |
| Site oficial não entra no Google | `NEXT_PUBLIC_MODO_PREVIA` ainda em `true` | Troque para `false` e **refaça o deploy** |
| Mapa não carrega | CSP bloqueando o frame | `frame-src` em `next.config.mjs` precisa de `https://www.google.com` |
| Health check falhando | Porta divergente | Porta do contêiner tem de ser 3000 |
| 502 logo após o deploy | Contêiner ainda subindo | O health check tem `start-period` de 20s; aguarde |

---

## 9. Segurança já configurada

Aplicado em `next.config.mjs`, sem precisar de nada no EasyPanel:

- `Content-Security-Policy` restritiva — nenhum script de terceiro é permitido;
  só o iframe do Google Maps
- `Strict-Transport-Security` com preload (somente em produção)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` bloqueando câmera, microfone e geolocalização
- `X-Powered-By` removido
- Contêiner roda como usuário sem privilégio

**Não há** banco de dados, formulário, autenticação, chave de API ou segredo no
projeto. O site é inteiramente estático servido pelo Node.
