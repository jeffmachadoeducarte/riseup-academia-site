import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** `wide` para composições que respiram até as bordas. */
  size?: 'default' | 'wide' | 'narrow';
};

const larguras = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[92rem]',
};

export function Container({ children, className, size = 'default' }: Props) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', larguras[size], className)}>
      {children}
    </div>
  );
}
