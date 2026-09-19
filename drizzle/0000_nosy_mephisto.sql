CREATE TABLE `alunos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` integer NOT NULL,
	`telefone` text,
	`nascimento` text,
	`genero` text,
	`altura_cm` integer,
	`peso_inicial_g` integer,
	`perfil_treino` text,
	`perfil_definido_em` text,
	`perfil_definido_por` integer,
	`observacoes` text,
	`matricula_em` text,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`perfil_definido_por`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_alunos_usuario` ON `alunos` (`usuario_id`);--> statement-breakpoint
CREATE TABLE `atividades_strava` (
	`id` text PRIMARY KEY NOT NULL,
	`aluno_id` integer NOT NULL,
	`nome` text NOT NULL,
	`tipo` text NOT NULL,
	`inicio_em` text NOT NULL,
	`distancia_m` integer,
	`duracao_seg` integer,
	`desnivel_m` integer,
	`calorias` integer,
	`sincronizado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_atividades_aluno` ON `atividades_strava` (`aluno_id`,`inicio_em`);--> statement-breakpoint
CREATE TABLE `aulas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`modalidade` text NOT NULL,
	`professor` text,
	`dia_semana` integer NOT NULL,
	`hora_inicio` text NOT NULL,
	`hora_fim` text NOT NULL,
	`vagas` integer,
	`ativa` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_aulas_dia` ON `aulas` (`dia_semana`);--> statement-breakpoint
CREATE TABLE `avisos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`texto` text NOT NULL,
	`perfil` text,
	`publicado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`expira_em` text,
	`ativo` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `checkins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`aula_id` integer,
	`em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`origem` text DEFAULT 'app' NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`aula_id`) REFERENCES `aulas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_checkins_aluno` ON `checkins` (`aluno_id`);--> statement-breakpoint
CREATE TABLE `conexoes_strava` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`atleta_id` text NOT NULL,
	`atleta_nome` text,
	`token_acesso_cifrado` text NOT NULL,
	`token_renovacao_cifrado` text NOT NULL,
	`expira_em` text NOT NULL,
	`conectado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`ultima_sincronia` text,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_strava_aluno` ON `conexoes_strava` (`aluno_id`);--> statement-breakpoint
CREATE TABLE `configuracoes` (
	`chave` text PRIMARY KEY NOT NULL,
	`valor` text NOT NULL,
	`atualizado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercicios_treino` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`treino_id` integer NOT NULL,
	`bloco` text DEFAULT 'A' NOT NULL,
	`nome` text NOT NULL,
	`series` text,
	`repeticoes` text,
	`descanso_seg` integer,
	`observacao` text,
	`ordem` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`treino_id`) REFERENCES `treinos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_exercicios_treino` ON `exercicios_treino` (`treino_id`);--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`plano_id` integer NOT NULL,
	`inicio` text NOT NULL,
	`fim` text,
	`situacao` text DEFAULT 'ativa' NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plano_id`) REFERENCES `planos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_matriculas_aluno` ON `matriculas` (`aluno_id`);--> statement-breakpoint
CREATE TABLE `metas_agua` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`meta_diaria_ml` integer NOT NULL,
	`copo_ml` integer DEFAULT 250 NOT NULL,
	`lembretes_ativos` integer DEFAULT false NOT NULL,
	`lembrete_inicio` text DEFAULT '08:00',
	`lembrete_fim` text DEFAULT '21:00',
	`lembrete_intervalo_min` integer DEFAULT 90 NOT NULL,
	`atualizado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_metas_agua_aluno` ON `metas_agua` (`aluno_id`);--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`matricula_id` integer,
	`competencia` text NOT NULL,
	`valor_centavos` integer NOT NULL,
	`vencimento` text NOT NULL,
	`pago_em` text,
	`meio` text,
	`situacao` text DEFAULT 'aberto' NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`matricula_id`) REFERENCES `matriculas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pagamentos_aluno` ON `pagamentos` (`aluno_id`);--> statement-breakpoint
CREATE INDEX `idx_pagamentos_competencia` ON `pagamentos` (`competencia`);--> statement-breakpoint
CREATE TABLE `planos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`valor_centavos` integer NOT NULL,
	`periodicidade` text DEFAULT 'mensal' NOT NULL,
	`ativo` integer DEFAULT true NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `receitas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`resumo` text,
	`perfil` text NOT NULL,
	`genero` text,
	`refeicao` text NOT NULL,
	`tempo_min` integer,
	`porcoes` integer DEFAULT 1 NOT NULL,
	`calorias` integer,
	`proteina_g` integer,
	`carboidrato_g` integer,
	`gordura_g` integer,
	`ingredientes` text NOT NULL,
	`preparo` text NOT NULL,
	`assinado_por` text,
	`publicada` integer DEFAULT false NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_receitas_perfil` ON `receitas` (`perfil`);--> statement-breakpoint
CREATE TABLE `registros_agua` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`dia` text NOT NULL,
	`ml` integer NOT NULL,
	`em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_agua_aluno_dia` ON `registros_agua` (`aluno_id`,`dia`);--> statement-breakpoint
CREATE TABLE `sessoes` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` integer NOT NULL,
	`expira_em` text NOT NULL,
	`ultimo_uso` text,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessoes_usuario` ON `sessoes` (`usuario_id`);--> statement-breakpoint
CREATE TABLE `treinos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`resumo` text,
	`perfil` text NOT NULL,
	`genero` text,
	`nivel` text DEFAULT 'iniciante' NOT NULL,
	`duracao_min` integer,
	`dias_por_semana` integer,
	`assinado_por` text,
	`publicado` integer DEFAULT false NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_treinos_perfil` ON `treinos` (`perfil`);--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`perfil` text NOT NULL,
	`ativo` integer DEFAULT true NOT NULL,
	`precisa_trocar_senha` integer DEFAULT false NOT NULL,
	`ultimo_acesso` text,
	`criado_em` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);