/**
 * Marca conteúdo que ainda não foi assinado por um profissional.
 *
 * Treino e dieta são prescrição. Enquanto não houver um responsável técnico
 * (CREF para treino, CRN para nutrição), o aluno precisa saber que aquilo é
 * material de demonstração — não uma recomendação individual para ele.
 */
export function AvisoDemonstracao({ tipo }: { tipo: 'treino' | 'dieta' }) {
  return (
    <p className="rounded-[3px] border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-[0.75rem] leading-relaxed text-amber-200/90">
      <strong className="font-semibold">Modelo de demonstração.</strong>{' '}
      {tipo === 'treino'
        ? 'Este treino ainda não foi prescrito por um profissional para o seu caso. Procure a equipe da academia antes de executar.'
        : 'Estas receitas são sugestões gerais, não um plano alimentar individual. Procure um nutricionista para o seu caso.'}
    </p>
  );
}

/** Selo curto, para listas. */
export function SeloDemonstracao() {
  return (
    <span className="shrink-0 rounded-full border border-amber-500/40 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-amber-300/90">
      Demonstração
    </span>
  );
}
