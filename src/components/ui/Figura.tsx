import { cn } from '@/lib/cn';

type Props = {
  /** Caminho base sem sufixo de tamanho, ex.: `/assets/images/estrutura-salao` */
  base: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  prioridade?: boolean;
  /**
   * Ponto focal do recorte (`object-position`).
   *
   * O material vem de um vídeo 9:16. Quando a célula é mais larga do que
   * alta, o recorte central cai no teto escuro do salão — por isso cada
   * imagem declara em que faixa vertical está o que interessa.
   */
  foco?: string;
};

/**
 * Imagem responsiva servida direto de `public/`, sem otimizador em runtime.
 *
 * O pipeline (`npm run media`) já gerou WebP e JPEG em 480w e 720w a partir
 * do vídeo original, então não há motivo para pagar o custo de CPU do
 * `next/image` no servidor — os arquivos são estáticos, imutáveis e servidos
 * com cache de um ano.
 */
export function Figura({
  base,
  alt,
  className,
  imgClassName,
  sizes = '(max-width: 768px) 100vw, 50vw',
  prioridade = false,
  foco,
}: Props) {
  return (
    // `h-full w-full` é obrigatório: sem altura no <picture>, o `h-full` do
    // <img> resolve para `auto`, a imagem sai no tamanho intrínseco e o
    // object-fit/object-position deixam de valer.
    <picture className={cn('block h-full w-full', className)}>
      <source
        type="image/webp"
        srcSet={`${base}-480.webp 480w, ${base}-720.webp 720w`}
        sizes={sizes}
      />
      <img
        src={`${base}-720.jpg`}
        srcSet={`${base}-480.jpg 480w, ${base}-720.jpg 720w`}
        sizes={sizes}
        alt={alt}
        width={720}
        height={1280}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding={prioridade ? 'sync' : 'async'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        style={foco ? { objectPosition: foco } : undefined}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </picture>
  );
}
