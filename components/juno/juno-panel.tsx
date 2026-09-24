'use client';

import {useCallback, useEffect, useRef, useState, type Ref} from 'react';
import {Dialog} from 'radix-ui';
import type {SectionId} from '@/content/types';
import {useJunoChat} from '@/hooks/use-juno-chat';
import {useSpeechRecognition} from '@/hooks/use-speech-recognition';
import {useSpeechSynthesis} from '@/hooks/use-speech-synthesis';
import {useVisualViewportVars} from '@/hooks/use-visual-viewport';
import {INITIAL_SUGGESTIONS} from '@/lib/juno/answers';
import {draftStore} from '@/lib/juno/chat-session';
import {prefersReducedMotion, scrollToSection} from '@/lib/juno/page';
import type {JunoAction, JunoMessage as Message, JunoStatus} from '@/lib/juno/types';
import {JunoAvatar} from './juno-avatar';
import {JunoComposer} from './juno-composer';
import {JunoHeader} from './juno-header';
import {JunoMessage} from './juno-message';
import {JunoSuggestions} from './juno-suggestions';
import {JunoVoiceStatus, voiceAnnouncement} from './juno-voice-status';

type Mode = 'sheet' | 'floating';

interface JunoPanelProps {
  mode: Mode;
  onRequestClose: () => void;
}

const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches;

/**
 * Painel do Juno (chunk carregado sob demanda).
 * Desktop: painel flutuante não modal — a página continua navegável.
 * Mobile: bottom sheet modal, com rolagem da página travada.
 */
export default function JunoPanel(props: JunoPanelProps) {
  return (
    <Dialog.Portal>
      {props.mode === 'sheet' && <Dialog.Overlay className="jn-overlay" />}
      <JunoDialog {...props} />
    </Dialog.Portal>
  );
}

/** `ref` vem do Radix Presence, que observa a animação de saída do painel. */
function JunoDialog({mode, onRequestClose, ref}: JunoPanelProps & {ref?: Ref<HTMLDivElement>}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelClearRef = useRef<HTMLButtonElement>(null);
  const pendingSection = useRef<SectionId | null>(null);
  const scrolledOnce = useRef(false);
  const [text, setText] = useState(draftStore.get);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const updateText = useCallback((value: string) => {
    setText(value);
    draftStore.set(value);
  }, []);

  const voice = useSpeechRecognition({onTranscript: updateText});
  const tts = useSpeechSynthesis();
  const chat = useJunoChat(voice.supported);
  const [initialIds] = useState(() => new Set(chat.messages.map(({id}) => id)));
  useVisualViewportVars(mode === 'sheet');

  const listening = voice.state === 'listening' || voice.state === 'requesting';
  const status: JunoStatus = listening
    ? voice.interim
      ? 'transcribing'
      : 'listening'
    : chat.pending
      ? 'thinking'
      : tts.speakingId
        ? 'speaking'
        : voice.state === 'error'
          ? 'error'
          : 'idle';
  const lastMessage = chat.messages[chat.messages.length - 1];
  const lastJunoId = chat.messages.findLast(({role}) => role === 'assistant')?.id ?? 'welcome';
  // Continuações da última resposta têm prioridade, inclusive numa mensagem de
  // contexto aberta de fora do chat (ex.: resultado do "Descubra seu lugar").
  const lastFollowUps = !chat.pending && lastMessage.role === 'assistant' ? lastMessage.followUps : undefined;
  const chips = lastFollowUps?.length
    ? lastFollowUps
    : chat.questionCount === 0
      ? INITIAL_SUGGESTIONS
      : [];

  // Mostra o começo de cada resposta nova (ou o fim da conversa enquanto o Juno pensa).
  useEffect(() => {
    const scroller = scrollRef.current;
    const last = scroller?.querySelector<HTMLElement>('.jn-log > .jn-msg:last-child');
    if (!scroller || !last) return;
    const bottom = scroller.scrollHeight - scroller.clientHeight;
    const top = chat.pending || lastMessage.role === 'user' ? bottom : Math.min(last.offsetTop - 12, bottom);
    scroller.scrollTo({top, behavior: scrolledOnce.current && !prefersReducedMotion() ? 'smooth' : 'auto'});
    scrolledOnce.current = true;
  }, [lastMessage.id, lastMessage.role, chat.pending]);

  useEffect(() => {
    if (confirmingClear) cancelClearRef.current?.focus();
  }, [confirmingClear]);

  const focusInputOnDesktop = () => {
    if (hasFinePointer()) inputRef.current?.focus();
  };

  function submit(value: string) {
    if (!value.trim() || chat.pending) return;
    if (voice.state !== 'idle') voice.cancel();
    tts.stop();
    void chat.send(value);
    updateText('');
  }

  function toggleMic() {
    if (listening) return voice.stop();
    tts.stop(); // o microfone não pode ouvir a própria voz do Juno
    void voice.start();
  }

  function redoVoice() {
    updateText('');
    tts.stop();
    void voice.start();
  }

  function handleAction(action: JunoAction, message: Message) {
    switch (action.type) {
      case 'scroll':
        if (mode === 'sheet') {
          // Fecha o sheet primeiro; a rolagem acontece quando a página é liberada.
          pendingSection.current = action.target;
          onRequestClose();
        } else {
          scrollToSection(action.target);
        }
        return;
      case 'contact':
        return chat.requestContact(message.id);
      case 'retry':
        return void chat.retry();
      case 'rephrase':
        return inputRef.current?.focus();
      case 'voice':
        return toggleMic();
      case 'link':
        return;
    }
  }

  function requestClear() {
    // Só pede confirmação quando há uma conversa de verdade a perder.
    if (chat.questionCount >= 2) return setConfirmingClear(true);
    clearNow();
  }

  function clearNow() {
    chat.clear();
    tts.stop();
    voice.cancel();
    updateText('');
    setConfirmingClear(false);
    focusInputOnDesktop();
  }

  return (
    <Dialog.Content
      ref={ref}
      className="jn-panel"
      data-mode={mode}
      onOpenAutoFocus={(event) => {
        // Desktop: direto ao campo. Toque: foco no painel, sem abrir o teclado virtual.
        event.preventDefault();
        if (hasFinePointer()) inputRef.current?.focus();
        else inputRef.current?.closest<HTMLElement>('.jn-panel')?.focus();
      }}
      onCloseAutoFocus={(event) => {
        const target = pendingSection.current;
        if (!target) return; // padrão do Radix: foco volta ao botão do Juno
        event.preventDefault();
        pendingSection.current = null;
        requestAnimationFrame(() => scrollToSection(target));
      }}
      onEscapeKeyDown={(event) => {
        if (!listening) return;
        event.preventDefault(); // Esc primeiro para a escuta; um segundo Esc fecha
        voice.cancel();
      }}
      onInteractOutside={mode === 'floating' ? (event) => event.preventDefault() : undefined}
    >
      <JunoHeader
        status={status}
        avatarKey={lastJunoId}
        listening={listening}
        canClear={chat.questionCount > 0}
        onClear={requestClear}
        onClose={draftStore.clear}
      />

      {confirmingClear && (
        <div className="jn-confirm" role="group" aria-labelledby="jn-confirm-text">
          <p id="jn-confirm-text">Limpar a conversa? As mensagens desta sessão serão apagadas.</p>
          <div className="jn-voice__actions">
            <button type="button" ref={cancelClearRef} className="jn-voice__button" onClick={() => setConfirmingClear(false)}>
              Cancelar
            </button>
            <button type="button" className="jn-voice__button jn-voice__button--primary" onClick={clearNow}>
              Limpar
            </button>
          </div>
        </div>
      )}

      <div className="jn-scroll" ref={scrollRef}>
        <div className="jn-log" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversa com o Juno">
          {chat.messages.map((message) => (
            <JunoMessage
              key={message.id}
              message={message}
              fresh={!initialIds.has(message.id)}
              voiceInput={voice.supported}
              speech={{
                supported: tts.supported,
                speaking: tts.speakingId === message.id,
                toggle: (item) => (tts.speakingId === item.id ? tts.stop() : tts.speak(item.id, item.content)),
              }}
              onAction={handleAction}
            />
          ))}
        </div>

        {chat.pending && (
          <div className="jn-thinking" role="status">
            <JunoAvatar size="sm" status="thinking" className="jn-msg__avatar" />
            <span className="jn-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="jn-thinking__text">{chat.slow ? 'Ainda estou pensando…' : 'Juno está pensando…'}</span>
          </div>
        )}

        <JunoSuggestions
          items={chips}
          label={chat.questionCount === 0 ? 'Perguntas sugeridas' : 'Continuar a conversa'}
          disabled={chat.pending}
          onPick={submit}
        />
      </div>

      <div className="jn-footer">
        <JunoVoiceStatus
          state={voice.state}
          interim={voice.interim}
          error={voice.error}
          canSend={text.trim().length > 0 && !chat.pending}
          onCancel={voice.cancel}
          onRestart={redoVoice}
          onSend={() => submit(text)}
        />
        <JunoComposer
          text={text}
          onTextChange={updateText}
          onSubmit={() => submit(text)}
          pending={chat.pending}
          inputRef={inputRef}
          voice={{supported: voice.supported, state: voice.state}}
          onMicClick={toggleMic}
        />
        <p className="jn-disclaimer">
          Evite enviar dados pessoais ou sensíveis. O Juno pode cometer erros — para informações importantes, consulte
          os canais oficiais da SouJunior.
        </p>
        <p className="sr-only" aria-live="polite">
          {voiceAnnouncement(voice.state, voice.error, voice.transcript)}
        </p>
      </div>
    </Dialog.Content>
  );
}
