'use client';

import {LoaderCircle, Mic, Send, X} from 'lucide-react';
import type {VoiceError, VoiceState} from '@/hooks/use-speech-recognition';

export const VOICE_ERROR_MESSAGES: Record<VoiceError, string> = {
  unsupported:
    'Seu navegador não oferece reconhecimento de voz aqui. Você ainda pode digitar sua pergunta para o Juno.',
  'not-allowed':
    'Não consegui acessar seu microfone. Você pode liberar a permissão nas configurações do navegador ou escrever sua dúvida abaixo.',
  'service-not-allowed':
    'O reconhecimento de voz está desativado neste navegador ou dispositivo. Você ainda pode escrever sua dúvida abaixo.',
  'audio-capture':
    'Não encontrei um microfone funcionando. Verifique se ele está conectado ou escreva sua dúvida abaixo.',
  'no-speech': 'Não consegui ouvir sua pergunta. Toque no microfone e tente novamente.',
  network:
    'O reconhecimento de voz deste navegador precisa de internet. Verifique sua conexão ou escreva sua dúvida.',
  language: 'Seu navegador não reconhece fala em português aqui. Você ainda pode escrever sua dúvida.',
  generic: 'Não consegui ouvir. Quer tentar novamente?',
};

const RETRYABLE: VoiceError[] = ['no-speech', 'network', 'generic', 'audio-capture'];

interface JunoVoiceStatusProps {
  state: VoiceState;
  interim: string;
  error: VoiceError | null;
  onCancel: () => void;
  onRestart: () => void;
  onSend: () => void;
  canSend: boolean;
}

/** Faixa acima do campo que mostra, sem ambiguidade, o que o microfone está fazendo. */
export function JunoVoiceStatus({state, interim, error, onCancel, onRestart, onSend, canSend}: JunoVoiceStatusProps) {
  if (state === 'idle') return null;

  if (state === 'requesting') {
    return (
      <div className="jn-voice" data-state={state}>
        <LoaderCircle className="jn-spin" size={18} aria-hidden="true" />
        <p className="jn-voice__text">Solicitando acesso ao microfone…</p>
        <button type="button" className="jn-voice__button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    );
  }

  if (state === 'listening') {
    return (
      <div className="jn-voice" data-state={state}>
        <span className="jn-live">
          <span className="jn-live__dot" aria-hidden="true" />
          Ouvindo
        </span>
        <p className="jn-voice__text">
          {interim ? <q>{interim}…</q> : 'Pode falar, estou ouvindo.'}
          <small>O áudio não é gravado: seu navegador transforma a fala em texto.</small>
        </p>
        <span className="jn-wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <button type="button" className="jn-voice__button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    );
  }

  if (state === 'review') {
    return (
      <div className="jn-voice" data-state={state}>
        <p className="jn-voice__text">Confira o que eu entendi antes de enviar.</p>
        <div className="jn-voice__actions">
          <button type="button" className="jn-voice__button" onClick={onRestart}>
            <Mic size={16} aria-hidden="true" />
            Refazer
          </button>
          <button type="button" className="jn-voice__button jn-voice__button--primary" onClick={onSend} disabled={!canSend}>
            <Send size={16} aria-hidden="true" />
            Enviar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="jn-voice" data-state={state}>
      <p className="jn-voice__text">{error ? VOICE_ERROR_MESSAGES[error] : VOICE_ERROR_MESSAGES.generic}</p>
      <div className="jn-voice__actions">
        {error && RETRYABLE.includes(error) && (
          <button type="button" className="jn-voice__button" onClick={onRestart}>
            <Mic size={16} aria-hidden="true" />
            Tentar de novo
          </button>
        )}
        <button type="button" className="jn-icon-btn jn-icon-btn--muted" aria-label="Fechar aviso" onClick={onCancel}>
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Frase curta para leitores de tela — não repete a transcrição parcial a cada palavra. */
export function voiceAnnouncement(state: VoiceState, error: VoiceError | null, transcript: string) {
  switch (state) {
    case 'requesting':
      return 'Solicitando acesso ao microfone.';
    case 'listening':
      return 'Ouvindo. Pode falar.';
    case 'review':
      return `Transcrição pronta: ${transcript}. Revise e envie.`;
    case 'error':
      return error ? VOICE_ERROR_MESSAGES[error] : VOICE_ERROR_MESSAGES.generic;
    default:
      return '';
  }
}
