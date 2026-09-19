'use client';

import { useState, useTransition } from 'react';
import { salvarProgramacao } from './acoes';

type Props = {
  metaMl: number;
  copoMl: number;
  lembretesAtivos: boolean;
  inicio: string;
  fim: string;
  intervalo: number;
  /** Meta sugerida pelo peso registrado, quando houver. */
  sugestaoMl: number | null;
};

const campo =
  'w-full rounded-[2px] border border-ink-600 bg-ink-900 px-3 py-3 text-[0.9rem] text-bone-50 transition-colors focus:border-rise-500 focus:outline-none';

export function Programacao(p: Props) {
  const [pendente, iniciar] = useTransition();
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);
  const [ligado, setLigado] = useState(p.lembretesAtivos);

  return (
    <form
      action={(dados) => iniciar(async () => {
        const r = await salvarProgramacao(dados);
        setMsg(r?.erro
          ? { tipo: 'erro', texto: r.erro }
          : { tipo: 'ok', texto: 'Programação salva.' });
      })}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="t-eyebrow block text-bone-500">Meta do dia (ml)</span>
          <input name="metaMl" type="number" defaultValue={p.metaMl} min={500} max={8000} step={50} required className={`mt-2 ${campo}`} />
        </label>
        <label className="block">
          <span className="t-eyebrow block text-bone-500">Seu copo (ml)</span>
          <input name="copoMl" type="number" defaultValue={p.copoMl} min={50} max={2000} step={10} required className={`mt-2 ${campo}`} />
        </label>
      </div>

      {p.sugestaoMl && (
        <p className="text-[0.72rem] leading-relaxed text-bone-500">
          Referência geral de {p.sugestaoMl} ml, calculada como 35 ml por quilo
          do seu peso registrado. É só um ponto de partida — clima, treino e
          condições de saúde mudam essa conta.
        </p>
      )}

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[3px] border border-ink-700 px-4 py-3.5">
        <span>
          <span className="block text-[0.85rem] text-bone-100">Lembretes</span>
          <span className="mt-0.5 block text-[0.7rem] text-bone-500">
            Avisos ao longo do dia para não esquecer
          </span>
        </span>
        <input
          name="lembretesAtivos"
          type="checkbox"
          checked={ligado}
          onChange={(e) => setLigado(e.target.checked)}
          className="h-5 w-5 shrink-0 accent-[var(--color-rise-500)]"
        />
      </label>

      <fieldset disabled={!ligado} className="grid grid-cols-2 gap-3 transition-opacity disabled:opacity-40 sm:grid-cols-3">
        <label className="block">
          <span className="t-eyebrow block text-bone-500">Das</span>
          <input name="inicio" type="time" defaultValue={p.inicio} className={`mt-2 ${campo}`} />
        </label>
        <label className="block">
          <span className="t-eyebrow block text-bone-500">Até</span>
          <input name="fim" type="time" defaultValue={p.fim} className={`mt-2 ${campo}`} />
        </label>
        <label className="col-span-2 block sm:col-span-1">
          <span className="t-eyebrow block text-bone-500">A cada (min)</span>
          <input name="intervalo" type="number" defaultValue={p.intervalo} min={15} max={480} step={15} className={`mt-2 ${campo}`} />
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-[2px] border border-ink-600 py-3.5 font-display text-[0.78rem] font-bold uppercase tracking-[0.12em] text-bone-100 transition-colors hover:border-rise-500 hover:text-rise-400 disabled:opacity-60"
      >
        {pendente ? 'Salvando…' : 'Salvar programação'}
      </button>

      {msg && (
        <p
          role="status"
          className={msg.tipo === 'ok'
            ? 'text-center text-[0.78rem] text-rise-400'
            : 'text-center text-[0.78rem] text-amber-300'}
        >
          {msg.texto}
        </p>
      )}
    </form>
  );
}
