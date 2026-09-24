'use client';

import {useMemo, useState} from 'react';
import {discoveryQuestions} from '@/content/area-discovery';
import {suggestAreas} from '@/lib/area-discovery';
import {DiscoveryQuestion} from './discovery-question';
import {DiscoveryResult} from './discovery-result';

const TOTAL = discoveryQuestions.length;
const EMPTY_ANSWERS = (): (number | null)[] => discoveryQuestions.map(() => null);

/**
 * Quiz "Descubra seu lugar": uma pergunta por vez, sem cadastro, 100% local.
 * Voltar preserva as respostas; Refazer limpa tudo.
 */
export function AreaDiscovery() {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  // O foco só acompanha as trocas de pergunta depois que a pessoa começa a interagir.
  const [interacted, setInteracted] = useState(false);

  const finished = step >= TOTAL;
  const suggestions = useMemo(() => (finished ? suggestAreas(answers) : []), [finished, answers]);
  const answeredCount = answers.filter((answer) => answer !== null).length;

  function select(option: number) {
    setAnswers((current) => current.map((answer, index) => (index === step ? option : answer)));
  }

  function go(next: number) {
    setInteracted(true);
    setDirection(next > step ? 'forward' : 'back');
    setStep(next);
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS());
    go(0);
    setDirection('forward');
  }

  const progress = finished ? TOTAL : step;

  return (
    <div className="discovery-card">
      <div className="discovery-progress" aria-hidden="true">
        <span className="discovery-progress__text">
          {finished ? 'Sugestões' : `${step + 1} de ${TOTAL}`}
        </span>
        <span className="discovery-progress__bar">
          <span
            className="discovery-progress__fill"
            style={{transform: `scaleX(${finished ? 1 : (progress + (answers[step] !== null ? 1 : 0)) / TOTAL})`}}
          />
        </span>
      </div>

      {finished ? (
        <DiscoveryResult key="result" suggestions={suggestions} onRestart={restart} />
      ) : (
        <DiscoveryQuestion
          key={step}
          question={discoveryQuestions[step]}
          index={step}
          total={TOTAL}
          selected={answers[step]}
          direction={direction}
          focusOnMount={interacted}
          onSelect={select}
          onNext={() => go(step + 1)}
          onBack={() => go(step - 1)}
        />
      )}

      {!finished && answeredCount === 0 && step === 0 && (
        <p className="discovery-card__hint">Leva menos de um minuto. Não pedimos nenhum dado seu.</p>
      )}
    </div>
  );
}
