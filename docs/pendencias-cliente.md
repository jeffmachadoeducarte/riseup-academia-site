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

### 4. Domingo
- **Publicado hoje:** Fechado
- **Origem:** dois diretórios indicam fechado; a placa da fachada não cita
  domingo.
- **Precisamos:** confirmação de que não abre aos domingos.

---

## 🟡 Deixam o site melhor (não bloqueiam)

### 5. Logo em vetor
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

### 10. Avaliações do Google
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
