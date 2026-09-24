import type {SectionId} from '@/content/types';

/** Estado visual/funcional do Juno, combinado a partir do chat e da voz. */
export type JunoStatus =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'thinking'
  | 'responding'
  | 'speaking'
  | 'error';

/** Ações que o Juno pode oferecer abaixo de uma resposta. */
export type JunoAction =
  | {type: 'scroll'; label: string; target: SectionId}
  | {type: 'link'; label: string; href: string}
  | {type: 'contact'; label: string}
  /** Reenvia a última pergunta (após falha de resposta). */
  | {type: 'retry'; label: string}
  /** Leva o foco ao campo para a pessoa reescrever a dúvida. */
  | {type: 'rephrase'; label: string}
  /** Liga o microfone. Só é exibida quando o navegador suporta voz. */
  | {type: 'voice'; label: string};

/**
 * Como a resposta foi obtida. É o mecanismo de confiança do Juno:
 * - answer: coberta pela base de conhecimento;
 * - partial: parte coberta, parte não (a resposta deixa isso claro);
 * - no-info: entendida, mas sem informação na base;
 * - not-understood / out-of-scope: não entendida ou fora do tema SouJunior;
 * - error / offline: falha técnica.
 */
export type JunoResponseKind =
  | 'answer'
  | 'partial'
  | 'no-info'
  | 'not-understood'
  | 'out-of-scope'
  | 'error'
  | 'offline';

export interface JunoResponse {
  kind: JunoResponseKind;
  answer: string;
  /** 0 a 1. Não é exibida; decide fallback e escalonamento. */
  confidence: number;
  intent?: string;
  actions?: JunoAction[];
  /** Perguntas de continuação sugeridas como chips. */
  followUps?: string[];
  /** Mostra o card de contato com a equipe da SouJunior. */
  requiresHumanSupport?: boolean;
  source: 'local' | 'remote';
}

export interface JunoMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  kind?: JunoResponseKind | 'welcome';
  intent?: string;
  actions?: JunoAction[];
  followUps?: string[];
  /** Presente quando a mensagem mostra o card de contato; guarda a dúvida original. */
  contact?: {question: string};
}

export interface JunoRequestContext {
  /** Seção da landing visível quando a pergunta foi enviada. */
  currentSection: SectionId | null;
  /** O navegador oferece reconhecimento de voz (muda o texto de alguns fallbacks). */
  voiceInput: boolean;
}

export interface JunoRequest {
  question: string;
  /** Histórico recente da sessão, sem a pergunta atual. */
  history: JunoMessage[];
  context: JunoRequestContext;
}

export interface JunoProvider {
  sendMessage(request: JunoRequest, options?: {signal?: AbortSignal}): Promise<JunoResponse>;
}
