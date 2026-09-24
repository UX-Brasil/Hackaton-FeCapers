'use client';

import {useEffect, useRef, type FormEvent} from 'react';
import {Check} from 'lucide-react';
import type {DiscoveryQuestion as Question} from '@/content/types';
import {cn} from '@/lib/utils';

interface DiscoveryQuestionProps {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  /** Direção da última navegação, para a transição entrar do lado certo. */
  direction: 'forward' | 'back';
  /** Move o foco para o título ao trocar de pergunta (não no primeiro render da página). */
  focusOnMount: boolean;
  onSelect: (option: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DiscoveryQuestion({
  question,
  index,
  total,
  selected,
  direction,
  focusOnMount,
  onSelect,
  onNext,
  onBack,
}: DiscoveryQuestionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const last = index === total - 1;

  useEffect(() => {
    if (focusOnMount) titleRef.current?.focus({preventScroll: true});
  }, [focusOnMount]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (selected !== null) onNext();
  }

  return (
    <form className="discovery-question" data-direction={direction} onSubmit={handleSubmit}>
      <fieldset>
        <legend className="discovery-question__legend">
          <span className="discovery-question__step">
            Pergunta {index + 1} de {total}
          </span>
          <h3 ref={titleRef} tabIndex={-1} className="discovery-question__title">
            {question.question}
          </h3>
        </legend>

        <ul className="discovery-options">
          {question.options.map((option, optionIndex) => {
            const active = selected === optionIndex;
            return (
              <li key={option.label}>
                <button
                  type="button"
                  className={cn('discovery-option', active && 'is-selected')}
                  aria-pressed={active}
                  onClick={() => onSelect(optionIndex)}
                >
                  <span className="discovery-option__check" aria-hidden="true">
                    {active && <Check size={16} strokeWidth={3} />}
                  </span>
                  <span className="discovery-option__label">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="discovery-question__nav">
        {index > 0 && (
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            Voltar
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={selected === null}>
          {last ? 'Ver sugestões' : 'Continuar'}
        </button>
      </div>
    </form>
  );
}
