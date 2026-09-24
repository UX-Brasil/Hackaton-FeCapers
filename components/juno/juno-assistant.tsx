'use client';

import {lazy, Suspense, useCallback, useEffect, useState, useSyncExternalStore} from 'react';
import {Dialog} from 'radix-ui';
import {useMediaQuery} from '@/hooks/use-media-query';
import {JunoAvatar} from './juno-avatar';
import {JunoTrigger} from './juno-trigger';

/** Abaixo desta largura o Juno abre como bottom sheet modal. */
const SHEET_QUERY = '(max-width: 639.98px)';

// Chat, voz e base de conhecimento ficam num chunk separado, carregado
// quando o navegador está ocioso ou quando a pessoa demonstra interesse.
const loadPanel = () => import('./juno-panel');
const JunoPanel = lazy(loadPanel);

const noopSubscribe = () => () => {};

/**
 * Juno, o guia da SouJunior: botão flutuante + painel de conversa.
 * Não renderiza nada no servidor — depende de JavaScript para funcionar.
 */
export function JunoAssistant() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const sheet = useMediaQuery(SHEET_QUERY);
  const [open, setOpen] = useState(false);
  const [panelWanted, setPanelWanted] = useState(false);
  const wantPanel = useCallback(() => setPanelWanted(true), []);

  useEffect(() => {
    // Safari ainda não tem requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => void loadPanel(), {timeout: 8_000});
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => void loadPanel(), 4_000);
    return () => window.clearTimeout(id);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) setPanelWanted(true);
  }, []);

  if (!hydrated) return null;

  const mode = sheet ? 'sheet' : 'floating';

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange} modal={sheet}>
      <JunoTrigger open={open} onIntent={wantPanel} />
      {panelWanted && (
        <Suspense
          fallback={
            open ? (
              <div className="jn-loading" data-mode={mode} role="status">
                <JunoAvatar status="thinking" size="md" />
                <span>Abrindo o Juno…</span>
              </div>
            ) : null
          }
        >
          <JunoPanel mode={mode} onRequestClose={() => setOpen(false)} />
        </Suspense>
      )}
    </Dialog.Root>
  );
}
