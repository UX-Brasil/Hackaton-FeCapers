'use client';

import {ChevronDown, RotateCcw, X} from 'lucide-react';
import {Dialog} from 'radix-ui';
import type {JunoStatus} from '@/lib/juno/types';
import {JunoAvatar} from './juno-avatar';

interface JunoHeaderProps {
  status: JunoStatus;
  /** Remonta o avatar a cada resposta nova, para ele "reagir" uma vez. */
  avatarKey: string;
  listening: boolean;
  canClear: boolean;
  onClear: () => void;
  onClose: () => void;
}

export function JunoHeader({status, avatarKey, listening, canClear, onClear, onClose}: JunoHeaderProps) {
  return (
    <header className="jn-header">
      <JunoAvatar key={avatarKey} status={status} size="md" className="jn-header__juno" />
      <div className="jn-header__text">
        <Dialog.Title className="jn-title">Juno</Dialog.Title>
        <Dialog.Description className="jn-subtitle">Seu guia na SouJunior</Dialog.Description>
        <p className="jn-presence" data-live={listening || undefined}>
          <span className="jn-presence__dot" aria-hidden="true" />
          {listening ? 'Ouvindo' : 'Disponível'}
        </p>
      </div>
      <div className="jn-header__actions">
        <button type="button" className="jn-icon-btn" aria-label="Limpar conversa" title="Limpar conversa" disabled={!canClear} onClick={onClear}>
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <Dialog.Close className="jn-icon-btn" aria-label="Minimizar o Juno" title="Minimizar">
          <ChevronDown size={20} aria-hidden="true" />
        </Dialog.Close>
        <Dialog.Close className="jn-icon-btn" aria-label="Fechar o Juno" title="Fechar" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </Dialog.Close>
      </div>
    </header>
  );
}
