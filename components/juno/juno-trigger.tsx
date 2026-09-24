'use client';

import {useEffect, useState} from 'react';
import {ChevronDown, X} from 'lucide-react';
import {Dialog} from 'radix-ui';
import {JunoAvatar} from './juno-avatar';

const HINT_KEY = 'soujunior:juno:dica-vista';
const HINT_DELAY_MS = 4_000;
const HINT_DURATION_MS = 9_000;

interface JunoTriggerProps {
  open: boolean;
  /** A pessoa demonstrou interesse (hover/foco/toque): hora de carregar o painel. */
  onIntent: () => void;
}

/** Botão flutuante do Juno, com o convite discreto da primeira visita na sessão. */
export function JunoTrigger({open, onIntent}: JunoTriggerProps) {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(HINT_KEY)) return;
    } catch {
      return;
    }
    const show = window.setTimeout(() => {
      setHint(true);
      try {
        sessionStorage.setItem(HINT_KEY, '1');
      } catch {
        // Sem storage, o convite só não é lembrado.
      }
    }, HINT_DELAY_MS);
    const hide = window.setTimeout(() => setHint(false), HINT_DELAY_MS + HINT_DURATION_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <div className="jn-launcher" data-open={open}>
      {hint && !open && (
        // Convite visual e passageiro; o nome acessível do botão já explica o Juno.
        <div className="jn-hint" aria-hidden="true">
          <p>
            <strong>Oi!</strong> Posso te ajudar a conhecer a SouJunior.
          </p>
          <button type="button" className="jn-hint__close" tabIndex={-1} onClick={() => setHint(false)}>
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <Dialog.Trigger
        className="jn-trigger"
        aria-label={open ? 'Minimizar o Juno' : 'Abrir o Juno, seu guia na SouJunior'}
        onPointerEnter={onIntent}
        onFocus={onIntent}
        onTouchStart={onIntent}
        onClick={() => setHint(false)}
      >
        <JunoAvatar size="lg" className="jn-trigger__juno" />
        <span className="jn-trigger__minimize" aria-hidden="true">
          <ChevronDown size={22} strokeWidth={2.5} />
        </span>
        <span className="jn-trigger__label" aria-hidden="true">
          Precisa de ajuda?
        </span>
      </Dialog.Trigger>
    </div>
  );
}
