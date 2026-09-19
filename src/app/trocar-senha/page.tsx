import type { Metadata } from 'next';
import { usuarioAtual } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Formulario } from './formulario';

export const metadata: Metadata = {
  title: 'Trocar senha',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function TrocarSenha() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect('/entrar');

  return (
    <main className="grid min-h-[100svh] place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-lg"><Logo /></div>

        <h1 className="t-display mt-8 text-[1.9rem] text-bone-50">Trocar senha</h1>
        <p className="mt-2.5 text-[0.85rem] leading-relaxed text-bone-400">
          {usuario.precisaTrocarSenha
            ? 'Sua senha é provisória. Escolha uma nova para continuar.'
            : 'Escolha uma nova senha para sua conta.'}
        </p>

        <div className="mt-8">
          <Formulario />
        </div>

        <p className="mt-6 text-[0.72rem] leading-relaxed text-bone-500">
          Ao salvar, as sessões abertas em outros aparelhos são encerradas.
        </p>
      </div>
    </main>
  );
}
