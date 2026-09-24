import * as answers from './answers';
import {junoConfig} from './config';
import {LocalKnowledgeProvider} from './local-provider';
import {RemoteAIProvider} from './remote-provider';
import type {JunoProvider, JunoRequest, JunoResponse} from './types';

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

function fallback(draft: answers.Draft, kind: JunoResponse['kind']): JunoResponse {
  return {...draft, kind, confidence: 0, source: 'local'};
}

/**
 * Camadas do Juno: a base local responde na hora o que ela cobre com
 * segurança; o provedor remoto (quando configurado) cuida do resto. Se o
 * remoto falhar, a resposta local ainda vale — e, sem ela, o Juno avisa do
 * problema e oferece nova tentativa e contato com a equipe.
 */
class LayeredProvider implements JunoProvider {
  constructor(
    private readonly local: JunoProvider,
    private readonly remote: JunoProvider,
  ) {}

  async sendMessage(request: JunoRequest, options?: {signal?: AbortSignal}) {
    const local = await this.local.sendMessage(request);
    if (local.kind === 'answer' && local.confidence >= 0.9) return local;
    const localIsUseful = local.kind === 'answer' || local.kind === 'partial';

    if (isOffline()) return localIsUseful ? local : fallback(answers.offline(), 'offline');
    try {
      return await this.remote.sendMessage(request, options);
    } catch (error) {
      if (options?.signal?.aborted) throw error;
      if (localIsUseful) return local;
      return isOffline() ? fallback(answers.offline(), 'offline') : fallback(answers.remoteFailure(), 'error');
    }
  }
}

export function createJunoProvider(): JunoProvider {
  const local = new LocalKnowledgeProvider();
  const {remoteEndpoint, remoteTimeoutMs, remoteHistoryLimit} = junoConfig;
  if (!remoteEndpoint) return local;
  return new LayeredProvider(
    local,
    new RemoteAIProvider({endpoint: remoteEndpoint, timeoutMs: remoteTimeoutMs, historyLimit: remoteHistoryLimit}),
  );
}
