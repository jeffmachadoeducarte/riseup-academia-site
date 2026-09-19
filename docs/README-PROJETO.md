# Rise Up Academia — site institucional

Site de página única para a **Rise Up Academia**, em Navegantes/SC.
Construído em cima do material real da academia: todo o conteúdo visual vem do
vídeo institucional que o cliente forneceu.

---

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Pré-renderização estática, metadados de SEO nativos e build `standalone` para container enxuto |
| Linguagem | **TypeScript** (strict) | Conteúdo tipado — errar o nome de um campo quebra o build, não a página |
| Estilo | **Tailwind CSS v4** | Design tokens em CSS, sem arquivo de config JS |
| Animação | **IntersectionObserver próprio** | Nenhuma biblioteca de animação: ~40 linhas resolvem tudo que o site usa |
| Ícones | **SVG inline** | Sem pacote de ícones no bundle |
| Mídia | **ffmpeg** (só em build) | Não entra na imagem de produção |

**Dependências de produção: 3** — `next`, `react`, `react-dom`.
Auditoria de segurança: **0 vulnerabilidades**.

---

## Começando

```bash
npm install
npm run media     # gera vídeos e imagens a partir do reel original
npm run dev       # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run media` | Regenera toda a mídia (`-- --force` sobrescreve) |
| `npm run check` | typecheck + lint + build |

---

## Estrutura

```
assets/source/          reel original — NUNCA é alterado
scripts/media.mjs       pipeline de mídia (ffmpeg)
public/assets/          mídia gerada e versionada
  ├── video/            hero (mp4/webm/mobile) + reel completo
  ├── posters/          poster do hero + LQIP
  └── images/           frames da galeria e das modalidades
src/
  ├── config/site.ts    ⭐ TODO o conteúdo do site
  ├── app/              rotas, layout, SEO, páginas legais
  ├── components/
  │   ├── sections/     uma seção da home por arquivo
  │   └── ui/           Container, Button, Figura, Logo, Icons, SectionTitle
  ├── hooks/            useReveal
  └── lib/              cn, schema.org
docs/                   pesquisa, pendências, deploy, status
```

---

## Como alterar o conteúdo

**Tudo está em `src/config/site.ts`.** Textos, telefone, WhatsApp, endereço,
horários, modalidades, imagens, links e CTAs. Nenhum componente tem texto
escrito dentro dele.

```ts
// exemplo: trocar o WhatsApp
const WHATSAPP = { exibicao: '(47) 99999-9999', e164: '5547999999999' };
```

O arquivo marca cada dado com o grau de confiança:
`✅` confirmado por fonte pública · `⚠️` precisa de confirmação.

---

## O vídeo

O material original é um **reel vertical de 9:16** (720×1280, 44,5 s, 15 MB).
Isso definiu o design.

### Por que o hero não é vídeo em tela cheia no desktop

Esticar um vídeo 9:16 numa viewport 16:9 significa ampliar 2× e cortar ~70% da
altura — imagem borrada e enquadramento destruído. Em vez disso:

- **Mobile** → vídeo em tela cheia (a proporção do aparelho bate com a do vídeo)
- **Desktop** → painel vertical à direita, com máscara de degradê na borda
  esquerda, para o vídeo se dissolver no preto onde fica o texto

O vídeo mantém a proporção nativa nos dois casos.

### Carregamento

| Arquivo | Tamanho | Quando carrega |
|---|---|---|
| `hero-poster-720.jpg` | 46 KB | `preload` — é o elemento de LCP |
| `rise-up-hero.webm` | 2,6 MB | depois da hidratação, só no desktop |
| `rise-up-hero.mp4` | 2,7 MB | alternativa para quem não tem VP9 |
| `rise-up-hero-mobile.mp4` | 1,6 MB | só no mobile |
| `rise-up-experiencia.mp4` | 7,1 MB | `preload="none"` — só ao clicar em play |

O `<video>` sobe **sem `src`**. Um efeito no cliente escolhe o arquivo conforme
largura de tela e suporte a codec — e **não carrega nada** se o visitante pediu
movimento reduzido ou estiver em conexão 2G / modo de economia de dados.

Resultado medido (build de produção, desktop):
**LCP 144 ms · CLS 0 · 886 KB antes do vídeo.**

---

## Acessibilidade

- HTML semântico, um `<h1>` só, hierarquia de headings sem saltos
- Link "pular para o conteúdo"
- Menu mobile com trap de foco, fechamento por `Esc` e foco devolvido ao botão
- Lightbox em `<dialog>` nativo, navegável pelas setas
- **Botão de pausa no vídeo do hero** (WCAG 2.2.2 — movimento acima de 5 s)
- `prefers-reduced-motion` desliga animações, marquee e o autoplay do hero
- Foco visível em todos os elementos interativos
- Texto sobre vídeo com overlay calibrado para contraste AA

---

## SEO

- Metadados via API do Next (title, description, canonical, robots)
- Open Graph e Twitter Card
- `robots.txt` e `sitemap.xml` gerados a partir do config
- **JSON-LD** `ExerciseGym` + `LocalBusiness` com endereço, horários, telefone,
  CNPJ, redes sociais e as modalidades como `makesOffer`
- SEO local mirando "academia em Navegantes", "academia Navegantes SC"

---

## Regra de conteúdo

Nada foi inventado. Preço, plano, professor, número de aluno, metragem,
depoimento e slogan **não aparecem** porque não há fonte confirmada.

- Horários vieram da **placa da fachada**, visível no próprio vídeo
- Ano de fundação veio do **registro público da empresa**
- A única avaliação exibida é **real**, com autoria e link para a fonte
- Toda modalidade listada é **visível no vídeo**, com o segundo anotado em
  `docs/pesquisa-rise-up.md`

O que ficou em aberto está em [`pendencias-cliente.md`](./pendencias-cliente.md).

---

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [`pesquisa-rise-up.md`](./pesquisa-rise-up.md) | Tudo que foi levantado, com fontes e nível de confiança |
| [`pendencias-cliente.md`](./pendencias-cliente.md) | O que depende do cliente |
| [`deploy-easypanel.md`](./deploy-easypanel.md) | Publicação passo a passo |
| [`STATUS-PROJETO.md`](./STATUS-PROJETO.md) | Estado atual e próximos passos |
