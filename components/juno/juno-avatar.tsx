import type {JunoStatus} from '@/lib/juno/types';
import {cn} from '@/lib/utils';

interface JunoAvatarProps {
  /** Reação do mascote: ouvindo, pensando, falando… (animações só com movimento permitido). */
  status?: JunoStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Juno em miniatura para o assistente. Usa o asset oficial do mascote, mas
 * não o componente <Juno/> das seções: aquele já flutua via CSS global, e
 * cada elemento deve ter uma única fonte de animação.
 */
export function JunoAvatar({status = 'idle', size = 'md', className}: JunoAvatarProps) {
  return (
    <span className={cn('jn-avatar', `jn-avatar--${size}`, className)} data-status={status} aria-hidden="true">
      <img src="/images/juno-oficial.png" alt="" width={81} height={107} decoding="async" draggable={false} />
    </span>
  );
}
