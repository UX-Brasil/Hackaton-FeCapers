'use client';

import {useEffect, useState} from 'react';
import {navigation} from '@/content/site';
import type {SectionId} from '@/content/types';
import {Button} from '@/components/ui/button';
import {MobileMenu} from './mobile-menu';

/** Faixa no meio da viewport usada para decidir qual seção está ativa. */
const SPY_MARGIN = '-45% 0px -54% 0px';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[data-nav]'));
    const visible = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(section);
          else visible.delete(section);
        }
        const current = sections.find((section) => visible.has(section));
        setActive((current?.dataset.nav as SectionId | undefined) ?? null);
      },
      {rootMargin: SPY_MARGIN},
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="wrap site-header__inner">
        <a href="#topo" className="site-header__logo" aria-label="SouJunior — voltar ao início">
          <img src="/images/soujunior-logo.png" alt="" width={240} height={56} />
        </a>

        <nav className="site-nav" aria-label="Navegação principal">
          <ul>
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button href="#participe" size="sm" className="site-header__cta">
          Faça parte
        </Button>

        <MobileMenu />
      </div>
    </header>
  );
}
