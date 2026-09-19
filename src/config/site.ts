/**
 * ════════════════════════════════════════════════════════════════════════
 *  RISE UP ACADEMIA — FONTE ÚNICA DE CONTEÚDO
 * ════════════════════════════════════════════════════════════════════════
 *
 *  Todo texto, contato, link e mídia do site vive NESTE arquivo.
 *  Para alterar o site, edite aqui — nunca dentro dos componentes.
 *
 *  Legenda de confiança usada nos comentários:
 *    ✅ confirmado por fonte pública ou pelo material do cliente
 *    ⚠️ provável, precisa de confirmação  → docs/pendencias-cliente.md
 *
 *  Pesquisa e fontes: docs/pesquisa-rise-up.md
 * ════════════════════════════════════════════════════════════════════════
 */

/* ───────────────────────────────── contato ──────────────────────────── */

/** Telefone fixo. ✅ Confirmado (Foursquare, FitFit, Sindemcoocred). */
const TELEFONE = { exibicao: '(47) 3342-4583', e164: '+554733424583' };

/** ⚠️ Número móvel da unidade. Confirmar se é o WhatsApp comercial. */
const WHATSAPP = { exibicao: '(47) 98812-1753', e164: '5547988121753' };

/** Mensagem que já vem escrita ao abrir a conversa no WhatsApp. */
const WHATSAPP_MENSAGEM =
  'Olá! Vim pelo site da Rise Up e gostaria de saber mais sobre os planos.';

/* ──────────────────────────────── endereço ─────────────────────────── */

const ENDERECO = {
  logradouro: 'Rua Gracilides Coelho Reiser, 45',
  bairro: 'São Domingos',
  cidade: 'Navegantes',
  uf: 'SC',
  cep: '88370-552',
  pais: 'BR',
} as const;

const ENDERECO_LINHA = `${ENDERECO.logradouro} — ${ENDERECO.bairro}, ${ENDERECO.cidade}/${ENDERECO.uf}`;
const BUSCA_MAPA = encodeURIComponent(
  `Rise Up Academia, ${ENDERECO.logradouro}, ${ENDERECO.bairro}, ${ENDERECO.cidade} - ${ENDERECO.uf}, ${ENDERECO.cep}`,
);

/* ═══════════════════════════════ CONFIG ════════════════════════════════ */

export const site = {
  /* ------------------------------------------------------------ marca */
  marca: {
    nome: 'Rise Up Academia',
    nomeCurto: 'Rise Up',
    razaoSocial: 'Academia Rise Up Ltda',
    cnpj: '20.414.331/0001-85',
    /** ✅ Abertura da empresa em 05/06/2014 (registro público). */
    fundacao: 2014,
    cidade: `${ENDERECO.cidade}/${ENDERECO.uf}`,
  },

  /**
   * Modo prévia — para mostrar o site antes do domínio definitivo.
   *
   * Ligado, o site pede aos buscadores que NÃO indexem. Isso evita que a URL
   * temporária do EasyPanel entre no Google e depois brigue por conteúdo
   * duplicado com o domínio oficial da academia, justamente no SEO local.
   *
   * Desligue (`NEXT_PUBLIC_MODO_PREVIA=false`) só no deploy definitivo.
   *
   * ⚠️ É lido no BUILD. Trocar o valor exige refazer o deploy.
   */
  previa: process.env.NEXT_PUBLIC_MODO_PREVIA !== 'false',

  /* ------------------------------------------------- SEO / metadados */
  seo: {
    /** Trocar pelo domínio definitivo antes de publicar. */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://riseupacademia.com.br',
    titulo: 'Rise Up Academia — Academia em Navegantes/SC',
    tituloTemplate: '%s · Rise Up Academia',
    descricao:
      'Academia em Navegantes/SC desde 2014. Musculação, cardio, funcional, ' +
      'lutas e aulas coletivas no bairro São Domingos. Seg a Sex das 6h às 23h.',
    palavrasChave: [
      'academia em Navegantes',
      'academia Navegantes SC',
      'Rise Up Academia',
      'musculação Navegantes',
      'academia São Domingos Navegantes',
      'muay thai Navegantes',
      'treino funcional Navegantes',
    ],
    locale: 'pt_BR',
    /** Imagem de compartilhamento (Open Graph / WhatsApp / X). */
    ogImage: '/assets/posters/hero-poster-720.jpg',
  },

  /* ------------------------------------------------------- contatos */
  contato: {
    telefone: TELEFONE,
    whatsapp: WHATSAPP,
    telefoneHref: `tel:${TELEFONE.e164}`,
    whatsappHref: `https://wa.me/${WHATSAPP.e164}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`,
    email: null as string | null, // ⚠️ nenhum e-mail público encontrado
  },

  /* ------------------------------------------------------- endereço */
  endereco: {
    ...ENDERECO,
    linha: ENDERECO_LINHA,
    mapaEmbed: `https://www.google.com/maps?q=${BUSCA_MAPA}&output=embed`,
    mapaLink: `https://www.google.com/maps/search/?api=1&query=${BUSCA_MAPA}`,
    rotaLink: `https://www.google.com/maps/dir/?api=1&destination=${BUSCA_MAPA}`,
  },

  /* -------------------------------------------------------- horários
     ✅ Confirmado pela placa da fachada, visível no reel oficial (t≈0,2s). */
  horarios: {
    fonte: 'Informado pela academia (setembro/2026)',
    lista: [
      { dias: 'Segunda a sexta', horas: '6h às 23h', aberto: true },
      { dias: 'Sábado', horas: '8h–12h · 14h–18h', aberto: true },
      { dias: 'Domingo', horas: 'Fechado', aberto: false },
    ],
    /** Formato schema.org — usado no JSON-LD de SEO local. */
    schema: [
      { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '06:00', fecha: '23:00' },
      // Sábado tem intervalo: o schema.org pede duas faixas separadas.
      { dias: ['Saturday'], abre: '08:00', fecha: '12:00' },
      { dias: ['Saturday'], abre: '14:00', fecha: '18:00' },
    ],
  },

  /* ----------------------------------------------------------- redes */
  redes: {
    instagram: { usuario: '@academiariseup', url: 'https://www.instagram.com/academiariseup/' },
    facebook: { url: 'https://www.facebook.com/academiariseupnavegantes/' },
  },

  /* ------------------------------------------------------- navegação */
  navegacao: [
    { rotulo: 'Início', href: '#inicio' },
    { rotulo: 'A Rise Up', href: '#sobre' },
    { rotulo: 'Estrutura', href: '#estrutura' },
    { rotulo: 'Treinos', href: '#treinos' },
    { rotulo: 'Experiência', href: '#experiencia' },
    { rotulo: 'Localização', href: '#localizacao' },
  ],

  /* ------------------------------------------------------------ hero */
  hero: {
    etiqueta: `Navegantes · SC — desde ${2014}`,
    /** Copy criada para este projeto. Não é slogan oficial da marca. */
    titulo: ['Suba', 'o nível'],
    /** Linha de reforço logo abaixo do título. Também é copy proposta. */
    chamada: 'Mais que uma academia, um estilo de vida.',
    subtitulo:
      'Musculação, cardio, funcional, lutas e aulas coletivas em um só lugar. ' +
      'Estrutura completa para você treinar com propósito.',

    /** Selos de destaque sobre o vídeo. `icone` casa com o mapa em Hero.tsx. */
    destaques: [
      { icone: 'halter', linhas: ['Musculação', 'completa'] },
      { icone: 'coracao', linhas: ['Cardio', 'moderno'] },
      { icone: 'grupo', linhas: ['Aulas', 'coletivas'] },
      { icone: 'luva', linhas: ['Lutas e', 'funcional'] },
    ],

    /** Rótulo do indicador de rolagem, no rodapé do hero. */
    rolar: 'Conheça a Rise Up',

    ctaPrimario: { rotulo: 'Quero subir o nível', href: 'whatsapp' as const },
    ctaSecundario: { rotulo: 'Já sou aluno', href: '/entrar' },
    /** Métricas exibidas sob o hero — apenas dados verificáveis. */
    indicadores: [
      { valor: '2014', rotulo: 'Desde' },
      { valor: '6h–23h', rotulo: 'Seg a sex' },
      { valor: '6', rotulo: 'Frentes de treino' },
    ],
    video: {
      webm: '/assets/video/rise-up-hero.webm',
      mp4: '/assets/video/rise-up-hero.mp4',
      mp4Mobile: '/assets/video/rise-up-hero-mobile.mp4',
      poster: '/assets/posters/hero-poster-720.jpg',
      posterBlur: '/assets/posters/hero-poster-blur.jpg',
    },
  },

  /* ----------------------------------------------------------- sobre */
  sobre: {
    indice: '01',
    etiqueta: 'A Rise Up',
    titulo: 'Fazendo Navegantes treinar desde 2014.',
    paragrafos: [
      'A Rise Up abriu as portas no São Domingos em 2014 e desde então virou ' +
        'ponto de encontro de quem leva o treino a sério — e de quem está ' +
        'começando agora.',
      'Cada pessoa tem um ritmo. Cada treino, um propósito. Tem quem comece o ' +
        'dia às 6h, quem termine o turno e treine às 22h, quem busque força na ' +
        'musculação, intensidade no boxe ou energia nas aulas coletivas.',
      'Na Rise Up, diferentes rotinas encontram uma estrutura feita para ' +
        'acompanhar cada uma delas.',
    ],
    destaque: {
      valor: '2014',
      texto: 'Ano de fundação, confirmado no registro da empresa.',
    },
    imagem: {
      src: '/assets/images/sobre-fachada',
      alt: 'Fachada da Rise Up Academia, com o letreiro da marca, no bairro São Domingos',
      foco: '50% 40%',
    },
  },

  /* ------------------------------------------------------- estrutura
     Todas as fotos são frames do reel oficial da própria academia. */
  estrutura: {
    indice: '02',
    etiqueta: 'Estrutura',
    titulo: 'Um espaço para cada tipo de treino.',
    descricao:
      'Todas as imagens desta seção são cenas reais da Rise Up, capturadas do ' +
      'vídeo institucional da academia.',
    galeria: [
      { src: '/assets/images/estrutura-salao', alt: 'Salão da Rise Up com área de grama sintética e o letreiro da marca ao fundo', legenda: 'Salão principal', foco: '50% 56%' },
      { src: '/assets/images/estrutura-bikes', alt: 'Sala de bikes da Rise Up, com as bicicletas enfileiradas sob iluminação de LED', legenda: 'Sala de bikes' },
      { src: '/assets/images/estrutura-cardio', alt: 'Fileira de esteiras da área de cardio sob iluminação de LED', legenda: 'Cardio' },
      { src: '/assets/images/estrutura-funcional', alt: 'Aluno treinando com corda naval sobre a grama sintética da área funcional', legenda: 'Funcional', foco: '50% 58%' },
      { src: '/assets/images/estrutura-coletivas', alt: 'Turma treinando com barras na sala espelhada de aulas coletivas', legenda: 'Aulas coletivas' },
      { src: '/assets/images/estrutura-livres', alt: 'Aluno agachando com barra no rack de agachamento', legenda: 'Peso livre' },
      { src: '/assets/images/estrutura-studio', alt: 'Sala espelhada com colchonetes, steps e bolas suíças', legenda: 'Studio', foco: '50% 45%' },
      { src: '/assets/images/estrutura-maquinas', alt: 'Vista ampla do salão com bancos e máquinas de musculação', legenda: 'Máquinas', foco: '50% 58%' },
    ],
  },

  /* -------------------------------------------------------- treinos
     ⚠️ Descrições baseadas no que é VISÍVEL no vídeo oficial.
     Nomes comerciais das aulas e grade de horários: ver pendências. */
  treinos: {
    indice: '03',
    etiqueta: 'Treinos',
    titulo: 'Seis frentes. Uma academia.',
    descricao:
      'Cada frente abaixo aparece no vídeo institucional da Rise Up. ' +
      'Grade de horários e condições comerciais: consulte a recepção.',
    itens: [
      {
        nome: 'Musculação',
        texto: 'Máquinas, peso livre, racks e halteres para força, hipertrofia e condicionamento.',
        imagem: '/assets/images/modalidade-musculacao',
        alt: 'Aluno executando desenvolvimento com barra na área de musculação',
      },
      {
        nome: 'Cardio',
        texto: 'Esteiras, escada e bikes para aquecimento, resistência e gasto calórico.',
        imagem: '/assets/images/modalidade-cardio',
        alt: 'Aluna correndo na esteira da área de cardio',
      },
      {
        nome: 'Funcional & Cross',
        texto: 'Área com grama sintética, corda naval e assault bike para treino intervalado.',
        imagem: '/assets/images/modalidade-funcional',
        alt: 'Corda naval sobre a grama sintética da área funcional',
      },
      {
        nome: 'Lutas',
        texto: 'Treino de golpes, aparação e sparring com acompanhamento.',
        imagem: '/assets/images/modalidade-lutas',
        alt: 'Dupla treinando golpes de luta com luvas e aparadores',
      },
      {
        nome: 'Aulas coletivas',
        texto: 'Sala espelhada com barras, colchonetes e bolas para treinar em turma.',
        imagem: '/assets/images/modalidade-coletivas',
        alt: 'Turma em aula coletiva na sala espelhada',
      },
      {
        nome: 'Acompanhamento',
        texto: 'Instrutores na sala corrigindo execução e ajustando a carga do treino.',
        imagem: '/assets/images/modalidade-acompanhamento',
        alt: 'Instrutora orientando a execução de uma aluna na máquina',
      },
    ],
  },

  /* --------------------------------------------------- diferenciais
     Somente fatos verificáveis. Nada de "melhor academia da região". */
  diferenciais: {
    indice: '04',
    etiqueta: 'Por que a Rise Up',
    titulo: 'O que sustenta a escolha.',
    itens: [
      { numero: '01', titulo: 'Mais de dez anos de operação', texto: `Em atividade em Navegantes desde ${2014}, com registro público de abertura em junho daquele ano.` },
      { numero: '02', titulo: 'Aberta 17 horas por dia', texto: 'Das 6h às 23h de segunda a sexta. Dá para treinar antes do trabalho ou depois do turno da noite.' },
      { numero: '03', titulo: 'Seis frentes no mesmo lugar', texto: 'Musculação, cardio, funcional, lutas, aulas coletivas e acompanhamento sem precisar de outra matrícula.' },
      { numero: '04', titulo: 'No São Domingos', texto: 'Endereço próprio no bairro, com acesso direto pela Rua Gracilides Coelho Reiser.' },
    ],
  },

  /* ----------------------------------------------------- experiência */
  experiencia: {
    indice: '05',
    etiqueta: 'Experiência',
    titulo: 'Veja a Rise Up em movimento.',
    texto:
      'Quarenta e quatro segundos dentro da academia: o salão, a área funcional, ' +
      'o cardio, as lutas e as aulas coletivas — sem cenário montado.',
    video: {
      src: '/assets/video/rise-up-experiencia.mp4',
      capa: '/assets/images/experiencia-capa',
      capaAlt: 'Vista ampla do salão de musculação da Rise Up',
      foco: '50% 50%',
      duracao: '0:44',
    },
    legenda: 'Vídeo institucional da Rise Up Academia · sem edição de terceiros',
  },

  /* ---------------------------------------------------- prova social */
  provaSocial: {
    indice: '06',
    etiqueta: 'Quem treina aqui',
    titulo: 'O que dizem publicamente.',
    /** Desligue se preferir não exibir a nota até ter mais avaliações. */
    exibirNota: true,
    nota: {
      valor: '5,0',
      total: 5,
      fonte: 'FitFit',
      url: 'https://br.fitfit.fitness/pt/i/8765-rise-up-academia/',
      aviso: 'Nota pública agregada em setembro de 2026, com base em 5 avaliações.',
    },
    /**
     * As cinco avaliações públicas do perfil no FitFit, reproduzidas na
     * íntegra. O prefixo "Experiência fantástica:" que aparece na origem é
     * rótulo da própria plataforma para nota 5, não texto do autor — por isso
     * não entra aqui. Nenhum depoimento foi criado, reescrito ou reatribuído.
     */
    depoimentos: [
      {
        texto: 'Atendimento impecável. Aparelhos de última geração. Local com várias modalidades e fácil acesso.',
        autor: 'Rosineide Aparecida',
      },
      {
        texto: 'Gostei, estou treinando alguns dias e já estou gostando bastante. Atendimento top, diferenciado.',
        autor: 'Leonardo Adelino',
      },
      { texto: 'Perfeito. Tudo de bom.', autor: 'Joao Evangelista Chagas Santos Neto' },
      { texto: 'Ótimo lugar.', autor: 'Yago Penha' },
      { texto: 'Ótimo, amei.', autor: 'Cristiane Lima' },
    ],
    rodape:
      'Exibimos apenas avaliações públicas reais, com autoria e fonte. ' +
      'Nenhum depoimento desta página foi escrito pela academia.',
  },

  /* ------------------------------------------------------- instagram */
  instagram: {
    indice: '07',
    etiqueta: 'Instagram',
    titulo: 'Siga a Rise Up.',
    texto: 'O dia a dia da academia, os treinos e os avisos saem primeiro por lá.',
    /** Prévia local — o site não depende de API nem de embed do Instagram. */
    previa: [
      { src: '/assets/images/estrutura-bikes', alt: 'Sala de bikes da Rise Up' },
      { src: '/assets/images/modalidade-lutas', alt: 'Treino de lutas na Rise Up' },
      { src: '/assets/images/estrutura-coletivas', alt: 'Aula coletiva na Rise Up' },
      { src: '/assets/images/marca-fachada', alt: 'Letreiro Rise Up na parede interna da academia' },
    ],
    aviso: 'Prévia com cenas do vídeo institucional. Conteúdo ao vivo no perfil.',
  },

  /* ----------------------------------------------------- localização */
  localizacao: {
    indice: '08',
    etiqueta: 'Localização',
    titulo: 'Onde a gente treina.',
  },

  /* -------------------------------------------------------- CTA final */
  ctaFinal: {
    titulo: ['Pronto para', 'subir o nível?'],
  },

  /* ------------------------------------------------------------ footer */
  footer: {
    assinatura: 'Treine forte. Treine sempre.',
    legal: [
      { rotulo: 'Política de Privacidade', href: '/politica-de-privacidade' },
      { rotulo: 'Termos de Uso', href: '/termos-de-uso' },
    ],
  },
} as const;

export type Site = typeof site;

/* ──────────────────────────── utilidades ─────────────────────────────── */

/** Resolve o href de um CTA, trocando o atalho `whatsapp` pelo link real. */
export function resolverHref(href: string): string {
  return href === 'whatsapp' ? site.contato.whatsappHref : href;
}

/** Monta o srcSet de uma imagem gerada pelo pipeline (`nome` sem extensão). */
export function imagemSrcSet(base: string, ext: 'webp' | 'jpg' = 'webp') {
  return {
    src: `${base}-720.${ext}`,
    srcSet: `${base}-480.${ext} 480w, ${base}-720.${ext} 720w`,
  };
}
