'use client';

import {useState} from 'react';
import {Check, Copy, ExternalLink, Mail, MessageCircle, type LucideIcon} from 'lucide-react';
import {SOUJUNIOR_SUPPORT_CHANNELS, type ContactChannel, type ContactChannelType} from '@/content/contact-channels';

const CHANNEL_ICONS: Partial<Record<ContactChannelType, LucideIcon>> = {
  email: Mail,
  whatsapp: MessageCircle,
  discord: MessageCircle,
};

function composeMessage(question: string) {
  return `Olá! Eu estava conversando com o Juno na landing da SouJunior e fiquei com esta dúvida:\n\n"${question}"`;
}

/** E-mail e WhatsApp abrem com a dúvida preenchida — o envio continua sendo da pessoa. */
function channelHref({href, type}: ContactChannel, message: string) {
  const join = href.includes('?') ? '&' : '?';
  if (type === 'email') return `${href}${join}body=${encodeURIComponent(message)}`;
  if (type === 'whatsapp' && href.includes('wa.me')) return `${href}${join}text=${encodeURIComponent(message)}`;
  return href;
}

/**
 * Escalonamento para a equipe: só mostra canais oficiais publicados em
 * content/links.ts e nunca envia nada sozinho.
 */
export function JunoContactFallback({question}: {question: string}) {
  const [copy, setCopy] = useState<'idle' | 'copied' | 'manual'>('idle');
  const message = composeMessage(question);
  const channels = SOUJUNIOR_SUPPORT_CHANNELS;

  async function copyQuestion() {
    try {
      await navigator.clipboard.writeText(message);
      setCopy('copied');
    } catch {
      setCopy('manual');
    }
  }

  return (
    <section className="jn-contact" aria-label="Falar com a equipe da SouJunior">
      <h3 className="jn-contact__title">Falar com a equipe</h3>
      {channels.length > 0 ? (
        <>
          <p>Essa dúvida precisa de alguém da SouJunior. Escolha um canal oficial:</p>
          <ul className="jn-contact__channels">
            {channels.map((channel) => {
              const Icon = CHANNEL_ICONS[channel.type] ?? ExternalLink;
              return (
                <li key={channel.id}>
                  <a
                    className="jn-action"
                    href={channelHref(channel, message)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={16} aria-hidden="true" />
                    {channel.label}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>
          Os canais oficiais de contato ainda não foram publicados nesta página.
          {question && ' Copie sua dúvida para enviá-la à equipe assim que eles estiverem disponíveis.'}
        </p>
      )}

      {question && (
        <button type="button" className="jn-contact__copy" onClick={copyQuestion}>
          {copy === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copy === 'copied' ? 'Dúvida copiada' : 'Copiar minha dúvida'}
        </button>
      )}
      <span className="sr-only" role="status">
        {copy === 'copied' ? 'Sua dúvida foi copiada.' : ''}
      </span>

      {copy === 'manual' && (
        <label className="jn-contact__manual">
          Não consegui copiar automaticamente. Selecione o texto abaixo:
          <textarea readOnly rows={4} value={message} onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}

      {channels.length > 0 && <p className="jn-contact__note">Nada é enviado automaticamente: você revisa e envia.</p>}
    </section>
  );
}
