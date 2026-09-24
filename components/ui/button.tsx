import type {ReactNode} from 'react';
import {ArrowDown, ArrowRight, ArrowUpRight} from 'lucide-react';
import type {Href} from '@/content/types';
import {cn} from '@/lib/utils';
import {PendingAction} from './pending-action';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonIcon = 'arrow' | 'down' | 'external' | 'none';

interface ButtonProps {
  /** Âncora interna, URL externa ou `null` quando o link oficial ainda não existe. */
  href: Href;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: ButtonIcon;
  /** Mensagem exibida quando `href` é `null`. */
  pendingMessage?: string;
  className?: string;
}

const icons = {
  arrow: ArrowRight,
  down: ArrowDown,
  external: ArrowUpRight,
} as const;

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  pendingMessage = 'Este link será divulgado em breve.',
  className,
}: ButtonProps) {
  const external = href?.startsWith('http') ?? false;
  const iconName: ButtonIcon = icon ?? (external ? 'external' : 'arrow');
  const Icon = iconName === 'none' ? null : icons[iconName];
  const classes = cn('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', className);

  const content = (
    <>
      <span className="btn__label">{children}</span>
      {Icon && (
        <Icon className={`btn__icon btn__icon--${iconName}`} size={18} strokeWidth={2} aria-hidden="true" />
      )}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  );

  if (!href) {
    return (
      <PendingAction className={classes} message={pendingMessage}>
        {content}
      </PendingAction>
    );
  }

  return (
    <a className={classes} href={href} {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
      {content}
    </a>
  );
}
