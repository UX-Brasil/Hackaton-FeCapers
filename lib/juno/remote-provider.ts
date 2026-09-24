import {isSectionId, JUNO_ALLOWED_LINKS} from '@/content/juno-knowledge';
import {redactSensitive} from './text';
import type {JunoAction, JunoProvider, JunoRequest, JunoResponse, JunoResponseKind} from './types';

/**
 * Adapter para um endpoint seguro de IA (ex.: POST /api/juno/chat).
 *
 * Contrato — requisição:
 *   { messages: [{role: 'user' | 'assistant', content}], context: {currentSection} }
 * Resposta:
 *   { answer, confidence?, kind?, source?, actions?, suggestedAction?, requiresHumanSupport? }
 *
 * O servidor guarda a chave e o prompt de sistema (lib/juno/system-prompt.ts);
 * nada disso passa pelo navegador. Ações sugeridas pelo modelo só são aceitas
 * se apontarem para seções da página ou links oficiais já conhecidos.
 */

const MAX_ANSWER_LENGTH = 2_000;
const KINDS: JunoResponseKind[] = ['answer', 'partial', 'no-info', 'not-understood', 'out-of-scope'];

export class RemoteRequestError extends Error {
  constructor(
    message: string,
    readonly reason: 'timeout' | 'http' | 'invalid' | 'network',
  ) {
    super(message);
    this.name = 'RemoteRequestError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toAction(value: unknown): JunoAction | null {
  if (!isRecord(value) || typeof value.label !== 'string' || !value.label.trim()) return null;
  const label = value.label.trim().slice(0, 60);
  if (value.type === 'scroll' && isSectionId(value.target)) return {type: 'scroll', label, target: value.target};
  if (value.type === 'link' && typeof value.href === 'string' && JUNO_ALLOWED_LINKS.has(value.href)) {
    return {type: 'link', label, href: value.href};
  }
  if (value.type === 'contact') return {type: 'contact', label};
  return null;
}

export function parseRemoteResponse(data: unknown): Omit<JunoResponse, 'source'> {
  if (!isRecord(data) || typeof data.answer !== 'string' || !data.answer.trim()) {
    throw new RemoteRequestError('Resposta remota sem texto', 'invalid');
  }
  const confidence =
    typeof data.confidence === 'number' && Number.isFinite(data.confidence)
      ? Math.min(1, Math.max(0, data.confidence))
      : 0.5;
  const kind = KINDS.find((value) => value === data.kind) ?? (confidence >= 0.6 ? 'answer' : 'no-info');
  const rawActions = [...(Array.isArray(data.actions) ? data.actions : []), data.suggestedAction];
  const actions = rawActions.map(toAction).filter((action): action is JunoAction => action !== null).slice(0, 3);

  return {
    kind,
    confidence,
    answer: data.answer.trim().slice(0, MAX_ANSWER_LENGTH),
    actions,
    // Sem informação suficiente → sempre oferecer os canais oficiais.
    requiresHumanSupport: data.requiresHumanSupport === true || kind === 'no-info' || kind === 'partial',
  };
}

interface RemoteOptions {
  endpoint: string;
  timeoutMs: number;
  historyLimit: number;
}

export class RemoteAIProvider implements JunoProvider {
  constructor(private readonly options: RemoteOptions) {}

  async sendMessage({question, history, context}: JunoRequest, {signal}: {signal?: AbortSignal} = {}) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.options.timeoutMs);
    const forwardAbort = () => controller.abort();
    signal?.addEventListener('abort', forwardAbort, {once: true});

    const messages = [
      ...history
        .filter(({kind}) => kind !== 'welcome')
        .slice(-this.options.historyLimit)
        .map(({role, content}) => ({role, content})),
      {role: 'user' as const, content: redactSensitive(question)},
    ];

    try {
      const response = await fetch(this.options.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages, context: {currentSection: context.currentSection}}),
        signal: controller.signal,
      });
      if (!response.ok) throw new RemoteRequestError(`HTTP ${response.status}`, 'http');
      const data: unknown = await response.json();
      return {...parseRemoteResponse(data), source: 'remote'} satisfies JunoResponse;
    } catch (error) {
      if (timedOut) throw new RemoteRequestError('Tempo esgotado', 'timeout');
      if (error instanceof RemoteRequestError || signal?.aborted) throw error;
      throw new RemoteRequestError('Falha de rede', 'network');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', forwardAbort);
    }
  }
}
