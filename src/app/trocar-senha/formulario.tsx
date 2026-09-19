'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { trocarSenha, type EstadoTroca } from './acoes';

const campo =
  'mt-2 w-full rounded-[2px] border border-ink-600 bg-ink-850 px-4 py-3.5 text-[0.95rem] text-bone-50 transition-colors focus:border-rise-500 focus:outline-none';

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-[2px] bg-rise-500 px-8 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-rise-400 disabled:opacity-60"
    >
      {pending ? 'Salvando…' : 'Salvar nova senha'}
    </button>
  );
}

export function Formulario() {
  const [estado, acao] = useActionState(trocarSenha, {} as EstadoTroca);

  return (
    <form action={acao} className="space-y-4">
      <label className="block">
        <span className="t-eyebrow block text-bone-400">Senha atual</span>
        <input name="atual" type="password" autoComplete="current-password" required className={campo} />
      </label>
      <label className="block">
        <span className="t-eyebrow block text-bone-400">Nova senha</span>
        <input name="nova" type="password" autoComplete="new-password" required minLength={8} className={campo} />
      </label>
      <label className="block">
        <span className="t-eyebrow block text-bone-400">Confirme a nova senha</span>
        <input name="confirmacao" type="password" autoComplete="new-password" required minLength={8} className={campo} />
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-[2px] border border-rise-700/60 bg-rise-700/15 px-4 py-3 text-[0.85rem] text-rise-400">
          {estado.erro}
        </p>
      )}

      <Botao />
    </form>
  );
}
