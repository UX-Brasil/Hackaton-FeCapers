'use client';

import {useLayoutEffect, type FormEvent, type KeyboardEvent, type RefObject} from 'react';
import {Mic, Send, Square} from 'lucide-react';
import type {VoiceState} from '@/hooks/use-speech-recognition';
import {JUNO_MAX_QUESTION_LENGTH} from '@/lib/juno/text';

const MAX_INPUT_HEIGHT = 128;
const COUNTER_FROM = JUNO_MAX_QUESTION_LENGTH - 200;

interface JunoComposerProps {
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  pending: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  voice: {supported: boolean; state: VoiceState};
  onMicClick: () => void;
}

/** Campo da pergunta: Enter envia, Shift+Enter quebra linha. Texto é sempre o caminho principal. */
export function JunoComposer({text, onTextChange, onSubmit, pending, inputRef, voice, onMicClick}: JunoComposerProps) {
  const listening = voice.state === 'listening' || voice.state === 'requesting';
  const canSend = text.trim().length > 0 && !pending;

  // Altura acompanha o conteúdo (inclusive quando a transcrição de voz preenche o campo).
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [text, inputRef]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSend) onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canSend) onSubmit();
  }

  return (
    <form className="jn-compose" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="jn-question">
        Sua pergunta para o Juno
      </label>
      <textarea
        ref={inputRef}
        id="jn-question"
        className="jn-input"
        rows={1}
        value={text}
        maxLength={JUNO_MAX_QUESTION_LENGTH}
        placeholder="Pergunte alguma coisa sobre a SouJunior..."
        enterKeyHint="send"
        autoComplete="off"
        onChange={(event) => onTextChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-describedby={text.length >= COUNTER_FROM ? 'jn-count' : undefined}
      />
      {text.length >= COUNTER_FROM && (
        <span id="jn-count" className="jn-count">
          {text.length}/{JUNO_MAX_QUESTION_LENGTH}
        </span>
      )}

      <button
        type="button"
        className="jn-mic"
        data-state={voice.supported ? voice.state : 'unsupported'}
        aria-label={listening ? 'Parar de ouvir' : 'Falar com o Juno usando o microfone'}
        aria-disabled={!voice.supported || undefined}
        title={voice.supported ? undefined : 'Reconhecimento de voz indisponível neste navegador'}
        onClick={onMicClick}
      >
        {listening ? <Square size={16} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
      </button>

      <button type="submit" className="jn-send" aria-label="Enviar pergunta" disabled={!canSend}>
        <Send size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
