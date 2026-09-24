'use client';

import {useEffect, useState} from 'react';
import {Toast} from 'radix-ui';
import {X} from 'lucide-react';

const NOTIFY_EVENT = 'sj:notify';

/** Exibe um aviso breve em qualquer ponto da página. */
export function notify(message: string) {
  window.dispatchEvent(new CustomEvent<string>(NOTIFY_EVENT, {detail: message}));
}

interface ToastState {
  id: number;
  open: boolean;
  message: string;
}

export function Toaster() {
  const [toast, setToast] = useState<ToastState>({id: 0, open: false, message: ''});

  useEffect(() => {
    const show = (event: Event) => {
      const {detail} = event as CustomEvent<string>;
      // Um novo id remonta o toast e reinicia o tempo de exibição.
      setToast((current) => ({id: current.id + 1, open: true, message: detail}));
    };
    window.addEventListener(NOTIFY_EVENT, show);
    return () => window.removeEventListener(NOTIFY_EVENT, show);
  }, []);

  return (
    <Toast.Provider duration={5000} swipeDirection="right" label="Aviso">
      <Toast.Root
        key={toast.id}
        className="toast"
        open={toast.open}
        onOpenChange={(open) => setToast((current) => ({...current, open}))}
      >
        <Toast.Title className="toast__title">Em breve</Toast.Title>
        <Toast.Description className="toast__text">{toast.message}</Toast.Description>
        <Toast.Close className="toast__close" aria-label="Fechar aviso">
          <X size={18} aria-hidden="true" />
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="toast-viewport" />
    </Toast.Provider>
  );
}
