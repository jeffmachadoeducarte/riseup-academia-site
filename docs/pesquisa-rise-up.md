# Pesquisa — Rise Up Academia (Navegantes/SC)

> Levantamento de informações **públicas** realizado em **19/09/2026**.
> Regra aplicada: nada que não esteja confirmado por fonte pública ou pelo
> material fornecido pelo cliente entrou no site como afirmação. O que ficou
> em aberto está em [`pendencias-cliente.md`](./pendencias-cliente.md).

---

## 1. Identificação

| Dado | Valor | Confiança | Fonte |
|---|---|---|---|
| Nome fantasia | Rise Up Academia | ✅ Confirmado | Fachada no vídeo + Instagram + Facebook |
| Razão social | ACADEMIA RISE UP LTDA | ✅ Confirmado | Registro CNPJ |
| CNPJ | 20.414.331/0001-85 | ✅ Confirmado | Econodata / cnpj.biz / Casa dos Dados |
| Abertura | 05/06/2014 | ✅ Confirmado | Registro CNPJ |
| Atividade principal | Condicionamento físico | ✅ Confirmado | CNAE no registro |
| Cidade | Navegantes — Santa Catarina | ✅ Confirmado | Todas as fontes |

**"Desde 2014"** está confirmado pela data de abertura no registro público da
empresa (05/06/2014), e é coerente com a informação pública que o cliente
já havia indicado. Pode ser usado no site.

---

## 2. Endereço

```
Rua Gracilides Coelho Reiser, 45
São Domingos — Navegantes/SC
CEP 88370-552
```

✅ **Confirmado.** Aparece de forma consistente em Foursquare, Waze,
AcademiasBR, FitFit, Diário Cidade e Sindemcoocred.

⚠️ **Divergência de grafia entre fontes** — o nome da rua aparece como
"Gracilides", "Gracelides" e (no Waze) "Gracilides Coelho Relser".
A grafia adotada no site é **Gracilides Coelho Reiser**, que é a forma
majoritária e a usada pelos Correios para o CEP 88370-552.
→ Confirmar com o cliente antes da publicação.

---

## 3. Contatos

| Canal | Número | Confiança | Observação |
|---|---|---|---|
| Telefone fixo | (47) 3342-4583 | ✅ Confirmado | Foursquare, FitFit, Sindemcoocred, Diário Cidade |
| Celular / WhatsApp | (47) 98812-1753 | ⚠️ Provável | Listado como telefone da unidade no AcademiasBR. É um número móvel (9 dígitos), portanto quase certamente o WhatsApp — **mas nenhuma fonte o rotula explicitamente como WhatsApp**. |
| Instagram | [@academiariseup](https://www.instagram.com/academiariseup/) | ✅ Confirmado | Perfil público "ACADEMIA RISE UP · Navegantes, SC" |
| Facebook | [/academiariseupnavegantes](https://www.facebook.com/academiariseupnavegantes/) | ✅ Confirmado | Página "Rise Up Academia \| Navegantes SC" |
| Site oficial | — | ❌ Não existe | Nenhum domínio próprio encontrado. É exatamente a lacuna que este projeto preenche. |

→ O WhatsApp está marcado como **pendência de confirmação** e isolado em
`src/config/site.ts` para troca em um único ponto.

---

## 4. Horário de funcionamento — ✅ CONFIRMADO POR FONTE PRIMÁRIA

Durante a análise quadro a quadro do reel fornecido pelo cliente, o **primeiro
frame (t = 0,2 s)** mostra a fachada da academia com a placa oficial de
horários legível:

```
HORÁRIO DE FUNCIONAMENTO
Segunda a Sexta — 6h às 23h
Sábado — 9h às 15h
```

Essa é a fonte mais forte possível: a sinalização da própria academia.

**Conflito resolvido:** AcademiasBR informava Sáb 9h–15h e FitFit informava
Sáb 10h–14h. A placa da fachada confirma **9h às 15h** — FitFit está
desatualizado e foi descartado.

**Domingo:** AcademiasBR e FitFit indicam fechado; a placa da fachada não
menciona domingo, o que é coerente com fechado. Publicado como "Domingo —
Fechado", mas vale uma confirmação rápida com o cliente.

---

## 5. Modalidades e estrutura — observadas no material oficial

Nenhuma modalidade foi inventada. Todas as listadas no site foram
**observadas diretamente no reel oficial da academia** (material do próprio
cliente), com o segundo exato registrado:

| Modalidade / ambiente | Evidência no reel | Segundos |
|---|---|---|
| Musculação — máquinas e peso livre | Desenvolvimento, supino, puxada alta, agachamento no rack, halteres, anilhas | 0–8, 32–38 |
| Acompanhamento profissional | Instrutor(a) orientando execução e alongamento assistido | 4–8 |
| Cardio | Esteiras, escada, bike sob iluminação de LED | 10–12 |
| Funcional / Cross | Área com grama sintética, corda naval, assault bike | 14–16 |
| Lutas | Luvas de boxe, aparação de golpes, sparring | 18–24 |
| Aulas coletivas | Sala espelhada com barras, colchonetes e bolas suíças | 26–30 |

**⚠️ Limite importante:** o vídeo comprova que essas atividades **acontecem**
na academia. Ele **não** comprova os nomes comerciais das aulas, a grade de
horários, nem se são inclusas no plano. Por isso o site descreve os ambientes
e práticas de forma factual (ex.: "Lutas — boxe e muay thai") e a nomenclatura
exata entrou em pendências.

---

## 6. Identidade visual — extraída do material oficial

A logomarca aparece em alta definição na fachada (t ≈ 0,2 s) e na parede
interna (t ≈ 43 s):

- Marca: **▲ RISE** em laranja-vermelho + **UP** em branco off-white,
  com "ACADEMIA" na vertical, em laranja, à esquerda do "U".
- Símbolo: **triângulo/seta apontando para cima** — usado no site como
  elemento gráfico recorrente (bullets, divisores, ícone do favicon).
- Tipografia da marca: sans-serif itálico, pesado, levemente condensado.

**Cores amostradas por pixel** a partir dos frames do logo:

| Token | Hex | Origem |
|---|---|---|
| Laranja da marca | `#F04A25` | Média dos pixels mais saturados do letreiro (amostras entre `#E34227` e `#F94B2C`) |
| Off-white | `#F6F2EF` | Letras "UP" do letreiro |
| Preto do painel | `#0B0B0D` | Fundo do letreiro |

Acentos de **azul/violeta neon** e **verde** aparecem na iluminação dos
ambientes de cardio e funcional — usados no site apenas como brilho ambiente
sutil, nunca como cor de interface.

→ Não há manual de marca público. O design system criado documenta essas
decisões em `src/app/globals.css` e deve ser validado com o cliente.

---

## 7. Prova social

| Fonte | Nota | Volume |
|---|---|---|
| FitFit | 5,0 / 5 | 5 avaliações |
| AcademiasBR | sem avaliações | 0 |

Avaliação pública citada no site (única encontrada com texto):

> "Experiência fantástica: Atendimento impecável. Aparelhos de última geração.
> Local com várias modalidades."
> — Rosineide Aparecida, avaliação pública no FitFit

**Regra aplicada:** nenhum depoimento foi criado, reescrito ou atribuído a
pessoa diferente. O texto está reproduzido preservando o sentido, com autoria
e fonte visíveis no próprio site.

⚠️ 5 avaliações é uma base pequena. A nota agregada **não** é exibida como
selo de destaque — está apresentada como informação pública, com fonte, e é
desligável em `src/config/site.ts` (`provaSocial.exibirNota`).

❌ **Não foi possível acessar as avaliações do Google Maps** (exigem
JavaScript / API com chave). O cliente tem acesso direto ao próprio perfil
do Google Business e pode fornecê-las.

---

## 8. Convênio encontrado

O Sindemcoocred lista a Rise Up como conveniada com **10% de desconto sobre
os planos**. Não foi publicado no site — é informação de terceiro, pode estar
desatualizada e envolve condição comercial. Registrado em pendências.

---

## 9. O que NÃO foi encontrado (e por isso não está no site)

- Preços, planos, matrícula, fidelidade
- Nomes, formação e CREF dos professores
- Número de alunos, metragem, quantidade de equipamentos
- Grade horária das aulas coletivas
- Estacionamento, vestiário, armários, avaliação física
- Slogan oficial
- História da academia além do ano de fundação
- Prêmios, certificações ou parcerias

Nada disso foi presumido. Todos os itens estão em
[`pendencias-cliente.md`](./pendencias-cliente.md).

---

## 10. Fontes consultadas

- [Instagram — @academiariseup](https://www.instagram.com/academiariseup/)
- [Facebook — Rise Up Academia Navegantes](https://www.facebook.com/academiariseupnavegantes/)
- [Foursquare](https://pt.foursquare.com/v/rise-up-academia/53f4a61c498eff39724b6503)
- [AcademiasBR](https://academiasbr.com.br/listing/rise-up-academia/)
- [FitFit](https://br.fitfit.fitness/pt/i/8765-rise-up-academia/)
- [Econodata — CNPJ 20.414.331/0001-85](https://www.econodata.com.br/consulta-empresa/20414331000185-academia-rise-up-ltda)
- [cnpj.biz](https://cnpj.biz/20414331000185)
- [Sindemcoocred — convênios](https://sindemcoocred.com.br/convenios/rise-up-academia/)
- [Diário Cidade](https://www.diariocidade.com/sc/navegantes/guia/academia-rise-up-ltda-20414331000185/)
- [Waze — rota](https://www.waze.com/live-map/directions/rise-up-academia-r.-gracilides-coelho-relser-45-navegantes)
- **Fonte primária:** reel oficial fornecido pelo cliente
  (`assets/source/rise-up-reel-original.mp4`), analisado quadro a quadro.

> O Reel de referência <https://www.instagram.com/reels/CyBhcVGgsqd/> **não foi
> baixado**. Todo o material audiovisual do site vem exclusivamente do arquivo
> local entregue pelo cliente.
