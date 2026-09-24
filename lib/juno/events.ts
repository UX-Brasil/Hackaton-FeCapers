/**
 * Abre o Juno a partir de qualquer ponto da página, opcionalmente com uma
 * mensagem de contexto. É só um evento: quem chama não carrega o chat, que
 * continua no chunk do painel (carregado sob demanda).
 */

export const JUNO_OPEN_EVENT = 'soujunior:juno-open';

export interface JunoOpenDetail {
  /** Mensagem do Juno acrescentada à conversa ao abrir. */
  message?: {content: string; followUps?: string[]};
}

export function openJuno(detail: JunoOpenDetail = {}) {
  window.dispatchEvent(new CustomEvent<JunoOpenDetail>(JUNO_OPEN_EVENT, {detail}));
}
