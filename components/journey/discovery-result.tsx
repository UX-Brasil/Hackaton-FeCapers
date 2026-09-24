'use client';

import {useEffect, useRef} from 'react';
import {ArrowRight, MessageCircle, RotateCcw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Juno} from '@/components/mascot/mascots';
import {discoveryResult, junoDiscoveryMessage} from '@/content/area-discovery';
import type {AreaSuggestion} from '@/lib/area-discovery';
import {openJuno} from '@/lib/juno/events';
import {revealArea} from '@/lib/scroll';

interface DiscoveryResultProps {
  suggestions: AreaSuggestion[];
  onRestart: () => void;
}

export function DiscoveryResult({suggestions, onRestart}: DiscoveryResultProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const names = suggestions.map(({area}) => area.name);

  useEffect(() => {
    titleRef.current?.focus({preventScroll: true});
  }, []);

  return (
    <div className="discovery-result">
      <p className="sr-only" aria-live="polite">
        Sugestões prontas: {names.join(', ')}.
      </p>

      <h3 ref={titleRef} tabIndex={-1} className="discovery-result__title">
        {discoveryResult.title}
      </h3>
      <p className="discovery-result__lead">{discoveryResult.lead}</p>

      <ol className="discovery-suggestions">
        {suggestions.map(({area, reason}, index) => (
          <li className="discovery-suggestion" data-accent={area.accent} key={area.id}>
            <span className="discovery-suggestion__num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="discovery-suggestion__body">
              <h4 className="discovery-suggestion__name">{area.name}</h4>
              <p className="discovery-suggestion__reason">{reason}</p>
              <p className="discovery-suggestion__desc">{area.description}</p>
              <button type="button" className="discovery-link" onClick={() => revealArea(area.id)}>
                {discoveryResult.areaCta}
                <span className="sr-only">: {area.name}</span>
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>

      <p className="discovery-result__note">{discoveryResult.notDefinitive}</p>

      <div className="discovery-juno">
        <Juno className="discovery-juno__mascot" />
        <div className="discovery-juno__body">
          <p className="discovery-juno__line">{discoveryResult.juno}</p>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => openJuno({message: junoDiscoveryMessage(names)})}>
            <MessageCircle size={16} strokeWidth={2.25} aria-hidden="true" />
            <span className="btn__label">{discoveryResult.junoCta}</span>
          </button>
        </div>
      </div>

      <div className="discovery-cta">
        <p className="discovery-cta__title">{discoveryResult.ctaTitle}</p>
        <p className="discovery-cta__text">{discoveryResult.ctaText}</p>
        <div className="discovery-cta__actions">
          <Button href="#participe">{discoveryResult.ctaPrimary}</Button>
          <Button href="#areas" variant="secondary" icon="down">
            {discoveryResult.ctaSecondary}
          </Button>
          <button type="button" className="btn btn--ghost" onClick={onRestart}>
            <RotateCcw size={16} strokeWidth={2.25} aria-hidden="true" />
            <span className="btn__label">{discoveryResult.restart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
