/**
 * Configuração do Juno.
 *
 * A landing é só frontend: o Juno responde com a base de conhecimento local.
 * Para usar um modelo de IA no futuro, crie um endpoint no SERVIDOR que guarde
 * a chave da API (nunca no navegador), siga o contrato de RemoteAIProvider
 * (lib/juno/remote-provider.ts) e informe o caminho em `remoteEndpoint`.
 */
export const junoConfig = {
  /** Ex.: '/api/juno/chat'. `null` mantém o Juno 100% local. */
  remoteEndpoint: null as string | null,
  /** Tempo máximo de espera por uma resposta remota. */
  remoteTimeoutMs: 15_000,
  /** Mensagens recentes enviadas como contexto ao provedor remoto. */
  remoteHistoryLimit: 12,
  /** Pausa mínima antes de uma resposta local, para o "pensando" não piscar. */
  localReplyDelayMs: 450,
  /** Depois deste tempo sem resposta, o Juno avisa que ainda está pensando. */
  slowReplyMs: 6_000,
};
