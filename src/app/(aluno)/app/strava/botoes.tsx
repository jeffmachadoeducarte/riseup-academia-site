'use client';

import { useState, useTransition } from 'react';
import { sincronizarAgora, desconectarConta } from './acoes';

export function BotoesStrava() {
  const [pendente, iniciar] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pendente}
        onClick={() => iniciar(async () => {
          const r = await sincronizarAgora();
          setMsg(r?.erro ?? `${r?.quantidade ?? 0} atividades sincronizadas.`);
        })}
        className="w-full rounded-[2px] bg-rise-500 py-3.5 font-display text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-rise-400 disabled:opacity-60"
      >
        {pendente ? 'Sincronizando…' : 'Sincronizar agora'}
      </button>

      <button
        type="button"
        disabled={pendente}
        onClick={() => iniciar(async () => {
          await desconectarConta();
          setMsg('Conta desconectada.');
        })}
        className="w-full py-2 text-[0.75rem] text-bone-500 underline underline-offset-4 transition-colors hover:text-rise-400 disabled:opacity-60"
      >
        Desconectar minha conta do Strava
      </button>

      {msg && <p role="status" className="text-center text-[0.78rem] text-bone-400">{msg}</p>}
    </div>
  );
}
