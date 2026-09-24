import {socialLinks} from './links';

export type ContactChannelType =
  | 'linkedin'
  | 'instagram'
  | 'discord'
  | 'github'
  | 'whatsapp'
  | 'email'
  | 'site';

export interface ContactChannel {
  id: string;
  label: string;
  href: string;
  type: ContactChannelType;
}

function channelType(label: string, href: string): ContactChannelType {
  const value = `${label} ${href}`.toLowerCase();
  if (href.startsWith('mailto:')) return 'email';
  if (/whatsapp|wa\.me/.test(value)) return 'whatsapp';
  if (value.includes('linkedin')) return 'linkedin';
  if (value.includes('instagram')) return 'instagram';
  if (value.includes('discord')) return 'discord';
  if (value.includes('github')) return 'github';
  return 'site';
}

/**
 * Canais oficiais da SouJunior, derivados de `socialLinks` em content/links.ts.
 *
 * Só entram canais com endereço publicado: enquanto um link for `null`, ele
 * não aparece em lugar nenhum. Nunca adicionar endereços não confirmados aqui.
 * Fonte única para rodapé, Juno, CTAs e seção de apoio.
 */
export const SOUJUNIOR_CONTACT_CHANNELS: ContactChannel[] = socialLinks.flatMap(({label, href}) =>
  href
    ? [{id: label.toLowerCase().replace(/\W+/g, '-'), label, href, type: channelType(label, href)}]
    : [],
);

/** Canais onde faz sentido enviar uma dúvida (GitHub é para código, não atendimento). */
export const SOUJUNIOR_SUPPORT_CHANNELS = SOUJUNIOR_CONTACT_CHANNELS.filter(
  (channel) => channel.type !== 'github',
);
