# STATUS DO PROJETO — RISE UP

## Status geral

**EM ANDAMENTO** — site e área do aluno prontos e validados. Parado no
meio da configuração do EasyPanel.

## Última atualização

19/09/2026 — fim da sessão 2

## Etapa atual

Deploy no EasyPanel, interrompido.

### ▶ RETOMAR AQUI

O serviço `riseup-site` já existe no projeto `riseup` do EasyPanel.
Falta terminar a configuração.

**O bloqueio:** o EasyPanel está numa licença sem integração com o GitHub
(`/settings` não tem a opção; o painel mostra o aviso "You need a license
that supports Access Control"). Sem essa integração ele **não enxerga
repositório privado**. O repo foi tornado público para destravar e depois
voltou a **privado** — ou seja, o bloqueio continua de pé.

**Duas saídas:**

| Opção | O que fazer |
|---|---|
| A — repo público temporário | Tornar público em github.com/jeffmachadoeducarte/riseup-academia-site/settings → Danger Zone. No EasyPanel usar a aba **Git** (não Github) com `https://github.com/jeffmachadoeducarte/riseup-academia-site.git`. Atenção: o EasyPanel reclona a cada deploy, então precisa ficar público enquanto houver deploys. |
| B — licença paga | Habilita a integração GitHub e o repo pode seguir privado. |

**Configuração que falta no serviço** (nesta ordem):

1. **Fonte** → repo + ramo `main` + caminho `/`
2. **Build** → Dockerfile, path `Dockerfile`
3. **Ambiente** → variáveis abaixo
4. **Montagens** → Volume `riseup-dados` em `/app/dados` ← a aba chama
   "Montagens", não "Volumes"
5. **Domínios** → porta `3000`, HTTPS
6. **Implantar**

```env
NEXT_PUBLIC_SITE_URL=https://<url-gerada>.easypanel.host
NEXT_PUBLIC_MODO_PREVIA=true
NODE_ENV=production
DATABASE_URL=/app/dados/riseup.db
RISEUP_SEMEAR_DEMO=true
RISEUP_CHAVE_SEGREDOS=k9lE2OouUxJle5QdZZWMmT9lhtnOG3fDNsrkztuAk+ZYaJyEVOOxtlhx2U9CwZlN
```

> `NEXT_PUBLIC_SITE_URL` é lida no BUILD. Depois que o EasyPanel gerar a URL
> real, corrigir a variável e **implantar de novo**.

**Depois do deploy:** pedir a URL e rodar a bateria de testes contra ela
(rotas, login aluno/master, responsivo, performance, robots).

## Etapas concluídas

- [x] Análise do projeto
- [x] Pesquisa
- [x] Análise do vídeo
- [x] Análise dos assets
- [x] Direção visual
- [x] Design system
- [x] Hero
- [x] Sobre
- [x] Estrutura
- [x] Modalidades
- [x] Diferenciais
- [x] Vídeo
- [x] Prova social
- [x] Instagram
- [x] Localização
- [x] CTA
- [x] Footer
- [x] Responsividade
- [x] SEO
- [x] Performance
- [x] Segurança
- [x] Testes
- [x] Auditoria visual
- [x] Correções
- [x] Docker
- [ ] Deploy — **bloqueado**: sem acesso ao servidor e sem domínio definido

## Arquitetura de animação — scroll-driven storytelling

Implantado em 19/09/2026 (sessão 3).

### Biblioteca adicionada: nenhuma

GSAP + ScrollTrigger pesa ~70 KB só para o que aqui cabe em dois hooks e um
punhado de regras CSS. A narrativa inteira roda com `position: sticky`
(rolagem nativa), `IntersectionObserver` e uma variável CSS de progresso.
Dependências de produção seguem em 6.

### Como funciona

Cada seção longa recebe `--p` (0 → 1) conforme o scroll a percorre, escrito
por `useProgressoScroll`. Quem anima é o CSS, lendo `--p` em `transform` e
`opacity` — as duas propriedades que a GPU resolve sem recalcular layout.

O JavaScript não escuta evento de scroll. Um `IntersectionObserver` liga e
desliga um laço de `requestAnimationFrame` que só roda enquanto a seção está
na tela, e grava a variável no máximo uma vez por quadro, com duas casas
decimais.

> Decisão registrada: o Chrome já suporta `animation-timeline` nativo, o
> Safari e o Firefox não. Optamos por usar o mesmo laço em todos: manter duas
> mecânicas diferentes custa mais em manutenção e depuração do que os
> microssegundos economizados. (Essa escolha corrigiu um bug real — o hook
> desistia no Chrome esperando um caminho nativo que ainda não existia, e
> nada animava.)

### Ritmo da página

| Seção | Mecânica |
|---|---|
| Hero | Saída cinematográfica: texto sobe e some, vídeo ganha 12% de escala |
| Sobre | **Pausa editorial** — só reveals de entrada |
| Faixa da marca | Movimento contínuo, sem scroll |
| Estrutura | **Pinned**, 400svh, 4 cenas em tela cheia + grade completa depois |
| Treinos | Grade normal, reveals escalonados |
| Diferenciais | **Pausa** — lista com reveals |
| Experiência | **Pinned**, 260svh, moldura abre de 62vw para 92vw |
| Prova social | **Pausa** — faixa de avaliações, pausa no hover |
| Instagram | Grade com hover |
| Localização | Funcional, animação mínima |
| CTA final | Entrada em escala |

Seções pinned: **2**. O resto é scroll natural. A alternância é proposital —
tudo pinned viraria template de efeito.

### Comportamento do vídeo

- Toca quando entra na tela, pausa quando sai (`IntersectionObserver`, 40%
  de limiar). Vídeo rodando escondido gasta CPU e bateria à toa.
- **Áudio:** tenta tocar com som; se o navegador barrar — e todos barram sem
  gesto do usuário — cai para mudo e mostra um botão laranja "Ativar som". O
  clique é justamente o gesto que faltava. Não há tentativa de contornar a
  política de autoplay.
- A escolha de áudio do visitante é guardada e respeitada quando ele volta.
- O controle fica no topo direito do quadro: o botão flutuante do WhatsApp
  mora no canto inferior direito e os dois colidiam.

### Mobile

Os dois palcos são **desligados** abaixo de 768px. Prender a tela num
aparelho pequeno rende pouco e atrapalha muito. A Estrutura vira a grade
completa; a Experiência vira uma composição vertical com o mesmo vídeo e o
mesmo comportamento de áudio.

### Movimento reduzido

Com `prefers-reduced-motion: reduce`:
- os palcos somem (`display: none`) e as versões normais assumem — nenhuma
  imagem ou texto se perde;
- o título da Estrutura, normalmente escondido no desktop, reaparece;
- o vídeo não toca sozinho e ganha **controles nativos**, senão o visitante
  ficaria sem como dar play;
- a faixa de avaliações para.

Verificado: página cai de 15.615px para 9.908px, e as 12 imagens da Estrutura
continuam presentes nos dois modos.

### Performance medida

Rolando a página inteira em 1440×900: **61 FPS**, 1 tarefa longa (53 ms, o
início da decodificação do vídeo), **CLS 0**.

### Onde o scroll é interceptado

Em lugar nenhum. Não há scroll hijacking, nem substituição do comportamento
da roda ou do touch. Tudo é `position: sticky` — o visitante sobe, desce, usa
Page Up/Down, teclado e links normalmente.

---

## O que foi feito

Site institucional de página única em Next.js 16 + TypeScript + Tailwind v4,
construído a partir do reel real da academia.

O projeto estava vazio (só o arquivo `reels/instappa-reel-CyBhcVGgsqd.mp4`).
Foi montado do zero.

**Pesquisa** — CNPJ, endereço, telefone, horários, Instagram, Facebook e
avaliações públicas levantados e checados entre si. Divergências registradas.
O horário foi confirmado por **fonte primária**: a placa da fachada, legível no
primeiro frame do próprio vídeo (resolveu o conflito entre dois diretórios).

**Vídeo** — analisado quadro a quadro (44 frames). Do material saíram a paleta
da marca (amostragem de pixel do letreiro), 18 imagens do site e 4 versões
otimizadas de vídeo. O original está intacto em `assets/source/`.

**Design** — o reel é 9:16. Em vez de esticá-lo numa viewport horizontal, o
hero muda de composição por breakpoint: tela cheia no mobile, painel vertical
com máscara de degradê no desktop. A proporção nativa é preservada nos dois.

## O que está sendo feito agora

Nada em andamento.

## Próxima tarefa

**Deploy.** Assim que houver domínio + acesso ao EasyPanel:
1. Definir `NEXT_PUBLIC_SITE_URL` com o domínio real
2. Criar o App no EasyPanel apontando para o `Dockerfile`, porta 3000
3. Seguir `docs/deploy-easypanel.md`

Antes disso, confirmar com o cliente as 4 pendências bloqueantes de
`docs/pendencias-cliente.md` (WhatsApp, grafia da rua, domínio, domingo).

## Arquivos modificados

Nenhum. O projeto estava vazio; o reel original foi **copiado**, não movido —
`reels/instappa-reel-CyBhcVGgsqd.mp4` segue intacto.

## Arquivos criados

**Configuração** — `package.json`, `tsconfig.json`, `next.config.mjs`,
`postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.dockerignore`,
`.env.example`, `Dockerfile`, `docker-compose.yml`

**Pipeline** — `scripts/media.mjs`

**Conteúdo** — `src/config/site.ts`

**App** — `src/app/`: `layout.tsx`, `page.tsx`, `globals.css`, `not-found.tsx`,
`robots.ts`, `sitemap.ts`, `icon.svg`, `apple-icon.svg`,
`api/health/route.ts`, `politica-de-privacidade/page.tsx`, `termos-de-uso/page.tsx`

**Componentes** — `Header`, `Footer`, `FaixaMarca`, `BotaoWhatsApp`,
`Revelacoes`, `PaginaLegal`; `sections/`: `Hero`, `Sobre`, `Estrutura`,
`Treinos`, `Diferenciais`, `Experiencia`, `ProvaSocial`, `Instagram`,
`Localizacao`, `CtaFinal`; `ui/`: `Container`, `Button`, `SectionTitle`,
`Figura`, `Logo`, `Icons`

**Apoio** — `src/hooks/useReveal.ts`, `src/lib/cn.ts`, `src/lib/schema.ts`

**Mídia gerada** — `public/assets/video/` (4), `public/assets/posters/` (5),
`public/assets/images/` (72), `public/site.webmanifest`

**Docs** — `pesquisa-rise-up.md`, `pendencias-cliente.md`,
`deploy-easypanel.md`, `README-PROJETO.md`, `STATUS-PROJETO.md`

## Problemas encontrados

| Problema | Como foi resolvido |
|---|---|
| Next 15.1.6 com 3 vulnerabilidades (1 crítica) | Subido para Next 16.3.5 / React 19.3 → **0 vulnerabilidades** |
| CSP bloqueava `eval` do React em desenvolvimento | `script-src` relaxado só em dev; produção segue restrita |
| `next lint` não existe mais no Next 16 | Script trocado para `eslint` direto |
| `eslint-config-next` 16 é flat config nativo | Removido `FlatCompat`/`@eslint/eslintrc` |
| **Frames errados na galeria** — `-ss` antes de `-i` cai no keyframe anterior | `-ss` movido para depois de `-i` (seek exato) + contact sheets numerados para escolher os segundos |
| **`<picture>` sem altura** — `h-full` do `<img>` virava `auto`, a imagem saía no tamanho intrínseco e `object-fit` não valia; os cards cortavam o topo (teto escuro) | `h-full w-full` no `<picture>` |
| Recorte central pegava o teto em células largas | Ponto focal por imagem (`foco` → `object-position`) |
| Grid da galeria deixava buracos na última linha | Layout explícito 4×4 = 16 células para 8 itens |
| Títulos dos cards de treino desalinhados | `min-h` de 3 linhas no parágrafo |
| Mapa do Google branco sobre site escuro | Filtro de inversão + rotação de matiz; volta ao normal no hover |
| Botão flutuante cobria os links legais do rodapé | Some quando o rodapé entra na viewport |
| Poster do vídeo da Experiência baixava sempre (82 KB fora da dobra) | `poster` removido; capa virou `<img loading="lazy">` |
| Alvos de toque abaixo de 24px (telefone, links de fonte) | Padding vertical; todos ≥ 29px |
| Copy dizia "Dez anos" mas o cálculo dava 12 | Texto tornado atemporal ("desde 2014"); o número é calculado |
| Copy dizia "quarenta e cinco segundos", vídeo tem 44 | Corrigido |

## Decisões tomadas

1. **Next.js 16 + build `standalone`** — imagem Docker enxuta, SEO nativo,
   HTML pré-renderizado. 3 dependências de produção.
2. **Sem biblioteca de animação** — um IntersectionObserver de ~40 linhas cobre
   todas as revelações. Menos bundle, mesmo resultado.
3. **Sem `next/image`** — o pipeline já gera WebP/JPEG em 480w e 720w. Otimizar
   em runtime seria pagar CPU por algo pronto.
4. **Hero muda de forma, não de escala** — vídeo 9:16 esticado em 16:9 perderia
   ~70% do enquadramento. Mobile em tela cheia, desktop em painel mascarado.
5. **Vídeo sem `src` no HTML** — o arquivo é escolhido e carregado depois da
   hidratação, conforme tela, codec, `prefers-reduced-motion` e tipo de conexão.
   É o que mantém o LCP em 144 ms.
6. **Hero cortado em 22 s** — o reel inteiro (44 s) pesava 7 MB no hero. O corte
   cobre todos os ambientes em 2,7 MB. O reel completo ficou na Experiência,
   com `preload="none"`.
7. **Identidade derivada do letreiro** — laranja `#F04A25` amostrado por pixel
   do letreiro oficial; triângulo da marca virou elemento gráfico do site.
8. **Marca redesenhada em texto** — não existe logo vetorial disponível.
   Está isolada em um componente, troca fácil.
9. **Instagram sem API** — prévia com frames locais. Se o Instagram cair ou
   bloquear o embed, a seção não muda.
10. **Nada inventado** — sem preço, plano, professor, metragem ou depoimento
    fabricado. A única avaliação exibida é real, com autoria e link.
11. **Botão de pausa no hero** — exigência da WCAG 2.2.2 para movimento
    automático acima de 5 s.

## Pendências

**Bloqueiam a publicação** (detalhes em `docs/pendencias-cliente.md`):
1. Confirmar o WhatsApp — (47) 98812-1753 é provável, não confirmado
2. Confirmar a grafia da rua — fontes divergem
3. Definir o domínio
4. Confirmar que não abre aos domingos

**Melhoram o resultado:** logo vetorial, fotos profissionais, nomes reais das
aulas, grade de horários, equipe, avaliações do Google.

## Deploy

**Não concluído.** O código está publicado; a configuração do painel parou
no meio. Ver "RETOMAR AQUI" no topo.

Feito:
- Repositório criado e enviado:
  `github.com/jeffmachadoeducarte/riseup-academia-site` (privado, branch `main`)
- `Dockerfile` refeito para SQLite: Debian slim com
  `--build-from-source=better-sqlite3`, volume `/app/dados`, migração e
  semeadura no boot via `docker/entrada.sh`, usuário não-root, health check
- Projeto `riseup` e serviço `riseup-site` criados no EasyPanel
- `docs/deploy-easypanel.md` atualizado com volume, chave do cofre e semeadura

**Validado sem Docker** (não há Docker nesta máquina): montei o standalone à
mão e rodei o `entrada.sh`. Migração em banco zerado, semeadura idempotente,
site, `/api/health`, `robots.txt` em modo prévia, 404, login de aluno e de
master — tudo passou. O `drizzle-orm` não entra no build standalone (mesmo
caso do Educarte) e o Dockerfile já o copia explicitamente.

⚠️ **A imagem Docker em si nunca foi construída.** O Dockerfile espelha o do
Educarte, que funciona em produção, mas o primeiro build real pode revelar
algo — vale acompanhar o log.

**Validado localmente** (build de produção, não apenas `next build`):

```
rotas            /  /politica-de-privacidade  /termos-de-uso
                 /robots.txt  /sitemap.xml  /api/health   → 200
                 url inexistente → 404
LCP              144 ms
CLS              0
peso inicial     886 KB (antes do vídeo, que carrega depois da pintura)
erros de console nenhum
overflow lateral nenhum em 1440/1280/1024/768/430/390/375
imagens          nenhuma quebrada, nenhuma sem alt
npm audit        0 vulnerabilidades
typecheck/lint   limpos
```
