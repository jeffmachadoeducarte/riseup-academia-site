import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { ROTULO_PERFIL, PERFIS_TREINO } from '@/db/schema';
import { exigirPerfil } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Conteúdo' };

export default async function Conteudo() {
  await exigirPerfil('master');

  const [treinos, receitas] = await Promise.all([
    db.query.treinos.findMany({ orderBy: schema.treinos.ordem }),
    db.query.receitas.findMany(),
  ]);

  const semAssinatura = [...treinos, ...receitas].filter((c) => !c.assinadoPor).length;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="t-display text-[2rem] text-bone-50">Conteúdo</h1>
        <p className="mt-1.5 max-w-2xl text-[0.88rem] leading-relaxed text-bone-400">
          Treinos e receitas que o app mostra, separados por perfil.
        </p>
      </header>

      {semAssinatura > 0 && (
        <div className="rounded-[3px] border border-amber-500/35 bg-amber-500/10 p-5">
          <p className="font-display text-[0.85rem] font-bold uppercase tracking-wide text-amber-200">
            {semAssinatura} {semAssinatura === 1 ? 'item sem responsável técnico' : 'itens sem responsável técnico'}
          </p>
          <p className="mt-2 max-w-2xl text-[0.82rem] leading-relaxed text-amber-100/80">
            Treino e dieta são prescrição. Enquanto não houver um profissional
            (CREF para treino, CRN para nutrição) revisando e assinando, o app
            mostra esse conteúdo marcado como <strong>demonstração</strong>, com
            aviso visível ao aluno. Conteúdo assinado perde o aviso.
          </p>
        </div>
      )}

      {PERFIS_TREINO.map((perfil) => {
        const t = treinos.filter((x) => x.perfil === perfil);
        const r = receitas.filter((x) => x.perfil === perfil);
        if (t.length === 0 && r.length === 0) return null;

        return (
          <section key={perfil} className="rounded-[3px] border border-ink-700 bg-ink-850/50">
            <header className="border-b border-ink-800 px-6 py-4">
              <h2 className="font-display text-[0.95rem] font-bold uppercase tracking-wide text-rise-500">
                {ROTULO_PERFIL[perfil]}
              </h2>
              <p className="mt-1 text-[0.72rem] text-bone-500">
                {t.length} {t.length === 1 ? 'treino' : 'treinos'} · {r.length} {r.length === 1 ? 'receita' : 'receitas'}
              </p>
            </header>

            <div className="grid gap-px bg-ink-800 sm:grid-cols-2">
              <Coluna titulo="Treinos" itens={t.map((x) => ({ id: x.id, titulo: x.titulo, assinado: x.assinadoPor, publicado: x.publicado }))} />
              <Coluna titulo="Receitas" itens={r.map((x) => ({ id: x.id, titulo: x.titulo, assinado: x.assinadoPor, publicado: x.publicada }))} />
            </div>
          </section>
        );
      })}

      <p className="text-[0.75rem] leading-relaxed text-bone-500">
        A edição de treinos e receitas pelo painel entra na próxima etapa. Hoje o
        conteúdo é cadastrado pelo script <code className="text-bone-400">npm run semear</code>.
      </p>
    </div>
  );
}

function Coluna({
  titulo, itens,
}: {
  titulo: string;
  itens: { id: number; titulo: string; assinado: string | null; publicado: boolean }[];
}) {
  return (
    <div className="bg-ink-850/50 p-6">
      <p className="t-eyebrow mb-3.5 text-bone-500">{titulo}</p>
      {itens.length === 0 ? (
        <p className="text-[0.8rem] text-bone-600">Nada cadastrado.</p>
      ) : (
        <ul className="space-y-2.5">
          {itens.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[0.83rem] text-bone-200">{i.titulo}</span>
              <span className="shrink-0">
                {i.assinado ? (
                  <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-[0.58rem] uppercase tracking-wider text-emerald-300/90">
                    assinado
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-[0.58rem] uppercase tracking-wider text-amber-300/90">
                    demonstração
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
