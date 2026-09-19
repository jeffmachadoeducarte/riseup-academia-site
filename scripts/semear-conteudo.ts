/**
 * Treinos e receitas de DEMONSTRAÇÃO, por perfil.
 *
 * ⚠️ LEIA ANTES DE PUBLICAR PARA ALUNOS DE VERDADE
 * Este conteúdo existe para a apresentação comercial funcionar com dados
 * plausíveis. Ele entra com `assinadoPor: null`, e o app marca todo conteúdo
 * sem assinatura como "modelo de demonstração", com aviso visível.
 *
 * Treino e dieta são prescrição: só viram conteúdo real depois que um
 * profissional da academia (CREF / CRN) revisar, ajustar e assinar. Ver
 * docs/pendencias-cliente.md.
 */
import { abrirBanco } from '../src/db/conexao';
import * as schema from '../src/db/schema';

type Perfil = (typeof schema.PERFIS_TREINO)[number];

const TREINOS: {
  titulo: string; resumo: string; perfil: Perfil; nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracaoMin: number; diasPorSemana: number;
  blocos: { bloco: string; exercicios: [string, string, string, number][] }[];
}[] = [
  {
    titulo: 'Full body iniciante',
    resumo: 'Corpo inteiro em cada sessão, três vezes por semana. Base para quem está voltando.',
    perfil: 'condicionamento', nivel: 'iniciante', duracaoMin: 50, diasPorSemana: 3,
    blocos: [{ bloco: 'A', exercicios: [
      ['Agachamento livre', '3', '10-12', 60],
      ['Supino reto com halteres', '3', '10-12', 60],
      ['Remada baixa', '3', '10-12', 60],
      ['Desenvolvimento sentado', '3', '10-12', 60],
      ['Prancha isométrica', '3', '30s', 45],
      ['Esteira em ritmo leve', '1', '10 min', 0],
    ]}],
  },
  {
    titulo: 'ABC de hipertrofia',
    resumo: 'Divisão em três treinos com foco em volume. Seis séries por grupo muscular na semana.',
    perfil: 'hipertrofia', nivel: 'intermediario', duracaoMin: 65, diasPorSemana: 6,
    blocos: [
      { bloco: 'A', exercicios: [
        ['Supino reto', '4', '8-10', 90],
        ['Supino inclinado com halteres', '3', '10-12', 75],
        ['Crucifixo na máquina', '3', '12-15', 60],
        ['Tríceps na polia', '4', '10-12', 60],
        ['Tríceps francês', '3', '12', 60],
      ]},
      { bloco: 'B', exercicios: [
        ['Puxada alta frente', '4', '8-10', 90],
        ['Remada curvada', '4', '8-10', 90],
        ['Remada unilateral', '3', '10-12', 75],
        ['Rosca direta', '4', '10-12', 60],
        ['Rosca martelo', '3', '12', 60],
      ]},
      { bloco: 'C', exercicios: [
        ['Agachamento livre', '4', '8-10', 120],
        ['Leg press 45°', '4', '10-12', 90],
        ['Cadeira extensora', '3', '12-15', 60],
        ['Mesa flexora', '3', '12-15', 60],
        ['Panturrilha em pé', '4', '15-20', 45],
      ]},
    ],
  },
  {
    titulo: 'Circuito para emagrecimento',
    resumo: 'Força e cardio no mesmo treino, com pouco descanso, para manter o gasto calórico alto.',
    perfil: 'emagrecimento', nivel: 'iniciante', duracaoMin: 45, diasPorSemana: 4,
    blocos: [{ bloco: 'A', exercicios: [
      ['Agachamento com peso corporal', '4', '15', 30],
      ['Remada na máquina', '4', '12', 30],
      ['Flexão de braço (apoio no banco)', '4', '10-12', 30],
      ['Afundo alternado', '4', '12 por perna', 30],
      ['Corda naval', '4', '30s', 30],
      ['Assault bike', '1', '12 min', 0],
    ]}],
  },
  {
    titulo: 'Mobilidade e condicionamento leve',
    resumo: 'Sessão de baixo impacto para retomar o movimento com segurança.',
    perfil: 'saude', nivel: 'iniciante', duracaoMin: 40, diasPorSemana: 3,
    blocos: [{ bloco: 'A', exercicios: [
      ['Caminhada na esteira', '1', '12 min', 0],
      ['Agachamento na cadeira', '3', '12', 60],
      ['Remada sentada leve', '3', '12', 60],
      ['Elevação lateral leve', '3', '12-15', 45],
      ['Alongamento de cadeia posterior', '3', '30s', 30],
      ['Respiração diafragmática', '3', '1 min', 30],
    ]}],
  },
];

const RECEITAS: {
  titulo: string; resumo: string; perfil: Perfil;
  refeicao: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'pre-treino' | 'pos-treino';
  tempoMin: number; calorias: number; proteinaG: number; carboidratoG: number; gorduraG: number;
  ingredientes: string[]; preparo: string[];
}[] = [
  {
    titulo: 'Omelete de claras com aveia', resumo: 'Proteína e carboidrato de digestão lenta para começar o dia.',
    perfil: 'hipertrofia', refeicao: 'cafe', tempoMin: 12, calorias: 380, proteinaG: 32, carboidratoG: 34, gorduraG: 11,
    ingredientes: ['4 claras de ovo', '1 ovo inteiro', '3 colheres de sopa de aveia em flocos', '1 pitada de sal', 'Cebolinha a gosto', '1 fio de azeite'],
    preparo: ['Bata as claras com o ovo inteiro e misture a aveia.', 'Tempere com sal e cebolinha.', 'Aqueça a frigideira com o azeite em fogo médio.', 'Despeje a mistura e cozinhe 3 a 4 minutos de cada lado.'],
  },
  {
    titulo: 'Frango grelhado com batata-doce', resumo: 'Clássico do pós-treino: proteína magra com carboidrato de índice moderado.',
    perfil: 'hipertrofia', refeicao: 'pos-treino', tempoMin: 30, calorias: 520, proteinaG: 45, carboidratoG: 52, gorduraG: 12,
    ingredientes: ['180 g de peito de frango', '200 g de batata-doce', '1 colher de sopa de azeite', 'Alho, páprica, sal e pimenta', 'Brócolis a gosto'],
    preparo: ['Cozinhe a batata-doce em água até ficar macia.', 'Tempere o frango e grelhe 6 minutos de cada lado.', 'Cozinhe o brócolis no vapor por 5 minutos.', 'Monte o prato e finalize com o azeite.'],
  },
  {
    titulo: 'Salada de grão-de-bico', resumo: 'Saciedade com pouca caloria, boa para o almoço de quem está em déficit.',
    perfil: 'emagrecimento', refeicao: 'almoco', tempoMin: 15, calorias: 320, proteinaG: 16, carboidratoG: 38, gorduraG: 10,
    ingredientes: ['1 xícara de grão-de-bico cozido', 'Tomate-cereja', 'Pepino em cubos', 'Cebola roxa', 'Salsinha', 'Suco de 1 limão', '1 colher de chá de azeite'],
    preparo: ['Escorra e lave o grão-de-bico.', 'Pique os vegetais em cubos pequenos.', 'Misture tudo e tempere com limão, azeite e sal.', 'Deixe 10 minutos na geladeira antes de servir.'],
  },
  {
    titulo: 'Panqueca de banana e aveia', resumo: 'Lanche rápido, sem açúcar adicionado.',
    perfil: 'emagrecimento', refeicao: 'lanche', tempoMin: 10, calorias: 240, proteinaG: 9, carboidratoG: 40, gorduraG: 5,
    ingredientes: ['1 banana madura', '1 ovo', '3 colheres de sopa de aveia', 'Canela a gosto'],
    preparo: ['Amasse a banana e misture com o ovo e a aveia.', 'Aqueça a frigideira antiaderente.', 'Despeje a massa e doure 2 minutos de cada lado.', 'Finalize com canela.'],
  },
  {
    titulo: 'Bowl de iogurte com frutas', resumo: 'Café da manhã leve, com proteína e fibra.',
    perfil: 'saude', refeicao: 'cafe', tempoMin: 5, calorias: 290, proteinaG: 18, carboidratoG: 36, gorduraG: 7,
    ingredientes: ['200 g de iogurte natural', '1 colher de sopa de aveia', 'Frutas vermelhas', '1 colher de chá de mel', 'Castanhas picadas'],
    preparo: ['Coloque o iogurte na tigela.', 'Adicione a aveia e as frutas.', 'Finalize com mel e castanhas.'],
  },
  {
    titulo: 'Sopa de legumes com frango desfiado', resumo: 'Jantar leve e quente, fácil de preparar em quantidade.',
    perfil: 'saude', refeicao: 'jantar', tempoMin: 35, calorias: 300, proteinaG: 26, carboidratoG: 28, gorduraG: 8,
    ingredientes: ['150 g de frango desfiado', 'Abobrinha, cenoura e chuchu', '1 batata pequena', 'Alho e cebola', 'Sal e ervas'],
    preparo: ['Refogue alho e cebola.', 'Junte os legumes em cubos e cubra com água.', 'Cozinhe 20 minutos.', 'Acrescente o frango desfiado e ajuste o sal.'],
  },
  {
    titulo: 'Banana com pasta de amendoim', resumo: 'Energia rápida antes do treino, sem pesar no estômago.',
    perfil: 'condicionamento', refeicao: 'pre-treino', tempoMin: 3, calorias: 230, proteinaG: 7, carboidratoG: 30, gorduraG: 9,
    ingredientes: ['1 banana', '1 colher de sopa de pasta de amendoim integral'],
    preparo: ['Corte a banana ao meio.', 'Espalhe a pasta de amendoim.', 'Consuma de 30 a 45 minutos antes do treino.'],
  },
  {
    titulo: 'Arroz integral com ovos e legumes', resumo: 'Refeição completa e barata para o dia a dia.',
    perfil: 'condicionamento', refeicao: 'almoco', tempoMin: 25, calorias: 460, proteinaG: 22, carboidratoG: 58, gorduraG: 14,
    ingredientes: ['1 xícara de arroz integral cozido', '2 ovos', 'Cenoura e vagem', 'Alho', '1 colher de sopa de azeite', 'Sal e pimenta'],
    preparo: ['Refogue o alho no azeite.', 'Junte os legumes picados e refogue 8 minutos.', 'Misture o arroz.', 'Faça os ovos à parte e sirva por cima.'],
  },
];

async function main() {
  const { db, sqlite } = abrirBanco();

  const existe = await db.query.treinos.findFirst();
  if (existe) {
    console.log('  · conteúdo já semeado');
    sqlite.close();
    return;
  }

  for (const [i, t] of TREINOS.entries()) {
    const treino = await db.insert(schema.treinos).values({
      titulo: t.titulo, resumo: t.resumo, perfil: t.perfil, nivel: t.nivel,
      duracaoMin: t.duracaoMin, diasPorSemana: t.diasPorSemana,
      assinadoPor: null,   // ← sem responsável técnico: o app avisa
      publicado: true,
      ordem: i,
    }).returning({ id: schema.treinos.id }).get();

    const linhas = t.blocos.flatMap((b) =>
      b.exercicios.map(([nome, series, repeticoes, descansoSeg], ordem) => ({
        treinoId: treino.id, bloco: b.bloco, nome, series, repeticoes, descansoSeg, ordem,
      })),
    );
    await db.insert(schema.exerciciosTreino).values(linhas);
  }
  console.log(`  ✔ ${TREINOS.length} treinos de demonstração`);

  await db.insert(schema.receitas).values(RECEITAS.map((r) => ({
    titulo: r.titulo, resumo: r.resumo, perfil: r.perfil, refeicao: r.refeicao,
    tempoMin: r.tempoMin, porcoes: 1, calorias: r.calorias,
    proteinaG: r.proteinaG, carboidratoG: r.carboidratoG, gorduraG: r.gorduraG,
    ingredientes: JSON.stringify(r.ingredientes),
    preparo: JSON.stringify(r.preparo),
    assinadoPor: null,
    publicada: true,
  })));
  console.log(`  ✔ ${RECEITAS.length} receitas de demonstração`);
  console.log('  ⚠️  conteúdo SEM assinatura profissional — o app marca como demonstração');

  sqlite.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
