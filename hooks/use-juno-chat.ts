import {useCallback, useMemo, useSyncExternalStore} from 'react';
import {
  clearConversation,
  createWelcome,
  getServerSnapshot,
  getSnapshot,
  retryLastQuestion,
  sendQuestion,
  showContactCard,
  subscribe,
} from '@/lib/juno/chat-session';
import {getCurrentSection} from '@/lib/juno/page';

/** Conversa do Juno na sessão atual. `voiceInput` ajusta as mensagens que citam o microfone. */
export function useJunoChat(voiceInput: boolean) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const welcome = useMemo(() => createWelcome(voiceInput), [voiceInput]);
  const messages = snapshot.messages.length > 0 ? snapshot.messages : [welcome];

  const context = useCallback(() => ({currentSection: getCurrentSection(), voiceInput}), [voiceInput]);
  const send = useCallback((text: string) => sendQuestion(text, context(), {welcome}), [context, welcome]);
  const retry = useCallback(() => retryLastQuestion(context(), welcome), [context, welcome]);

  return {
    messages,
    pending: snapshot.pending,
    slow: snapshot.slow,
    /** Quantas perguntas a pessoa já fez nesta sessão. */
    questionCount: snapshot.messages.filter(({role}) => role === 'user').length,
    send,
    retry,
    requestContact: showContactCard,
    clear: clearConversation,
  };
}
