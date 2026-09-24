'use client';

import {ArrowRight, ArrowUpRight, MessageCircle, Mic, PenLine, RotateCw, Square, Volume2} from 'lucide-react';
import type {ReactNode} from 'react';
import {JUNO_ALLOWED_LINKS} from '@/content/juno-knowledge';
import type {JunoAction, JunoMessage as Message} from '@/lib/juno/types';
import {JunoAvatar} from './juno-avatar';
import {JunoContactFallback} from './juno-contact-fallback';

interface JunoMessageProps {
  message: Message;
  /** Mensagem nova nesta abertura do painel (anima a entrada). */
  fresh: boolean;
  voiceInput: boolean;
  speech: {supported: boolean; speaking: boolean; toggle: (message: Message) => void};
  onAction: (action: JunoAction, message: Message) => void;
}

/** Texto simples: parágrafos separados por linha em branco e listas com "• ". */
function MessageText({content}: {content: string}) {
  const nodes: ReactNode[] = [];
  content.split(/\n{2,}/).forEach((block, blockIndex) => {
    const lines = block.split('\n');
    const intro = lines.filter((line) => !line.startsWith('• '));
    const items = lines.filter((line) => line.startsWith('• '));
    if (intro.length > 0) nodes.push(<p key={`p${blockIndex}`}>{intro.join('\n')}</p>);
    if (items.length > 0) {
      nodes.push(
        <ul key={`ul${blockIndex}`}>
          {items.map((item) => (
            <li key={item}>{item.slice(2)}</li>
          ))}
        </ul>,
      );
    }
  });
  return nodes;
}

const ACTION_ICONS = {
  scroll: ArrowRight,
  contact: MessageCircle,
  retry: RotateCw,
  rephrase: PenLine,
  voice: Mic,
} as const;

function ActionItem({action, onSelect, voiceInput}: {action: JunoAction; onSelect: () => void; voiceInput: boolean}) {
  if (action.type === 'link') {
    // Só links oficiais conhecidos — mesmo que a mensagem venha do sessionStorage ou de um provedor remoto.
    if (!JUNO_ALLOWED_LINKS.has(action.href)) return null;
    return (
      <a className="jn-action" href={action.href} target="_blank" rel="noopener noreferrer">
        {action.label}
        <ArrowUpRight size={16} aria-hidden="true" />
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  if (action.type === 'voice' && !voiceInput) return null;
  const Icon = ACTION_ICONS[action.type];
  return (
    <button type="button" className="jn-action" onClick={onSelect}>
      {action.label}
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

export function JunoMessage({message, fresh, voiceInput, speech, onAction}: JunoMessageProps) {
  const fromJuno = message.role === 'assistant';
  // O card de contato já faz o papel do botão "Falar com a SouJunior".
  const actions = (message.actions ?? []).filter((action) => !(message.contact && action.type === 'contact'));

  return (
    <article className="jn-msg" data-role={message.role} data-kind={message.kind} data-fresh={fresh || undefined}>
      {fromJuno && <JunoAvatar size="sm" className="jn-msg__avatar" />}
      <div className="jn-msg__bubble">
        <span className="sr-only">{fromJuno ? 'Juno:' : 'Você:'}</span>
        <div className="jn-msg__text">
          <MessageText content={message.content} />
        </div>

        {actions.length > 0 && (
          <div className="jn-msg__actions">
            {actions.map((action, index) => (
              <ActionItem
                key={`${action.type}-${index}`}
                action={action}
                voiceInput={voiceInput}
                onSelect={() => onAction(action, message)}
              />
            ))}
          </div>
        )}

        {message.contact && <JunoContactFallback question={message.contact.question} />}

        {fromJuno && speech.supported && (
          <button type="button" className="jn-listen" onClick={() => speech.toggle(message)}>
            {speech.speaking ? <Square size={14} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            {speech.speaking ? 'Parar áudio' : 'Ouvir resposta'}
          </button>
        )}
      </div>
    </article>
  );
}
