/**
 * Dados de demonstração da Rise Up.
 *
 * Cria os acessos de teste, planos, aulas, treinos e receitas para a
 * apresentação ao cliente. Rode com `npm run semear`.
 *
 * ⚠️ Os treinos e receitas aqui são MODELOS de demonstração, sem assinatura
 * de profissional — por isso entram com `publicado: false` quando não houver
 * responsável técnico. Ver docs/pendencias-cliente.md.
 */
import { eq } from 'drizzle-orm';
import { abrirBanco } from '../src/db/conexao';
import * as schema from '../src/db/schema';
import { randomBytes, scrypt as _scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt) as (s: string, sal: Buffer, n: number) => Promise<Buffer>;

async function hash(senha: string) {
  const sal = randomBytes(16);
  const h = await scrypt(senha, sal, 64);
  return `scrypt$${sal.toString('hex')}$${h.toString('hex')}`;
}

const { db, sqlite } = abrirBanco();

/** Data ISO de N dias atrás. */
const diasAtras = (n: number) =>
  new Date(Date.now() - n * 864e5).toISOString();
const dia = (n: number) => diasAtras(n).slice(0, 10);

async function main() {
  console.log('\n═══ Semeando a Rise Up ═══\n');

  /* ---------------------------------------------------------- usuários */
  const CONTAS = [
    { nome: 'Direção Rise Up', email: 'master@riseup.test', senha: 'RiseUp@2026', perfil: 'master' as const },
    { nome: 'Lucas Ferreira', email: 'aluno@riseup.test', senha: 'Aluno@2026', perfil: 'aluno' as const },
  ];

  const ids: Record<string, number> = {};
  for (const c of CONTAS) {
    const existente = await db.query.usuarios.findFirst({ where: eq(schema.usuarios.email, c.email) });
    if (existente) {
      ids[c.email] = existente.id;
      console.log(`  · ${c.email} já existe`);
      continue;
    }
    const r = await db.insert(schema.usuarios).values({
      nome: c.nome, email: c.email, senhaHash: await hash(c.senha), perfil: c.perfil,
    }).returning({ id: schema.usuarios.id }).get();
    ids[c.email] = r.id;
    console.log(`  ✔ ${c.perfil.padEnd(6)} ${c.email}  senha: ${c.senha}`);
  }

  /* ------------------------------------------------------------ aluno */
  let aluno = await db.query.alunos.findFirst({
    where: eq(schema.alunos.usuarioId, ids['aluno@riseup.test']),
  });

  if (!aluno) {
    aluno = await db.insert(schema.alunos).values({
      usuarioId: ids['aluno@riseup.test'],
      telefone: '(47) 99999-0000',
      nascimento: '1995-04-12',
      genero: 'masculino',
      alturaCm: 178,
      pesoInicialG: 84_500,
      perfilTreino: 'hipertrofia',
      perfilDefinidoEm: diasAtras(40),
      perfilDefinidoPor: ids['master@riseup.test'],
      matriculaEm: dia(120),
      observacoes: 'Aluno de demonstração.',
    }).returning().get();
    console.log('  ✔ aluno de demonstração criado');
  }

  /* ----------------------------------------------------------- planos */
  const jaTemPlanos = await db.query.planos.findFirst();
  if (!jaTemPlanos) {
    await db.insert(schema.planos).values([
      { nome: 'Mensal', descricao: 'Acesso livre à musculação e ao cardio.', valorCentavos: 0, periodicidade: 'mensal', ordem: 1 },
      { nome: 'Trimestral', descricao: 'Três meses com acesso a todas as modalidades.', valorCentavos: 0, periodicidade: 'trimestral', ordem: 2 },
      { nome: 'Anual', descricao: 'Plano completo por doze meses.', valorCentavos: 0, periodicidade: 'anual', ordem: 3 },
    ]);
    // Valor 0 é proposital: a academia ainda não informou os preços.
    console.log('  ✔ planos criados (valores zerados — pendência do cliente)');
  }

  const plano = await db.query.planos.findFirst();

  /* ------------------------------------------------------- matrícula */
  const jaMatriculado = await db.query.matriculas.findFirst({
    where: eq(schema.matriculas.alunoId, aluno.id),
  });
  if (!jaMatriculado && plano) {
    await db.insert(schema.matriculas).values({
      alunoId: aluno.id, planoId: plano.id, inicio: dia(120), situacao: 'ativa',
    });
  }

  /* ------------------------------------------------------ pagamentos */
  const jaTemPag = await db.query.pagamentos.findFirst({
    where: eq(schema.pagamentos.alunoId, aluno.id),
  });
  if (!jaTemPag) {
    const hoje = new Date();
    const linhas = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 10);
      const competencia = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const vencimento = `${competencia}-10`;
      linhas.push({
        alunoId: aluno.id,
        valorCentavos: 0,
        competencia,
        vencimento,
        situacao: (i === 0 ? 'aberto' : 'pago') as 'aberto' | 'pago',
        pagoEm: i === 0 ? null : `${competencia}-08T12:00:00.000Z`,
        meio: i === 0 ? null : ('pix' as const),
      });
    }
    await db.insert(schema.pagamentos).values(linhas);
    console.log('  ✔ histórico de pagamentos criado');
  }

  /* ------------------------------------------------------------ aulas */
  const jaTemAulas = await db.query.aulas.findFirst();
  if (!jaTemAulas) {
    await db.insert(schema.aulas).values([
      { nome: 'Funcional', modalidade: 'Funcional', diaSemana: 1, horaInicio: '06:30', horaFim: '07:20', vagas: 20 },
      { nome: 'Muay Thai', modalidade: 'Lutas', diaSemana: 1, horaInicio: '19:00', horaFim: '20:00', vagas: 18 },
      { nome: 'Aula coletiva', modalidade: 'Coletivas', diaSemana: 2, horaInicio: '18:00', horaFim: '18:50', vagas: 25 },
      { nome: 'Funcional', modalidade: 'Funcional', diaSemana: 3, horaInicio: '06:30', horaFim: '07:20', vagas: 20 },
      { nome: 'Boxe', modalidade: 'Lutas', diaSemana: 3, horaInicio: '19:00', horaFim: '20:00', vagas: 18 },
      { nome: 'Aula coletiva', modalidade: 'Coletivas', diaSemana: 4, horaInicio: '18:00', horaFim: '18:50', vagas: 25 },
      { nome: 'Funcional', modalidade: 'Funcional', diaSemana: 5, horaInicio: '06:30', horaFim: '07:20', vagas: 20 },
    ]);
    console.log('  ✔ grade de aulas criada (⚠️ horários de demonstração)');
  }

  /* --------------------------------------------------------- check-ins */
  const jaTemCheckin = await db.query.checkins.findFirst({
    where: eq(schema.checkins.alunoId, aluno.id),
  });
  if (!jaTemCheckin) {
    // 38 treinos espalhados nos últimos 60 dias, com folga nos domingos.
    const linhas = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date(Date.now() - i * 864e5);
      if (d.getDay() === 0) continue;
      if (Math.random() < 0.35) continue;
      d.setHours(7, 15, 0, 0);
      linhas.push({ alunoId: aluno.id, em: d.toISOString(), origem: 'app' as const });
    }
    await db.insert(schema.checkins).values(linhas);
    console.log(`  ✔ ${linhas.length} check-ins de histórico`);
  }

  /* ------------------------------------------------------------- água */
  const jaTemMeta = await db.query.metasAgua.findFirst({
    where: eq(schema.metasAgua.alunoId, aluno.id),
  });
  if (!jaTemMeta) {
    await db.insert(schema.metasAgua).values({
      alunoId: aluno.id,
      metaDiariaMl: 2960,           // 35 ml/kg sobre 84,5 kg
      copoMl: 250,
      lembretesAtivos: true,
      lembreteInicio: '07:00',
      lembreteFim: '21:00',
      lembreteIntervaloMin: 90,
    });

    const linhas = [];
    for (let i = 0; i < 14; i++) {
      const d = dia(i);
      const copos = 6 + Math.floor(Math.random() * 6);
      for (let c = 0; c < copos; c++) {
        linhas.push({ alunoId: aluno.id, dia: d, ml: 250, em: `${d}T${String(8 + c).padStart(2, '0')}:00:00.000Z` });
      }
    }
    await db.insert(schema.registrosAgua).values(linhas);
    console.log('  ✔ meta e histórico de hidratação');
  }

  console.log('\n─────────────────────────────────────────────');
  console.log(' ACESSOS DE TESTE');
  console.log('─────────────────────────────────────────────');
  for (const c of CONTAS) {
    console.log(`  ${c.perfil.toUpperCase().padEnd(6)}  ${c.email}  /  ${c.senha}`);
  }
  console.log('─────────────────────────────────────────────\n');
}

main()
  .then(() => sqlite.close())
  .catch((e) => { console.error(e); sqlite.close(); process.exit(1); });
