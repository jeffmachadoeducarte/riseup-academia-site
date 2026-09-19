# Pendências — o que precisamos da Rise Up

> Lista do que **depende do cliente** para o site sair do ar de demonstração e
> ir para produção. Nada aqui foi inventado no site: onde faltou confirmação, a
> informação simplesmente não foi publicada.
>
> Atualizado em 19/09/2026.

---

## 🔴 Bloqueia a publicação

Precisam de resposta antes de apontar um domínio real.

### 1. WhatsApp comercial
- **Publicado hoje:** (47) 98812-1753
- **Origem:** listado como telefone da unidade no AcademiasBR — é um número
  móvel, mas **nenhuma fonte confirma que é o WhatsApp**.
- **Precisamos:** confirmar se é esse o número que recebe mensagens, ou informar
  o correto.
- **Onde muda:** `src/config/site.ts` → `WHATSAPP` (um único lugar).

### 2. Grafia da rua
- **Publicado hoje:** Rua Gracilides Coelho Reiser, 45
- **Problema:** as fontes divergem entre *Gracilides*, *Gracelides* e *Relser*.
- **Precisamos:** a grafia correta (vale olhar o contrato de locação, a conta de
  luz ou o alvará).
- **Onde muda:** `src/config/site.ts` → `ENDERECO.logradouro`.

### 3. Domínio
- **Placeholder:** `https://riseupacademia.com.br`
- **Precisamos:** o domínio definitivo. Ele entra em canonical, sitemap, robots
  e nas prévias de compartilhamento — se ficar errado, o SEO sai errado.
- **Onde muda:** variável `NEXT_PUBLIC_SITE_URL` no EasyPanel.

### 4. Horário de sábado — **conflito aberto**
- **Publicado hoje:** 9h às 15h
- **Origem:** a placa na fachada da academia, legível no primeiro frame do
  vídeo institucional, e confirmada pelo AcademiasBR.
- **Conflito:** o layout aprovado pelo cliente traz "Sábado 8h–12h e 14h–18h".
- **Precisamos:** confirmar qual vale. Se for o do layout, a placa está
  desatualizada e trocamos em `src/config/site.ts` → `horarios.lista`.

### 5. Domingo
- **Publicado hoje:** Fechado
- **Origem:** dois diretórios indicam fechado; a placa da fachada não cita
  domingo.
- **Precisamos:** confirmação de que não abre aos domingos.

---

## 🔴 Bloqueiam a área do aluno em produção

A área do aluno funciona hoje com dados de demonstração. Para abrir para
alunos de verdade, estes itens são obrigatórios.

### 5. Responsável técnico pelos treinos (CREF)
- **Situação:** os 4 treinos cadastrados são **modelos de demonstração**, sem
  prescrição individual. O app os exibe com aviso âmbar dizendo isso.
- **Precisamos:** um profissional de educação física que revise, ajuste e
  assine cada treino (nome + CREF). Assinado, o aviso some.
- **Por quê:** prescrição de exercício é ato profissional. Entregar treino sem
  responsável técnico expõe a academia e o aluno.

### 6. Responsável técnico pelas receitas (CRN)
- **Situação:** as 8 receitas são sugestões gerais, também marcadas como
  demonstração.
- **Precisamos:** nutricionista que revise e assine (nome + CRN), ou a decisão
  de remover a seção de alimentação.

### 7. Preços dos planos
- **Situação:** os 3 planos (Mensal, Trimestral, Anual) estão com **valor
  zerado** e o app mostra "a confirmar".
- **Precisamos:** os valores reais e as regras (matrícula, fidelidade,
  cancelamento).

### 8. Contas de teste
- **Situação:** `master@riseup.test` e `aluno@riseup.test` existem para a
  apresentação e ficam ativas enquanto `RISEUP_SEMEAR_DEMO=true`.
- **Antes de produção:** desligar a variável, apagar o volume e criar os
  acessos reais da direção.

---

## 🟡 Deixam o site melhor (não bloqueiam)

### 6. Logo em vetor
Hoje a marca é **redesenhada em texto + triângulo** (`src/components/ui/Logo.tsx`),
a partir do letreiro que aparece no vídeo. Funciona, mas não é a marca oficial.
- **Precisamos:** o arquivo original em `.svg`, `.ai`, `.eps` ou `.pdf`.
- **Ganho:** marca exata no header, no rodapé, no favicon e nas prévias de link.

### 6. Fotos profissionais
Todas as imagens do site são **frames extraídos do vídeo institucional**. Foi a
melhor escolha possível com o material disponível — são cenas reais da academia
— mas frame de vídeo a 720p tem menos nitidez que foto.
- **Precisamos:** fotos em alta resolução do salão, da área funcional, do
  cardio, da sala de aulas coletivas, da recepção e da fachada.
- **Ganho:** salto direto de qualidade percebida, principalmente na galeria.

### 7. Nomes das aulas
O vídeo mostra **o que acontece** na academia, mas não os nomes comerciais.
Publicamos descrições factuais ("Lutas — treino de golpes, aparação e sparring").
- **Precisamos:** os nomes reais das modalidades (é muay thai? boxe? jiu-jitsu?
  as coletivas têm nome próprio?).

### 8. Grade de horários das aulas
Não publicamos nenhuma grade — não há fonte. A seção de treinos está pronta para
receber uma.
- **Precisamos:** a grade semanal, se existir.

### 9. Equipe
Nenhum profissional é citado (nome, formação, CREF). Uma seção de equipe costuma
converter bem em academia.
- **Precisamos:** nomes, fotos e CREF de quem puder aparecer.

### 10. Credenciais do Strava
Para o aluno conectar corridas e pedaladas, a academia precisa criar um
aplicativo em <https://www.strava.com/settings/api>:
- **Authorization Callback Domain:** o domínio do site
- Devolve `Client ID` e `Client Secret`, que vão nas variáveis
  `STRAVA_CLIENT_ID` e `STRAVA_CLIENT_SECRET`

Sem isso, a tela do Strava explica que a integração não está configurada, em
vez de quebrar. Todo o resto (OAuth, tokens cifrados, renovação automática,
sincronização) já está pronto.

### 11. Notificações de lembrete de água
O aluno já programa meta, horários e intervalo dos lembretes, e isso fica
salvo. **O envio da notificação no celular ainda não está ligado** — depende
de gerar as chaves VAPID de Web Push e de um agendador. É a próxima etapa
natural do app.

### 12. Grade real de aulas
Os 7 horários cadastrados são **demonstração**. A tela avisa isso. Precisamos
da grade real: modalidade, dia, horário, professor e vagas.

### 13. Cadastro dos alunos
Hoje existe 1 aluno de demonstração. Para a academia usar de verdade, falta
decidir como os alunos entram no sistema: cadastro pela recepção, importação
de planilha, ou autocadastro com aprovação.

### 14. Avaliações do Google
O site usa hoje **uma** avaliação pública, do FitFit. A academia tem perfil no
Google Business, cujas avaliações não conseguimos ler automaticamente.
- **Precisamos:** as avaliações do Google (print ou copiar/colar) para ampliar a
  prova social.
- **Nota:** nota agregada exibida hoje é 5,0 com base em **5 avaliações** — base
  pequena. Dá para esconder em `provaSocial.exibirNota: false`.

---

## 🟢 Decisões comerciais — conscientemente fora do site

Não entraram por falta de informação confirmada, **não** por esquecimento.
Todos têm lugar pronto no código.

| Item | Situação |
|---|---|
| Preços e planos | Não publicados. Termos de Uso dizem expressamente que valores são confirmados na recepção. |
| Matrícula / fidelidade / cancelamento | Não publicados. |
| Convênio Sindemcoocred (10% nos planos) | Encontrado publicamente, **não publicado** — é informação de terceiro e pode estar vencida. Confirmar se quer divulgar. |
| Day use / diária / plano família | Sem informação. |
| Avaliação física, nutricionista | Sem informação. |
| Estacionamento, vestiário, armários | Não vistos no vídeo nem citados em fonte. Se existirem, viram diferenciais fortes. |
| Aula experimental gratuita | Sem informação — se existir, é o melhor CTA possível para o hero. |
| Pagamento pelo app | Não integrado. Hoje o app **mostra** o histórico; a baixa é registrada pela recepção. Integrar Pix/cartão é decisão comercial (gateway, taxas, contrato). |

---

## 📄 Textos que precisam de aprovação

Copy escrita para esta proposta, **não** ditada pela academia:

| Onde | Texto |
|---|---|
| Hero | "Suba o nível" |
| Sobre — título | "Fazendo Navegantes treinar desde 2014." |
| Sobre — corpo | Os dois parágrafos sobre o perfil dos alunos e os horários |
| CTA final | "Pronto para subir o nível?" |
| Rodapé | "Treine forte. Treine sempre." |
| Hero | "Mais que uma academia, um estilo de vida." |
| Hero | Palavras "Disciplina · Resultados · Evolução · Sempre" |
| Login | "Seu treino no seu bolso." |

⚠️ **Nenhuma dessas frases é slogan oficial da Rise Up.** Se a academia já tem
um slogan, ele substitui a frase do hero.

---

## Onde mexer

Praticamente tudo acima muda em **um arquivo só**:

```
src/config/site.ts
```

Textos, telefones, endereço, horários, modalidades, links e imagens estão
centralizados lá. Não é preciso mexer em componente nenhum.
