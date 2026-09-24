'use client';

import type {ReactNode} from 'react';
import {notify} from './toaster';

interface PendingActionProps {
  className: string;
  message: string;
  children: ReactNode;
}

/**
 * CTA cujo link oficial ainda não foi publicado: em vez de levar a um
 * destino inventado, informa que o link será divulgado em breve.
 */
export function PendingAction({className, message, children}: PendingActionProps) {
  return (
    <button type="button" className={className} onClick={() => notify(message)}>
      {children}
    </button>
  );
}
