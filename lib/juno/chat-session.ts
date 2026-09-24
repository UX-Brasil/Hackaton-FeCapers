import * as answers from './answers';
import {junoConfig} from './config';
import {createJunoProvider} from './provider';
import {JUNO_MAX_QUESTION_LENGTH, redactSensitive} from './text';
import type {JunoMessage, JunoProvider, JunoRequestContext, JunoResponse} from './types';

/**
 * Sessão de conversa do Juno.
 *
 * Fica fora dos componentes: o painel pode fechar e reabrir (ou ser
 * desmontado no meio de uma resposta) sem perder a conversa nem atualizar
 * estado de componente desmontado. O histórico dura só a sessão do navegador
 * (sessionStorage) e nunca guarda áudio.
 */

export interface ChatSnapshot {
  messages: JunoMessage[];
  pending: boolean;
  /** A resposta está demorando mais que o normal. */
  slow: boolean;
}

const STORAGE_KEY = 'soujunior:juno:conversa';
const MAX_STORED_MESSAGES = 40;
const EMPTY: ChatSnapshot = {messages: [], pending: false, slow: false};

let snapshot: ChatSnapshot | null = null;
let inFlight: AbortController | null = null;
let provider: JunoProvider | null = null;
let draft = '';
let sequence = 0;
const listeners = new Set<() => void>();

function isStoredMessage(value: unknown): value is JunoMessage {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Partial<JunoMessage>;
  return (
    typeof message.id === 'string' &&
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    typeof message.createdAt === 'number'
  );
}

function restore(): JunoMessage[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isStoredMessage) : [];
  } catch {
    return [];
  }
}

function persist(messages: JunoMessage[]) {
  try {
    if (messages.length === 0) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  } catch {
    // Armazenamento indisponível (modo privado, cota): a conversa segue só em memória.
  }
}

export function getSnapshot(): ChatSnapshot {
  snapshot ??= {...EMPTY, messages: typeof window === 'undefined' ? [] : restore()};
  return snapshot;
}

export function getServerSnapshot() {
  return EMPTY;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function update(patch: Partial<ChatSnapshot>) {
  const previous = getSnapshot();
  snapshot = {...previous, ...patch};
  if (patch.messages && patch.messages !== previous.messages) persist(snapshot.messages);
  listeners.forEach((listener) => listener());
}

const createId = () => `${Date.now().toString(36)}-${(sequence++).toString(36)}`;

export function createWelcome(voiceInput: boolean): JunoMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    kind: 'welcome',
    createdAt: Date.now(),
    content: [
      'Oi! Eu sou o Juno 👋',
      'Posso te ajudar a conhecer melhor a SouJunior, descobrir qual área combina com o que você busca ou explicar como participar da comunidade.',
      voiceInput
        ? 'Você pode escrever ou tocar no microfone para falar comigo.'
        : 'É só escrever sua dúvida no campo abaixo.',
    ].join('\n\n'),
  };
}

function toAssistantMessage(response: JunoResponse, question: string): JunoMessage {
  return {
    id: createId(),
    role: 'assistant',
    content: response.answer,
    createdAt: Date.now(),
    kind: response.kind,
    intent: response.intent,
    actions: response.actions,
    followUps: response.followUps,
    contact: response.requiresHumanSupport ? {question} : undefined,
  };
}

/** Última pergunta da pessoa antes de `index` (a dúvida que vai para a equipe). */
function questionBefore(messages: JunoMessage[], index = messages.length) {
  return messages
    .slice(0, index)
    .reverse()
    .find(({role}) => role === 'user')?.content;
}

interface SendOptions {
  welcome: JunoMessage;
  /** false ao tentar de novo: a pergunta já está na conversa. */
  echo?: boolean;
}

export async function sendQuestion(text: string, context: JunoRequestContext, {welcome, echo = true}: SendOptions) {
  const question = text.trim().slice(0, JUNO_MAX_QUESTION_LENGTH);
  const current = getSnapshot();
  if (!question || current.pending) return false;

  const history = current.messages.length > 0 ? current.messages : [welcome];
  const shown = redactSensitive(question);
  update({
    messages: echo ? [...history, {id: createId(), role: 'user', content: shown, createdAt: Date.now()}] : history,
    pending: true,
    slow: false,
  });
  if (echo) draft = '';

  const request = new AbortController();
  inFlight = request;
  const slowTimer = setTimeout(() => {
    if (inFlight === request) update({slow: true});
  }, junoConfig.slowReplyMs);
  const startedAt = Date.now();
  provider ??= createJunoProvider();

  try {
    const response = await provider.sendMessage({question, history, context}, {signal: request.signal});
    const wait = junoConfig.localReplyDelayMs - (Date.now() - startedAt);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    if (request.signal.aborted) return false;
    // Ao pedir contato, a dúvida relevante é a anterior ("quero falar com alguém" não ajuda a equipe).
    const contactQuestion = response.intent === 'contact' ? (questionBefore(history) ?? shown) : shown;
    update({messages: [...getSnapshot().messages, toAssistantMessage(response, contactQuestion)]});
  } catch {
    if (request.signal.aborted) return false;
    const failure: JunoResponse = {...answers.remoteFailure(), kind: 'error', confidence: 0, source: 'local'};
    update({messages: [...getSnapshot().messages, toAssistantMessage(failure, shown)]});
  } finally {
    clearTimeout(slowTimer);
    if (inFlight === request) {
      inFlight = null;
      update({pending: false, slow: false});
    }
  }
  return true;
}

/** Reenvia a última pergunta (após uma falha de resposta). */
export function retryLastQuestion(context: JunoRequestContext, welcome: JunoMessage) {
  const question = questionBefore(getSnapshot().messages);
  return question ? sendQuestion(question, context, {welcome, echo: false}) : Promise.resolve(false);
}

/** Acrescenta o card de contato com a equipe, com a dúvida anterior à mensagem `fromId`. */
export function showContactCard(fromId: string) {
  const {messages} = getSnapshot();
  const index = messages.findIndex(({id}) => id === fromId);
  const question = questionBefore(messages, index === -1 ? messages.length : index) ?? '';
  const card: JunoMessage = {
    id: createId(),
    role: 'assistant',
    content: answers.contact().answer,
    createdAt: Date.now(),
    kind: 'answer',
    intent: 'contact',
    contact: {question},
  };
  update({messages: [...messages, card]});
}

export function clearConversation() {
  inFlight?.abort();
  inFlight = null;
  draft = '';
  update({messages: [], pending: false, slow: false});
}

/** Rascunho não enviado: sobrevive a "minimizar", some ao "fechar". Nunca vai para o storage. */
export const draftStore = {
  get: () => draft,
  set: (value: string) => {
    draft = value;
  },
  clear: () => {
    draft = '';
  },
};
