'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface TestimonialsRailProps {
  label: string;
  total: number;
  children: ReactNode;
}

/**
 * Grade no desktop; no mobile e tablet vira um trilho horizontal com snap,
 * controles anterior/próximo e indicador de posição.
 */
export function TestimonialsRail({label, total, children}: TestimonialsRailProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({index: 0, atStart: true, atEnd: false, scrollable: false});

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || '0') : rail.clientWidth;
      const max = rail.scrollWidth - rail.clientWidth;
      setState({
        index: Math.min(total - 1, Math.round(rail.scrollLeft / step)),
        atStart: rail.scrollLeft <= 4,
        atEnd: rail.scrollLeft >= max - 4,
        scrollable: max > 4,
      });
    };

    update();
    rail.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [total]);

  function move(direction: 1 | -1) {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap || '0');
    rail.scrollBy({left: direction * (card.offsetWidth + gap)});
  }

  return (
    <div className="rail">
      <ul
        ref={railRef}
        className="testimonials__list"
        aria-label={label}
        tabIndex={state.scrollable ? 0 : undefined}
        data-stagger
      >
        {children}
      </ul>

      <div className="rail__controls">
        <p className="rail__status" aria-live="polite">
          {state.index + 1} de {total}
        </p>
        <button
          type="button"
          className="rail__button"
          aria-label="Depoimento anterior"
          disabled={state.atStart}
          onClick={() => move(-1)}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="rail__button"
          aria-label="Próximo depoimento"
          disabled={state.atEnd}
          onClick={() => move(1)}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
