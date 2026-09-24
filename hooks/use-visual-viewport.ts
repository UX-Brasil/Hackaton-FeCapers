import {useEffect} from 'react';

/**
 * Publica a área realmente visível (descontando o teclado virtual) nas
 * variáveis CSS `--jn-vv-height` e `--jn-vv-top` da raiz do documento.
 * `100dvh` não desconta o teclado no iOS nem no Android; o painel mobile do
 * Juno usa estas medidas para manter o campo de texto sempre à vista.
 */
export function useVisualViewportVars(enabled: boolean) {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!enabled || !viewport) return;
    const root = document.documentElement;

    const update = () => {
      root.style.setProperty('--jn-vv-height', `${viewport.height}px`);
      root.style.setProperty('--jn-vv-top', `${viewport.offsetTop}px`);
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      root.style.removeProperty('--jn-vv-height');
      root.style.removeProperty('--jn-vv-top');
    };
  }, [enabled]);
}
