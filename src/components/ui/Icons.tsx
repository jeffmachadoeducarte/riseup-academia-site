/**
 * Ícones desenhados à mão (stroke 1.5) — evita dependência de pacote de
 * ícones e mantém o bundle mínimo.
 */
type Props = { className?: string };

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconWhatsApp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function IconInstagram({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function IconPhone({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M22 16.9v2.5a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.6 2 2 0 0 1 4.1 1.4h2.5a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.7 9.2a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function IconPin({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M20 10.5c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.3" r="2.9" />
    </svg>
  );
}

export function IconClock({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function IconArrow({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M5 12h13M12.5 5.8 18.8 12l-6.3 6.2" />
    </svg>
  );
}

export function IconPlay({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M8 5.1v13.8c0 .8.9 1.3 1.6.9l11-6.9a1 1 0 0 0 0-1.7l-11-6.9A1 1 0 0 0 8 5.1Z" />
    </svg>
  );
}

export function IconClose({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconStar({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z" />
    </svg>
  );
}

export function IconUsuario({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M20 21v-1.8a4.2 4.2 0 0 0-4.2-4.2H8.2A4.2 4.2 0 0 0 4 19.2V21" />
      <circle cx="12" cy="7.3" r="4.1" />
    </svg>
  );
}

export function IconCompartilharIos({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M12 15.5V3.4M8.6 6.8 12 3.4l3.4 3.4" />
      <path d="M7 10.4H5.6A1.6 1.6 0 0 0 4 12v7a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 19v-7a1.6 1.6 0 0 0-1.6-1.6H17" />
    </svg>
  );
}

export function IconMaisQuadrado({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8.4v7.2M8.4 12h7.2" />
    </svg>
  );
}

export function IconBaixar({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M12 3.6v11.2M7.8 10.6 12 14.8l4.2-4.2" />
      <path d="M4 17.2v1.6A1.6 1.6 0 0 0 5.6 20.4h12.8a1.6 1.6 0 0 0 1.6-1.6v-1.6" />
    </svg>
  );
}

export function IconCheck({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="m4.8 12.6 4.6 4.6L19.2 7.4" />
    </svg>
  );
}

export function IconTresPontos({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

export function IconCasa({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M3.6 10.4 12 3.8l8.4 6.6V19a1.6 1.6 0 0 1-1.6 1.6H5.2A1.6 1.6 0 0 1 3.6 19Z" />
      <path d="M9.4 20.6v-6.4h5.2v6.4" />
    </svg>
  );
}

export function IconHalter({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M2.6 9.4v5.2M5.6 7.6v8.8M18.4 7.6v8.8M21.4 9.4v5.2M8.6 12h6.8" />
      <rect x="5.6" y="7.6" width="3" height="8.8" rx="1" />
      <rect x="15.4" y="7.6" width="3" height="8.8" rx="1" />
    </svg>
  );
}

export function IconGota({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M12 3.2s6 6.4 6 10.2a6 6 0 0 1-12 0C6 9.6 12 3.2 12 3.2Z" />
    </svg>
  );
}

export function IconPrato({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.2" />
    </svg>
  );
}

export function IconCalendario({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2" />
      <path d="M3.4 9.8h17.2M8.2 3.4v3.6M15.8 3.4v3.6" />
    </svg>
  );
}

export function IconCartao({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2" />
      <path d="M2.8 10h18.4M6.4 14.6h3.2" />
    </svg>
  );
}

export function IconSair({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M15 4.6h3.4A1.6 1.6 0 0 1 20 6.2v11.6a1.6 1.6 0 0 1-1.6 1.6H15" />
      <path d="M10.4 15.6 14 12l-3.6-3.6M14 12H4" />
    </svg>
  );
}

export function IconRaio({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.2 2 4.6 13.2h5.4L9.2 22l9-11.6h-5.6z" />
    </svg>
  );
}

export function IconCoracao({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M12 20.4s-7.4-4.6-7.4-9.6a4.1 4.1 0 0 1 7.4-2.4 4.1 4.1 0 0 1 7.4 2.4c0 5-7.4 9.6-7.4 9.6Z" />
      <path d="M3.6 13.2h3.2l1.4-2.4 2 4.4 1.6-3.2 1.2 1.2h3.4" />
    </svg>
  );
}

export function IconGrupo({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <circle cx="9" cy="8.4" r="3.1" />
      <path d="M3.4 19.6v-1a4 4 0 0 1 4-4h3.2a4 4 0 0 1 4 4v1" />
      <path d="M16.4 5.6a3.1 3.1 0 0 1 0 5.7M17.6 14.7a4 4 0 0 1 3 3.9v1" />
    </svg>
  );
}

export function IconLuva({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M6.4 10.2V7a3 3 0 0 1 3-3h4.2a4.4 4.4 0 0 1 4.4 4.4v3.3a4 4 0 0 1-1.2 2.9l-1 1v1.6H8.2v-1.8l-1-1a3.6 3.6 0 0 1-.8-2.2Z" />
      <path d="M8.2 17.2v1.6a1.6 1.6 0 0 0 1.6 1.6h5a1.6 1.6 0 0 0 1.6-1.6v-1.6M10.4 7.6v3" />
    </svg>
  );
}

export function IconSom({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M11 5.2 6.6 8.8H3.4v6.4h3.2L11 18.8Z" />
      <path d="M15.4 9.2a4 4 0 0 1 0 5.6M18.2 6.4a8 8 0 0 1 0 11.2" />
    </svg>
  );
}

export function IconSomMudo({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...traco}>
      <path d="M11 5.2 6.6 8.8H3.4v6.4h3.2L11 18.8Z" />
      <path d="m16 9.6 4.6 4.8M20.6 9.6 16 14.4" />
    </svg>
  );
}
