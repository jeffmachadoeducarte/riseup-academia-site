/**
 * Modelo de dados da área do aluno — Rise Up Academia.
 *
 * Decisões que valem registrar:
 * - Senha nunca em texto puro. Só `senha_hash` (scrypt).
 * - Dinheiro em CENTAVOS (inteiro). `real` em SQLite arredonda errado e
 *   mensalidade não pode ter centavo fantasma.
 * - Datas em texto ISO-8601 UTC, como no Educarte: SQLite não tem tipo data e
 *   texto ISO ordena corretamente em comparação lexicográfica.
 * - O **perfil de treino** é apontado pela direção da academia, nunca escolhido
 *   pelo aluno. É ele que decide o que o PWA mostra de treino e alimentação.
 */
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

const agora = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`;

/* ═══════════════════════════════════════════════ acesso ═══════════════ */

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  /** scrypt$<sal-hex>$<hash-hex>. NUNCA guardar nem exibir senha em texto puro. */
  senhaHash: text('senha_hash').notNull(),
  perfil: text('perfil', { enum: ['master', 'aluno'] }).notNull(),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  precisaTrocarSenha: integer('precisa_trocar_senha', { mode: 'boolean' })
    .notNull().default(false),
  ultimoAcesso: text('ultimo_acesso'),
  criadoEm: text('criado_em').notNull().default(agora),
});

export const sessoes = sqliteTable('sessoes', {
  id: text('id').primaryKey(), // token aleatório de 32 bytes
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  expiraEm: text('expira_em').notNull(),
  ultimoUso: text('ultimo_uso'),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porUsuario: index('idx_sessoes_usuario').on(t.usuarioId),
}));

/* ═══════════════════════════════════════════════ aluno ════════════════ */

/**
 * Os quatro perfis de treino que a direção pode apontar.
 * É a chave do app: treino e alimentação exibidos saem daqui.
 */
export const PERFIS_TREINO = ['emagrecimento', 'hipertrofia', 'condicionamento', 'saude'] as const;
export type PerfilTreino = (typeof PERFIS_TREINO)[number];

export const ROTULO_PERFIL: Record<PerfilTreino, string> = {
  emagrecimento: 'Emagrecimento',
  hipertrofia: 'Hipertrofia',
  condicionamento: 'Condicionamento',
  saude: 'Saúde e bem-estar',
};

export const alunos = sqliteTable('alunos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  telefone: text('telefone'),
  nascimento: text('nascimento'),               // AAAA-MM-DD
  /** Usado para calibrar treino e porções. 'outro' recebe o conteúdo neutro. */
  genero: text('genero', { enum: ['masculino', 'feminino', 'outro'] }),
  alturaCm: integer('altura_cm'),
  pesoInicialG: integer('peso_inicial_g'),      // gramas, para não perder 100g
  /**
   * Apontado pela direção na tela de alunos. Enquanto for nulo, o PWA mostra
   * o aviso de que a avaliação ainda não foi feita — nunca um treino genérico
   * apresentado como se fosse prescrição.
   */
  perfilTreino: text('perfil_treino', { enum: PERFIS_TREINO }),
  perfilDefinidoEm: text('perfil_definido_em'),
  perfilDefinidoPor: integer('perfil_definido_por').references(() => usuarios.id),
  observacoes: text('observacoes'),
  matriculaEm: text('matricula_em'),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porUsuario: uniqueIndex('idx_alunos_usuario').on(t.usuarioId),
}));

/* ═══════════════════════════════════ planos e pagamentos ══════════════ */

export const planos = sqliteTable('planos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  /** Em centavos. Valores reais são preenchidos pela academia. */
  valorCentavos: integer('valor_centavos').notNull(),
  periodicidade: text('periodicidade', { enum: ['mensal', 'trimestral', 'semestral', 'anual'] })
    .notNull().default('mensal'),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  ordem: integer('ordem').notNull().default(0),
});

export const matriculas = sqliteTable('matriculas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  planoId: integer('plano_id').notNull().references(() => planos.id),
  inicio: text('inicio').notNull(),
  fim: text('fim'),
  situacao: text('situacao', { enum: ['ativa', 'suspensa', 'encerrada'] })
    .notNull().default('ativa'),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porAluno: index('idx_matriculas_aluno').on(t.alunoId),
}));

export const pagamentos = sqliteTable('pagamentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  matriculaId: integer('matricula_id').references(() => matriculas.id),
  competencia: text('competencia').notNull(),   // AAAA-MM
  valorCentavos: integer('valor_centavos').notNull(),
  vencimento: text('vencimento').notNull(),     // AAAA-MM-DD
  pagoEm: text('pago_em'),
  meio: text('meio', { enum: ['pix', 'dinheiro', 'debito', 'credito', 'boleto'] }),
  situacao: text('situacao', { enum: ['aberto', 'pago', 'atrasado', 'cancelado'] })
    .notNull().default('aberto'),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porAluno: index('idx_pagamentos_aluno').on(t.alunoId),
  porCompetencia: index('idx_pagamentos_competencia').on(t.competencia),
}));

/* ══════════════════════════════════════ aulas e frequência ════════════ */

export const aulas = sqliteTable('aulas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  modalidade: text('modalidade').notNull(),
  professor: text('professor'),
  /** 0 = domingo … 6 = sábado (mesma convenção de Date.getDay). */
  diaSemana: integer('dia_semana').notNull(),
  horaInicio: text('hora_inicio').notNull(),    // HH:MM
  horaFim: text('hora_fim').notNull(),
  vagas: integer('vagas'),
  ativa: integer('ativa', { mode: 'boolean' }).notNull().default(true),
}, (t) => ({
  porDia: index('idx_aulas_dia').on(t.diaSemana),
}));

/** Presença registrada na recepção ou pelo próprio aluno no PWA. */
export const checkins = sqliteTable('checkins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  aulaId: integer('aula_id').references(() => aulas.id),
  em: text('em').notNull().default(agora),
  origem: text('origem', { enum: ['recepcao', 'app'] }).notNull().default('app'),
}, (t) => ({
  porAluno: index('idx_checkins_aluno').on(t.alunoId),
}));

/* ═══════════════════════════════════════════════ hidratação ═══════════ */

/**
 * Meta de água do aluno + lembretes.
 *
 * A meta padrão (35 ml por kg) é uma referência de uso geral, NÃO prescrição.
 * A direção pode ajustar por aluno; a tela deixa a origem do número visível.
 */
export const metasAgua = sqliteTable('metas_agua', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  metaDiariaMl: integer('meta_diaria_ml').notNull(),
  /** Tamanho do copo que o botão rápido registra. */
  copoMl: integer('copo_ml').notNull().default(250),
  lembretesAtivos: integer('lembretes_ativos', { mode: 'boolean' }).notNull().default(false),
  lembreteInicio: text('lembrete_inicio').default('08:00'),
  lembreteFim: text('lembrete_fim').default('21:00'),
  /** Intervalo entre lembretes, em minutos. */
  lembreteIntervaloMin: integer('lembrete_intervalo_min').notNull().default(90),
  atualizadoEm: text('atualizado_em').notNull().default(agora),
}, (t) => ({
  porAluno: uniqueIndex('idx_metas_agua_aluno').on(t.alunoId),
}));

export const registrosAgua = sqliteTable('registros_agua', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  dia: text('dia').notNull(),                   // AAAA-MM-DD (fuso do aluno)
  ml: integer('ml').notNull(),
  em: text('em').notNull().default(agora),
}, (t) => ({
  porAlunoDia: index('idx_agua_aluno_dia').on(t.alunoId, t.dia),
}));

/* ═════════════════════════════════════════ treinos e receitas ═════════ */

/**
 * Conteúdo por perfil. Um treino/receita aparece para o aluno quando o perfil
 * bate — e, quando `genero` está preenchido, só para aquele gênero.
 *
 * ⚠️ Todo conteúdo aqui é material da academia, revisado por profissional
 * responsável (`assinadoPor`). O app não gera prescrição sozinho.
 */
export const treinos = sqliteTable('treinos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  resumo: text('resumo'),
  perfil: text('perfil', { enum: PERFIS_TREINO }).notNull(),
  genero: text('genero', { enum: ['masculino', 'feminino'] }),
  nivel: text('nivel', { enum: ['iniciante', 'intermediario', 'avancado'] })
    .notNull().default('iniciante'),
  duracaoMin: integer('duracao_min'),
  diasPorSemana: integer('dias_por_semana'),
  /** Nome e registro (CREF) de quem assina. Sem isso não vai para o ar. */
  assinadoPor: text('assinado_por'),
  publicado: integer('publicado', { mode: 'boolean' }).notNull().default(false),
  ordem: integer('ordem').notNull().default(0),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porPerfil: index('idx_treinos_perfil').on(t.perfil),
}));

export const exerciciosTreino = sqliteTable('exercicios_treino', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  treinoId: integer('treino_id').notNull().references(() => treinos.id, { onDelete: 'cascade' }),
  /** "A", "B", "C" — divisão do treino. */
  bloco: text('bloco').notNull().default('A'),
  nome: text('nome').notNull(),
  series: text('series'),                       // "3", "4"
  repeticoes: text('repeticoes'),               // "8-12", "30s"
  descansoSeg: integer('descanso_seg'),
  observacao: text('observacao'),
  ordem: integer('ordem').notNull().default(0),
}, (t) => ({
  porTreino: index('idx_exercicios_treino').on(t.treinoId),
}));

export const receitas = sqliteTable('receitas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  resumo: text('resumo'),
  perfil: text('perfil', { enum: PERFIS_TREINO }).notNull(),
  genero: text('genero', { enum: ['masculino', 'feminino'] }),
  refeicao: text('refeicao', {
    enum: ['cafe', 'almoco', 'lanche', 'jantar', 'pre-treino', 'pos-treino'],
  }).notNull(),
  tempoMin: integer('tempo_min'),
  porcoes: integer('porcoes').notNull().default(1),
  calorias: integer('calorias'),
  proteinaG: integer('proteina_g'),
  carboidratoG: integer('carboidrato_g'),
  gorduraG: integer('gordura_g'),
  /** JSON: string[] */
  ingredientes: text('ingredientes').notNull(),
  /** JSON: string[] */
  preparo: text('preparo').notNull(),
  /** Nome e CRN de quem assina. Sem isso não vai para o ar. */
  assinadoPor: text('assinado_por'),
  publicada: integer('publicada', { mode: 'boolean' }).notNull().default(false),
  criadoEm: text('criado_em').notNull().default(agora),
}, (t) => ({
  porPerfil: index('idx_receitas_perfil').on(t.perfil),
}));

/* ═══════════════════════════════════════════════════ Strava ═══════════ */

/**
 * Conexão do aluno com o Strava (OAuth).
 *
 * Os tokens ficam cifrados com RISEUP_CHAVE_SEGREDOS — mesma ideia do cofre do
 * Educarte. Trocar a chave torna as conexões ilegíveis e os alunos precisam
 * reconectar.
 */
export const conexoesStrava = sqliteTable('conexoes_strava', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  atletaId: text('atleta_id').notNull(),
  atletaNome: text('atleta_nome'),
  tokenAcessoCifrado: text('token_acesso_cifrado').notNull(),
  tokenRenovacaoCifrado: text('token_renovacao_cifrado').notNull(),
  expiraEm: text('expira_em').notNull(),
  conectadoEm: text('conectado_em').notNull().default(agora),
  ultimaSincronia: text('ultima_sincronia'),
}, (t) => ({
  porAluno: uniqueIndex('idx_strava_aluno').on(t.alunoId),
}));

export const atividadesStrava = sqliteTable('atividades_strava', {
  id: text('id').primaryKey(),                  // id da atividade no Strava
  alunoId: integer('aluno_id').notNull().references(() => alunos.id, { onDelete: 'cascade' }),
  nome: text('nome').notNull(),
  tipo: text('tipo').notNull(),                 // Run, Ride, Workout…
  inicioEm: text('inicio_em').notNull(),
  distanciaM: integer('distancia_m'),
  duracaoSeg: integer('duracao_seg'),
  desnivelM: integer('desnivel_m'),
  calorias: integer('calorias'),
  sincronizadoEm: text('sincronizado_em').notNull().default(agora),
}, (t) => ({
  porAluno: index('idx_atividades_aluno').on(t.alunoId, t.inicioEm),
}));

/* ═══════════════════════════════════════════════ avisos ═══════════════ */

/** Recados da direção para os alunos, exibidos no início do app. */
export const avisos = sqliteTable('avisos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  texto: text('texto').notNull(),
  /** Nulo = para todos. Preenchido = só para aquele perfil. */
  perfil: text('perfil', { enum: PERFIS_TREINO }),
  publicadoEm: text('publicado_em').notNull().default(agora),
  expiraEm: text('expira_em'),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
});

export const configuracoes = sqliteTable('configuracoes', {
  chave: text('chave').primaryKey(),
  valor: text('valor').notNull(),
  atualizadoEm: text('atualizado_em').notNull().default(agora),
});
