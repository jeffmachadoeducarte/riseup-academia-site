# STATUS DO PROJETO — RISE UP

## Status geral

**CONCLUÍDO** — primeira versão completa, pronta para apresentação comercial.
Falta apenas o deploy, que depende de acesso ao servidor e do domínio.

## Última atualização

19/09/2026

## Etapa atual

Projeto entregue. Próximo movimento é do cliente: confirmar as pendências
bloqueantes e liberar domínio + acesso ao EasyPanel.

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

**Não realizado.** Não houve acesso a servidor, repositório remoto ou
credenciais do EasyPanel nesta sessão — e o domínio ainda não existe.

Tudo o que depende de código está pronto:
- `Dockerfile` multi-estágio, usuário não-root, health check
- `docker-compose.yml`
- Build de produção validado e rodando localmente
- `docs/deploy-easypanel.md` com o passo a passo

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
