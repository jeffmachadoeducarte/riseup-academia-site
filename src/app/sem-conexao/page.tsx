import type { Metadata } from 'next';
import { Triangulo } from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: 'Sem conexão',
  robots: { index: false, follow: false },
};

/**
 * Tela servida pelo service worker quando a navegação falha.
 *
 * Não depende de sessão nem de banco: é pré-cacheada no install do SW e
 * precisa abrir com o aparelho totalmente offline.
 */
export default function SemConexao() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-ink-950 px-6 text-center">
      <div>
        <Triangulo className="mx-auto h-6 w-6 text-rise-500" />
        <h1 className="t-display mt-6 text-[clamp(1.75rem,7vw,2.5rem)] text-bone-50">
          Sem conexão
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-[0.88rem] leading-relaxed text-bone-400">
          Seu treino, seus pagamentos e seus dados ficam protegidos no servidor —
          por isso precisam de internet para abrir.
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[0.8rem] leading-relaxed text-bone-500">
          Assim que a conexão voltar, é só puxar a tela para atualizar.
        </p>
      </div>
    </main>
  );
}
