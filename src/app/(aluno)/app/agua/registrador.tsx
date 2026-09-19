'use client';

import { useState, useTransition } from 'react';
import { registrarAgua, desfazerUltimo } from './acoes';
import { cn } from '@/lib/cn';
import { IconGota } from '@/components/ui/Icons';

/**
 * Botões de registro rápido.
 *
 * O valor do copo vem da programação do aluno; os outros são atalhos comuns.
 * `useTransition` mantém a tela responsiva enquanto o servidor grava.
 */
export function Registrador({ copoMl }: { copoMl: number }) {
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const atalhos = [...new Set([copoMl, 200, 350, 500])].sort((a, b) => a - b);

  function registrar(ml: number) {
    setErro(null);
    iniciar(async () => {
      const r = await registrarAgua(ml);
      if (r?.erro) setErro(r.erro);
    });
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => registrar(copoMl)}
        disabled={pendente}
        className={cn(
          'flex w-full items-center justify-center gap-3 rounded-[3px] bg-rise-500 px-6 py-5',
          'font-display text-[0.9rem] font-bold uppercase tracking-[0.12em] text-white',
          'transition-all duration-200 active:scale-[0.98] disabled:opacity-60',
        )}
      >
        <IconGota className="h-5 w-5" />
        {pendente ? 'Registrando…' : `Bebi ${copoMl} ml`}
      </button>

      <div className="grid grid-cols-4 gap-2">
        {atalhos.map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => registrar(ml)}
            disabled={pendente}
            className="rounded-[3px] border border-ink-700 py-3 text-[0.78rem] font-semibold text-bone-200 transition-colors hover:border-rise-500 hover:text-rise-400 disabled:opacity-60"
          >
            +{ml}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => iniciar(async () => {
          setErro(null);
          const r = await desfazerUltimo();
          if (r?.erro) setErro(r.erro);
        })}
        disabled={pendente}
        className="w-full py-2 text-[0.75rem] text-bone-500 underline underline-offset-4 transition-colors hover:text-bone-300 disabled:opacity-60"
      >
        Desfazer último registro
      </button>

      {erro && (
        <p role="alert" className="text-center text-[0.78rem] text-rise-400">{erro}</p>
      )}
    </div>
  );
}
