-- Dados de DEMONSTRAÇÃO da Rise Up.
-- Gerado por scripts/exportar-demo.mjs. Não editar à mão.
-- Aplicado apenas quando RISEUP_SEMEAR_DEMO=true e o banco está vazio.
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- usuarios (2)
INSERT INTO usuarios ("id", "nome", "email", "senha_hash", "perfil", "ativo", "precisa_trocar_senha", "ultimo_acesso", "criado_em") VALUES (1, 'Direção Rise Up', 'master@riseup.test', 'scrypt$8d7748cac894a90b31538ac28eb47853$42f0f20031dfd277915bce37fc59d42686630a24deb3bd25b4d40e8fa89b5ca952256cbf2e5aa410be30d483badb0f6a8a6334c6295cf3d234e93f0f5d554c8b', 'master', 1, 0, NULL, '2026-09-19T15:38:49.116Z');
INSERT INTO usuarios ("id", "nome", "email", "senha_hash", "perfil", "ativo", "precisa_trocar_senha", "ultimo_acesso", "criado_em") VALUES (2, 'Lucas Ferreira', 'aluno@riseup.test', 'scrypt$3c40645be1a276aa8b246287d9d42c83$b373fc13d76d7023e37c2907dcee59e659dababb22a45ffbfc5008a18538e096fab88232318c9f847dc8d935994f5a8175306218056cf1bcb22d7700f749aa5b', 'aluno', 1, 0, NULL, '2026-09-19T15:38:49.148Z');

-- alunos (1)
INSERT INTO alunos ("id", "usuario_id", "telefone", "nascimento", "genero", "altura_cm", "peso_inicial_g", "perfil_treino", "perfil_definido_em", "perfil_definido_por", "observacoes", "matricula_em", "criado_em") VALUES (1, 2, '(47) 99999-0000', '1995-04-12', 'masculino', 178, 84500, 'hipertrofia', '2026-08-10T15:38:49.149Z', 1, 'Aluno de demonstração.', '2026-05-22', '2026-09-19T15:38:49.150Z');

-- planos (3)
INSERT INTO planos ("id", "nome", "descricao", "valor_centavos", "periodicidade", "ativo", "ordem") VALUES (1, 'Mensal', 'Acesso livre à musculação e ao cardio.', 0, 'mensal', 1, 1);
INSERT INTO planos ("id", "nome", "descricao", "valor_centavos", "periodicidade", "ativo", "ordem") VALUES (2, 'Trimestral', 'Três meses com acesso a todas as modalidades.', 0, 'trimestral', 1, 2);
INSERT INTO planos ("id", "nome", "descricao", "valor_centavos", "periodicidade", "ativo", "ordem") VALUES (3, 'Anual', 'Plano completo por doze meses.', 0, 'anual', 1, 3);

-- matriculas (1)
INSERT INTO matriculas ("id", "aluno_id", "plano_id", "inicio", "fim", "situacao", "criado_em") VALUES (1, 1, 1, '2026-05-22', NULL, 'ativa', '2026-09-19T15:38:49.151Z');

-- pagamentos (4)
INSERT INTO pagamentos ("id", "aluno_id", "matricula_id", "competencia", "valor_centavos", "vencimento", "pago_em", "meio", "situacao", "criado_em") VALUES (1, 1, NULL, '2026-06', 0, '2026-06-10', '2026-06-08T12:00:00.000Z', 'pix', 'pago', '2026-09-19T15:38:49.152Z');
INSERT INTO pagamentos ("id", "aluno_id", "matricula_id", "competencia", "valor_centavos", "vencimento", "pago_em", "meio", "situacao", "criado_em") VALUES (2, 1, NULL, '2026-07', 0, '2026-07-10', '2026-07-08T12:00:00.000Z', 'pix', 'pago', '2026-09-19T15:38:49.152Z');
INSERT INTO pagamentos ("id", "aluno_id", "matricula_id", "competencia", "valor_centavos", "vencimento", "pago_em", "meio", "situacao", "criado_em") VALUES (3, 1, NULL, '2026-08', 0, '2026-08-10', '2026-08-08T12:00:00.000Z', 'pix', 'pago', '2026-09-19T15:38:49.152Z');
INSERT INTO pagamentos ("id", "aluno_id", "matricula_id", "competencia", "valor_centavos", "vencimento", "pago_em", "meio", "situacao", "criado_em") VALUES (4, 1, NULL, '2026-09', 0, '2026-09-10', NULL, NULL, 'aberto', '2026-09-19T15:38:49.152Z');

-- aulas (7)
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (1, 'Funcional', 'Funcional', NULL, 1, '06:30', '07:20', 20, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (2, 'Muay Thai', 'Lutas', NULL, 1, '19:00', '20:00', 18, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (3, 'Aula coletiva', 'Coletivas', NULL, 2, '18:00', '18:50', 25, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (4, 'Funcional', 'Funcional', NULL, 3, '06:30', '07:20', 20, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (5, 'Boxe', 'Lutas', NULL, 3, '19:00', '20:00', 18, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (6, 'Aula coletiva', 'Coletivas', NULL, 4, '18:00', '18:50', 25, 1);
INSERT INTO aulas ("id", "nome", "modalidade", "professor", "dia_semana", "hora_inicio", "hora_fim", "vagas", "ativa") VALUES (7, 'Funcional', 'Funcional', NULL, 5, '06:30', '07:20', 20, 1);

-- checkins (37)
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (1, 1, NULL, '2026-09-18T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (2, 1, NULL, '2026-09-16T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (3, 1, NULL, '2026-09-14T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (4, 1, NULL, '2026-09-12T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (5, 1, NULL, '2026-09-11T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (6, 1, NULL, '2026-09-09T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (7, 1, NULL, '2026-09-08T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (8, 1, NULL, '2026-09-05T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (9, 1, NULL, '2026-09-04T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (10, 1, NULL, '2026-09-03T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (11, 1, NULL, '2026-09-02T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (12, 1, NULL, '2026-09-01T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (13, 1, NULL, '2026-08-31T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (14, 1, NULL, '2026-08-29T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (15, 1, NULL, '2026-08-28T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (16, 1, NULL, '2026-08-27T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (17, 1, NULL, '2026-08-25T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (18, 1, NULL, '2026-08-24T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (19, 1, NULL, '2026-08-21T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (20, 1, NULL, '2026-08-15T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (21, 1, NULL, '2026-08-13T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (22, 1, NULL, '2026-08-11T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (23, 1, NULL, '2026-08-08T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (24, 1, NULL, '2026-08-07T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (25, 1, NULL, '2026-08-06T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (26, 1, NULL, '2026-08-05T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (27, 1, NULL, '2026-08-04T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (28, 1, NULL, '2026-08-03T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (29, 1, NULL, '2026-08-01T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (30, 1, NULL, '2026-07-31T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (31, 1, NULL, '2026-07-30T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (32, 1, NULL, '2026-07-29T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (33, 1, NULL, '2026-07-27T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (34, 1, NULL, '2026-07-25T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (35, 1, NULL, '2026-07-24T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (36, 1, NULL, '2026-07-23T10:15:00.000Z', 'app');
INSERT INTO checkins ("id", "aluno_id", "aula_id", "em", "origem") VALUES (37, 1, NULL, '2026-07-22T10:15:00.000Z', 'app');

-- metas_agua (1)
INSERT INTO metas_agua ("id", "aluno_id", "meta_diaria_ml", "copo_ml", "lembretes_ativos", "lembrete_inicio", "lembrete_fim", "lembrete_intervalo_min", "atualizado_em") VALUES (1, 1, 2960, 250, 1, '07:00', '21:00', 90, '2026-09-19T15:38:49.154Z');

-- registros_agua (137)
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (1, 1, '2026-09-19', 250, '2026-09-19T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (2, 1, '2026-09-19', 250, '2026-09-19T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (3, 1, '2026-09-19', 250, '2026-09-19T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (4, 1, '2026-09-19', 250, '2026-09-19T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (5, 1, '2026-09-19', 250, '2026-09-19T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (6, 1, '2026-09-19', 250, '2026-09-19T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (7, 1, '2026-09-19', 250, '2026-09-19T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (8, 1, '2026-09-19', 250, '2026-09-19T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (9, 1, '2026-09-19', 250, '2026-09-19T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (10, 1, '2026-09-19', 250, '2026-09-19T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (11, 1, '2026-09-19', 250, '2026-09-19T17:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (12, 1, '2026-09-19', 250, '2026-09-19T18:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (13, 1, '2026-09-18', 250, '2026-09-18T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (14, 1, '2026-09-18', 250, '2026-09-18T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (15, 1, '2026-09-18', 250, '2026-09-18T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (16, 1, '2026-09-18', 250, '2026-09-18T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (17, 1, '2026-09-18', 250, '2026-09-18T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (18, 1, '2026-09-18', 250, '2026-09-18T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (19, 1, '2026-09-18', 250, '2026-09-18T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (20, 1, '2026-09-18', 250, '2026-09-18T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (21, 1, '2026-09-17', 250, '2026-09-17T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (22, 1, '2026-09-17', 250, '2026-09-17T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (23, 1, '2026-09-17', 250, '2026-09-17T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (24, 1, '2026-09-17', 250, '2026-09-17T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (25, 1, '2026-09-17', 250, '2026-09-17T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (26, 1, '2026-09-17', 250, '2026-09-17T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (27, 1, '2026-09-17', 250, '2026-09-17T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (28, 1, '2026-09-16', 250, '2026-09-16T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (29, 1, '2026-09-16', 250, '2026-09-16T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (30, 1, '2026-09-16', 250, '2026-09-16T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (31, 1, '2026-09-16', 250, '2026-09-16T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (32, 1, '2026-09-16', 250, '2026-09-16T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (33, 1, '2026-09-16', 250, '2026-09-16T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (34, 1, '2026-09-16', 250, '2026-09-16T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (35, 1, '2026-09-16', 250, '2026-09-16T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (36, 1, '2026-09-16', 250, '2026-09-16T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (37, 1, '2026-09-16', 250, '2026-09-16T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (38, 1, '2026-09-16', 250, '2026-09-16T17:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (39, 1, '2026-09-16', 250, '2026-09-16T18:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (40, 1, '2026-09-15', 250, '2026-09-15T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (41, 1, '2026-09-15', 250, '2026-09-15T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (42, 1, '2026-09-15', 250, '2026-09-15T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (43, 1, '2026-09-15', 250, '2026-09-15T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (44, 1, '2026-09-15', 250, '2026-09-15T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (45, 1, '2026-09-15', 250, '2026-09-15T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (46, 1, '2026-09-15', 250, '2026-09-15T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (47, 1, '2026-09-15', 250, '2026-09-15T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (48, 1, '2026-09-15', 250, '2026-09-15T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (49, 1, '2026-09-15', 250, '2026-09-15T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (50, 1, '2026-09-14', 250, '2026-09-14T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (51, 1, '2026-09-14', 250, '2026-09-14T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (52, 1, '2026-09-14', 250, '2026-09-14T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (53, 1, '2026-09-14', 250, '2026-09-14T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (54, 1, '2026-09-14', 250, '2026-09-14T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (55, 1, '2026-09-14', 250, '2026-09-14T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (56, 1, '2026-09-14', 250, '2026-09-14T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (57, 1, '2026-09-14', 250, '2026-09-14T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (58, 1, '2026-09-13', 250, '2026-09-13T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (59, 1, '2026-09-13', 250, '2026-09-13T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (60, 1, '2026-09-13', 250, '2026-09-13T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (61, 1, '2026-09-13', 250, '2026-09-13T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (62, 1, '2026-09-13', 250, '2026-09-13T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (63, 1, '2026-09-13', 250, '2026-09-13T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (64, 1, '2026-09-13', 250, '2026-09-13T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (65, 1, '2026-09-13', 250, '2026-09-13T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (66, 1, '2026-09-13', 250, '2026-09-13T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (67, 1, '2026-09-13', 250, '2026-09-13T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (68, 1, '2026-09-13', 250, '2026-09-13T17:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (69, 1, '2026-09-13', 250, '2026-09-13T18:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (70, 1, '2026-09-13', 250, '2026-09-13T19:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (71, 1, '2026-09-12', 250, '2026-09-12T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (72, 1, '2026-09-12', 250, '2026-09-12T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (73, 1, '2026-09-12', 250, '2026-09-12T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (74, 1, '2026-09-12', 250, '2026-09-12T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (75, 1, '2026-09-12', 250, '2026-09-12T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (76, 1, '2026-09-12', 250, '2026-09-12T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (77, 1, '2026-09-12', 250, '2026-09-12T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (78, 1, '2026-09-11', 250, '2026-09-11T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (79, 1, '2026-09-11', 250, '2026-09-11T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (80, 1, '2026-09-11', 250, '2026-09-11T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (81, 1, '2026-09-11', 250, '2026-09-11T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (82, 1, '2026-09-11', 250, '2026-09-11T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (83, 1, '2026-09-11', 250, '2026-09-11T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (84, 1, '2026-09-11', 250, '2026-09-11T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (85, 1, '2026-09-10', 250, '2026-09-10T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (86, 1, '2026-09-10', 250, '2026-09-10T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (87, 1, '2026-09-10', 250, '2026-09-10T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (88, 1, '2026-09-10', 250, '2026-09-10T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (89, 1, '2026-09-10', 250, '2026-09-10T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (90, 1, '2026-09-10', 250, '2026-09-10T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (91, 1, '2026-09-10', 250, '2026-09-10T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (92, 1, '2026-09-10', 250, '2026-09-10T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (93, 1, '2026-09-10', 250, '2026-09-10T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (94, 1, '2026-09-10', 250, '2026-09-10T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (95, 1, '2026-09-10', 250, '2026-09-10T17:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (96, 1, '2026-09-10', 250, '2026-09-10T18:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (97, 1, '2026-09-09', 250, '2026-09-09T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (98, 1, '2026-09-09', 250, '2026-09-09T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (99, 1, '2026-09-09', 250, '2026-09-09T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (100, 1, '2026-09-09', 250, '2026-09-09T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (101, 1, '2026-09-09', 250, '2026-09-09T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (102, 1, '2026-09-09', 250, '2026-09-09T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (103, 1, '2026-09-09', 250, '2026-09-09T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (104, 1, '2026-09-09', 250, '2026-09-09T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (105, 1, '2026-09-09', 250, '2026-09-09T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (106, 1, '2026-09-08', 250, '2026-09-08T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (107, 1, '2026-09-08', 250, '2026-09-08T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (108, 1, '2026-09-08', 250, '2026-09-08T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (109, 1, '2026-09-08', 250, '2026-09-08T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (110, 1, '2026-09-08', 250, '2026-09-08T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (111, 1, '2026-09-08', 250, '2026-09-08T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (112, 1, '2026-09-08', 250, '2026-09-08T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (113, 1, '2026-09-08', 250, '2026-09-08T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (114, 1, '2026-09-08', 250, '2026-09-08T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (115, 1, '2026-09-08', 250, '2026-09-08T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (116, 1, '2026-09-07', 250, '2026-09-07T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (117, 1, '2026-09-07', 250, '2026-09-07T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (118, 1, '2026-09-07', 250, '2026-09-07T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (119, 1, '2026-09-07', 250, '2026-09-07T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (120, 1, '2026-09-07', 250, '2026-09-07T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (121, 1, '2026-09-07', 250, '2026-09-07T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (122, 1, '2026-09-07', 250, '2026-09-07T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (123, 1, '2026-09-07', 250, '2026-09-07T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (124, 1, '2026-09-07', 250, '2026-09-07T15:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (125, 1, '2026-09-07', 250, '2026-09-07T16:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (126, 1, '2026-09-07', 250, '2026-09-07T17:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (127, 1, '2026-09-07', 250, '2026-09-07T18:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (128, 1, '2026-09-07', 250, '2026-09-07T19:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (129, 1, '2026-09-06', 250, '2026-09-06T07:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (130, 1, '2026-09-06', 250, '2026-09-06T08:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (131, 1, '2026-09-06', 250, '2026-09-06T09:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (132, 1, '2026-09-06', 250, '2026-09-06T10:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (133, 1, '2026-09-06', 250, '2026-09-06T11:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (134, 1, '2026-09-06', 250, '2026-09-06T12:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (135, 1, '2026-09-06', 250, '2026-09-06T13:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (136, 1, '2026-09-06', 250, '2026-09-06T14:00:00.000Z');
INSERT INTO registros_agua ("id", "aluno_id", "dia", "ml", "em") VALUES (137, 1, '2026-09-06', 250, '2026-09-06T15:00:00.000Z');

-- treinos (4)
INSERT INTO treinos ("id", "titulo", "resumo", "perfil", "genero", "nivel", "duracao_min", "dias_por_semana", "assinado_por", "publicado", "ordem", "criado_em") VALUES (1, 'Full body iniciante', 'Corpo inteiro em cada sessão, três vezes por semana. Base para quem está voltando.', 'condicionamento', NULL, 'iniciante', 50, 3, NULL, 1, 0, '2026-09-19T15:38:49.367Z');
INSERT INTO treinos ("id", "titulo", "resumo", "perfil", "genero", "nivel", "duracao_min", "dias_por_semana", "assinado_por", "publicado", "ordem", "criado_em") VALUES (2, 'ABC de hipertrofia', 'Divisão em três treinos com foco em volume. Seis séries por grupo muscular na semana.', 'hipertrofia', NULL, 'intermediario', 65, 6, NULL, 1, 1, '2026-09-19T15:38:49.368Z');
INSERT INTO treinos ("id", "titulo", "resumo", "perfil", "genero", "nivel", "duracao_min", "dias_por_semana", "assinado_por", "publicado", "ordem", "criado_em") VALUES (3, 'Circuito para emagrecimento', 'Força e cardio no mesmo treino, com pouco descanso, para manter o gasto calórico alto.', 'emagrecimento', NULL, 'iniciante', 45, 4, NULL, 1, 2, '2026-09-19T15:38:49.369Z');
INSERT INTO treinos ("id", "titulo", "resumo", "perfil", "genero", "nivel", "duracao_min", "dias_por_semana", "assinado_por", "publicado", "ordem", "criado_em") VALUES (4, 'Mobilidade e condicionamento leve', 'Sessão de baixo impacto para retomar o movimento com segurança.', 'saude', NULL, 'iniciante', 40, 3, NULL, 1, 3, '2026-09-19T15:38:49.369Z');

-- exercicios_treino (33)
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (1, 1, 'A', 'Agachamento livre', '3', '10-12', 60, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (2, 1, 'A', 'Supino reto com halteres', '3', '10-12', 60, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (3, 1, 'A', 'Remada baixa', '3', '10-12', 60, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (4, 1, 'A', 'Desenvolvimento sentado', '3', '10-12', 60, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (5, 1, 'A', 'Prancha isométrica', '3', '30s', 45, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (6, 1, 'A', 'Esteira em ritmo leve', '1', '10 min', 0, NULL, 5);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (7, 2, 'A', 'Supino reto', '4', '8-10', 90, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (8, 2, 'A', 'Supino inclinado com halteres', '3', '10-12', 75, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (9, 2, 'A', 'Crucifixo na máquina', '3', '12-15', 60, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (10, 2, 'A', 'Tríceps na polia', '4', '10-12', 60, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (11, 2, 'A', 'Tríceps francês', '3', '12', 60, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (12, 2, 'B', 'Puxada alta frente', '4', '8-10', 90, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (13, 2, 'B', 'Remada curvada', '4', '8-10', 90, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (14, 2, 'B', 'Remada unilateral', '3', '10-12', 75, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (15, 2, 'B', 'Rosca direta', '4', '10-12', 60, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (16, 2, 'B', 'Rosca martelo', '3', '12', 60, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (17, 2, 'C', 'Agachamento livre', '4', '8-10', 120, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (18, 2, 'C', 'Leg press 45°', '4', '10-12', 90, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (19, 2, 'C', 'Cadeira extensora', '3', '12-15', 60, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (20, 2, 'C', 'Mesa flexora', '3', '12-15', 60, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (21, 2, 'C', 'Panturrilha em pé', '4', '15-20', 45, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (22, 3, 'A', 'Agachamento com peso corporal', '4', '15', 30, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (23, 3, 'A', 'Remada na máquina', '4', '12', 30, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (24, 3, 'A', 'Flexão de braço (apoio no banco)', '4', '10-12', 30, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (25, 3, 'A', 'Afundo alternado', '4', '12 por perna', 30, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (26, 3, 'A', 'Corda naval', '4', '30s', 30, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (27, 3, 'A', 'Assault bike', '1', '12 min', 0, NULL, 5);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (28, 4, 'A', 'Caminhada na esteira', '1', '12 min', 0, NULL, 0);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (29, 4, 'A', 'Agachamento na cadeira', '3', '12', 60, NULL, 1);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (30, 4, 'A', 'Remada sentada leve', '3', '12', 60, NULL, 2);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (31, 4, 'A', 'Elevação lateral leve', '3', '12-15', 45, NULL, 3);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (32, 4, 'A', 'Alongamento de cadeia posterior', '3', '30s', 30, NULL, 4);
INSERT INTO exercicios_treino ("id", "treino_id", "bloco", "nome", "series", "repeticoes", "descanso_seg", "observacao", "ordem") VALUES (33, 4, 'A', 'Respiração diafragmática', '3', '1 min', 30, NULL, 5);

-- receitas (8)
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (1, 'Omelete de claras com aveia', 'Proteína e carboidrato de digestão lenta para começar o dia.', 'hipertrofia', NULL, 'cafe', 12, 1, 380, 32, 34, 11, '["4 claras de ovo","1 ovo inteiro","3 colheres de sopa de aveia em flocos","1 pitada de sal","Cebolinha a gosto","1 fio de azeite"]', '["Bata as claras com o ovo inteiro e misture a aveia.","Tempere com sal e cebolinha.","Aqueça a frigideira com o azeite em fogo médio.","Despeje a mistura e cozinhe 3 a 4 minutos de cada lado."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (2, 'Frango grelhado com batata-doce', 'Clássico do pós-treino: proteína magra com carboidrato de índice moderado.', 'hipertrofia', NULL, 'pos-treino', 30, 1, 520, 45, 52, 12, '["180 g de peito de frango","200 g de batata-doce","1 colher de sopa de azeite","Alho, páprica, sal e pimenta","Brócolis a gosto"]', '["Cozinhe a batata-doce em água até ficar macia.","Tempere o frango e grelhe 6 minutos de cada lado.","Cozinhe o brócolis no vapor por 5 minutos.","Monte o prato e finalize com o azeite."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (3, 'Salada de grão-de-bico', 'Saciedade com pouca caloria, boa para o almoço de quem está em déficit.', 'emagrecimento', NULL, 'almoco', 15, 1, 320, 16, 38, 10, '["1 xícara de grão-de-bico cozido","Tomate-cereja","Pepino em cubos","Cebola roxa","Salsinha","Suco de 1 limão","1 colher de chá de azeite"]', '["Escorra e lave o grão-de-bico.","Pique os vegetais em cubos pequenos.","Misture tudo e tempere com limão, azeite e sal.","Deixe 10 minutos na geladeira antes de servir."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (4, 'Panqueca de banana e aveia', 'Lanche rápido, sem açúcar adicionado.', 'emagrecimento', NULL, 'lanche', 10, 1, 240, 9, 40, 5, '["1 banana madura","1 ovo","3 colheres de sopa de aveia","Canela a gosto"]', '["Amasse a banana e misture com o ovo e a aveia.","Aqueça a frigideira antiaderente.","Despeje a massa e doure 2 minutos de cada lado.","Finalize com canela."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (5, 'Bowl de iogurte com frutas', 'Café da manhã leve, com proteína e fibra.', 'saude', NULL, 'cafe', 5, 1, 290, 18, 36, 7, '["200 g de iogurte natural","1 colher de sopa de aveia","Frutas vermelhas","1 colher de chá de mel","Castanhas picadas"]', '["Coloque o iogurte na tigela.","Adicione a aveia e as frutas.","Finalize com mel e castanhas."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (6, 'Sopa de legumes com frango desfiado', 'Jantar leve e quente, fácil de preparar em quantidade.', 'saude', NULL, 'jantar', 35, 1, 300, 26, 28, 8, '["150 g de frango desfiado","Abobrinha, cenoura e chuchu","1 batata pequena","Alho e cebola","Sal e ervas"]', '["Refogue alho e cebola.","Junte os legumes em cubos e cubra com água.","Cozinhe 20 minutos.","Acrescente o frango desfiado e ajuste o sal."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (7, 'Banana com pasta de amendoim', 'Energia rápida antes do treino, sem pesar no estômago.', 'condicionamento', NULL, 'pre-treino', 3, 1, 230, 7, 30, 9, '["1 banana","1 colher de sopa de pasta de amendoim integral"]', '["Corte a banana ao meio.","Espalhe a pasta de amendoim.","Consuma de 30 a 45 minutos antes do treino."]', NULL, 1, '2026-09-19T15:38:49.371Z');
INSERT INTO receitas ("id", "titulo", "resumo", "perfil", "genero", "refeicao", "tempo_min", "porcoes", "calorias", "proteina_g", "carboidrato_g", "gordura_g", "ingredientes", "preparo", "assinado_por", "publicada", "criado_em") VALUES (8, 'Arroz integral com ovos e legumes', 'Refeição completa e barata para o dia a dia.', 'condicionamento', NULL, 'almoco', 25, 1, 460, 22, 58, 14, '["1 xícara de arroz integral cozido","2 ovos","Cenoura e vagem","Alho","1 colher de sopa de azeite","Sal e pimenta"]', '["Refogue o alho no azeite.","Junte os legumes picados e refogue 8 minutos.","Misture o arroz.","Faça os ovos à parte e sirva por cima."]', NULL, 1, '2026-09-19T15:38:49.371Z');
COMMIT;
PRAGMA foreign_keys = ON;
