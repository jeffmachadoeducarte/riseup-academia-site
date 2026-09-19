'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMovimentoReduzido } from './useMovimentoReduzido';

export type EstadoVideo = {
  /** O vídeo está tocando. */
  tocando: boolean;
  /** Está mudo — porque o navegador barrou o áudio ou por escolha do visitante. */
  mudo: boolean;
  /** O navegador barrou o autoplay com som: cabe mostrar "ativar som". */
  somBloqueado: boolean;
  /** Liga/desliga o som. Só é chamado por clique, então sempre funciona. */
  alternarSom: () => void;
  /**
   * O visitante pediu movimento reduzido: nada toca sozinho. A interface
   * deve mostrar os controles nativos, senão ele fica sem como dar play.
   */
  semMovimento: boolean;
};

/**
 * Toca o vídeo enquanto ele está visível e pausa quando sai da tela.
 *
 * Sobre o áudio: nenhum navegador deixa um vídeo começar com som sem um gesto
 * do usuário, e não existe forma legítima de contornar isso — nem se deve
 * tentar. O caminho aqui é o honesto:
 *
 *   1. tenta tocar com som;
 *   2. se o navegador recusar, cai para mudo e sinaliza para a interface;
 *   3. a interface mostra um botão discreto de "ativar som";
 *   4. o clique é justamente o gesto que faltava, e o som entra.
 *
 * Fora da tela o vídeo pausa: vídeo rodando escondido gasta CPU e bateria à
 * toa. Quando o visitante volta, a escolha de áudio dele é respeitada.
 */
export function useVideoNaTela(
  ref: React.RefObject<HTMLVideoElement | null>,
  { limiar = 0.45 }: { limiar?: number } = {},
): EstadoVideo {
  const [tocando, setTocando] = useState(false);
  const [mudo, setMudo] = useState(true);
  const [somBloqueado, setSomBloqueado] = useState(false);
  const semMovimento = useMovimentoReduzido();

  // Guarda a decisão do visitante para não sobrescrevê-la a cada reentrada.
  const escolhaDoUsuario = useRef<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Movimento reduzido: nada começa sozinho; a interface mostra controles.
    if (semMovimento) return;

    let visivel = false;

    async function tentarTocar(v: HTMLVideoElement) {
      // Já escolheu antes? Respeita. Senão, tenta com som na primeira vez.
      v.muted = escolhaDoUsuario.current ?? false;

      try {
        await v.play();
        setTocando(true);
        setMudo(v.muted);
        if (!v.muted) setSomBloqueado(false);
      } catch {
        // Recusou com som: repete mudo, que todo navegador permite.
        v.muted = true;
        setMudo(true);
        if (escolhaDoUsuario.current === null) setSomBloqueado(true);
        try {
          await v.play();
          setTocando(true);
        } catch {
          setTocando(false);
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        const v = ref.current;
        if (!v) return;

        if (entrada.isIntersecting && !visivel) {
          visivel = true;
          void tentarTocar(v);
        } else if (!entrada.isIntersecting && visivel) {
          visivel = false;
          v.pause();
          setTocando(false);
        }
      },
      { threshold: limiar },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, limiar, semMovimento]);

  const alternarSom = useCallback(() => {
    const v = ref.current;
    if (!v) return;

    const novoMudo = !v.muted;
    v.muted = novoMudo;
    escolhaDoUsuario.current = novoMudo;
    setMudo(novoMudo);
    setSomBloqueado(false);

    // O clique é o gesto que faltava: se estava parado, agora toca.
    if (v.paused) {
      v.play().then(() => setTocando(true)).catch(() => undefined);
    }
  }, [ref]);

  return { tocando, mudo, somBloqueado, alternarSom, semMovimento };
}
