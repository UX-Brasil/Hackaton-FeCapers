'use client';

import {useRef, useState, type MouseEvent} from 'react';
import {Dialog} from 'radix-ui';
import {ArrowRight, Menu, X} from 'lucide-react';
import {navigation} from '@/content/site';
import {Button} from '@/components/ui/button';

/**
 * Menu mobile acessível (Radix Dialog): foco preso no painel, Escape fecha,
 * rolagem da página bloqueada enquanto aberto e foco devolvido ao fechar.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pendingTarget = useRef<string | null>(null);

  // Links internos: a rolagem só acontece depois que o painel fecha e libera o scroll da página.
  function handleLinkClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    pendingTarget.current = link.hash.slice(1);
    setOpen(false);
  }

  function handleCloseAutoFocus(event: Event) {
    const id = pendingTarget.current;
    if (!id) return;
    event.preventDefault();
    pendingTarget.current = null;
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      history.pushState(null, '', `#${id}`);
      target.scrollIntoView();
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="menu-toggle" aria-label="Abrir menu">
        <Menu size={20} aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="menu-overlay" />
        <Dialog.Content
          className="menu-panel"
          aria-describedby={undefined}
          onCloseAutoFocus={handleCloseAutoFocus}
        >
          <div className="menu-panel__top">
            <img src="/images/soujunior-logo.png" alt="SouJunior" width={240} height={56} />
            <Dialog.Close className="menu-toggle" aria-label="Fechar menu">
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div onClick={handleLinkClick}>
            <nav aria-label="Navegação mobile">
              <ul>
                {navigation.map((item) => (
                  <li key={item.id}>
                    <a className="menu-panel__link" href={`#${item.id}`}>
                      {item.label}
                      <ArrowRight size={20} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <Button href="#participe">Faça parte da comunidade</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
