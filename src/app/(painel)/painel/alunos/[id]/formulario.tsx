'use client';

import { useState, useTransition } from 'react';
import { PERFIS_TREINO, ROTULO_PERFIL } from '@/db/schema';
import { definirPerfil } from './acoes';
import { cn } from '@/lib/cn';

const DESCRICAO: Record<string, string> = {
  emagrecimento: 'Circuitos, maior gasto calórico e receitas de menor densidade energética.',
  hipertrofia: 'Divisão por grupo muscular, volume maior e receitas com mais proteína.',
  condicionamento: 'Treino geral, equilíbrio entre força e cardio.',
  saude: 'Baixo impacto, mobilidade e retomada segura do movimento.',
};

export function FormularioPerfil({
  alunoId, perfilAtual, observacoes,
}: {
  alunoId: number;
  perfilAtual: string | null;
  observacoes: string | null;
}) {
  const [pendente, iniciar] = useTransition();
  const [escolhido, setEscolhido] = useState(perfilAtual ?? '');
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);

  return (
    <form
      action={(dados) => iniciar(async () => {
        const r = await definirPerfil(alunoId, dados);
        setMsg(r?.erro
          ? { tipo: 'erro', texto: r.erro }
          : { tipo: 'ok', texto: 'Perfil atualizado. O app do aluno já reflete a mudança.' });
      })}
      className="space-y-5"
    >
      <fieldset>
        <legend className="t-eyebrow mb-3 text-bone-500">Perfil de treino</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {PERFIS_TREINO.map((p) => (
            <label
              key={p}
              className={cn(
                'cursor-pointer rounded-[3px] border p-4 transition-colors',
                escolhido === p
                  ? 'border-rise-500 bg-rise-500/10'
                  : 'border-ink-700 hover:border-ink-600',
              )}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="perfil"
                  value={p}
                  checked={escolhido === p}
                  onChange={() => setEscolhido(p)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-rise-500)]"
                />
                <span>
                  <span className="block font-display text-[0.85rem] font-bold uppercase tracking-wide text-bone-50">
                    {ROTULO_PERFIL[p]}
                  </span>
                  <span className="mt-1.5 block text-[0.75rem] leading-relaxed text-bone-500">
                    {DESCRICAO[p]}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="t-eyebrow block text-bone-500">Observações internas</span>
        <textarea
          name="observacoes"
          rows={3}
          defaultValue={observacoes ?? ''}
          placeholder="Restrições, lesões, orientações para a equipe…"
          className="mt-2 w-full rounded-[2px] border border-ink-600 bg-ink-900 px-3.5 py-3 text-[0.88rem] text-bone-50 placeholder:text-bone-600 focus:border-rise-500 focus:outline-none"
        />
        <span className="mt-1.5 block text-[0.68rem] text-bone-600">
          Visível apenas para a direção. O aluno não vê este campo.
        </span>
      </label>

      <button
        type="submit"
        disabled={pendente || !escolhido}
        className="rounded-[2px] bg-rise-500 px-7 py-3.5 font-display text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-rise-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pendente ? 'Salvando…' : 'Salvar perfil'}
      </button>

      {msg && (
        <p
          role="status"
          className={msg.tipo === 'ok' ? 'text-[0.8rem] text-rise-400' : 'text-[0.8rem] text-amber-300'}
        >
          {msg.texto}
        </p>
      )}
    </form>
  );
}
