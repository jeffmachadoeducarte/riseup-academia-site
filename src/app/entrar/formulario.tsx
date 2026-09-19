'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { entrar, type EstadoEntrar } from './acoes';
import { IconArrow } from '@/components/ui/Icons';

const inicial: EstadoEntrar = {};

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-rise-500 px-8 py-4 font-display text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-rise-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Entrando…' : 'Entrar'}
      {!pending && (
        <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </button>
  );
}

export function FormularioEntrar() {
  const [estado, acao] = useActionState(entrar, inicial);

  return (
    <form action={acao} className="space-y-5">
      <div>
        <label htmlFor="email" className="t-eyebrow block text-bone-400">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="voce@email.com"
          className="mt-2.5 w-full rounded-[2px] border border-ink-600 bg-ink-850 px-4 py-3.5 text-[0.95rem] text-bone-50 placeholder:text-bone-500 transition-colors focus:border-rise-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="senha" className="t-eyebrow block text-bone-400">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="mt-2.5 w-full rounded-[2px] border border-ink-600 bg-ink-850 px-4 py-3.5 text-[0.95rem] text-bone-50 placeholder:text-bone-500 transition-colors focus:border-rise-500 focus:outline-none"
        />
      </div>

      {estado.erro && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-[2px] border border-rise-700/60 bg-rise-700/15 px-4 py-3 text-[0.85rem] text-rise-400"
        >
          {estado.erro}
        </p>
      )}

      <Botao />
    </form>
  );
}
