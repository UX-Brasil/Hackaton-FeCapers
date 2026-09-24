'use client';

import {useEffect, useState} from 'react';
import {ArrowUp} from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    update();
    window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, []);

  function goToTop() {
    // O comportamento suave vem do CSS e é desligado com movimento reduzido.
    window.scrollTo({top: 0});
    document.getElementById('topo')?.focus({preventScroll: true});
  }

  return (
    <button
      type="button"
      className="to-top"
      data-visible={visible}
      aria-label="Voltar ao topo"
      tabIndex={visible ? 0 : -1}
      onClick={goToTop}
    >
      <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
