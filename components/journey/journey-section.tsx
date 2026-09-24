import {Button} from '@/components/ui/button';
import {Lines} from '@/components/ui/lines';
import {Juno} from '@/components/mascot/mascots';
import {journeyClosing, journeyIntro, journeySteps} from '@/content/journey';
import {JourneyStep} from './journey-step';

/**
 * "Sua jornada na SouJunior": timeline de cinco etapas. No desktop, a
 * introdução fica fixa à esquerda enquanto as etapas passam; a linha de
 * progresso acompanha a rolagem (components/motion), sem travar o scroll.
 */
export function JourneySection() {
  return (
    <section id="jornada" className="section journey" aria-labelledby="jornada-title" data-nav="participe">
      <div className="wrap journey__grid">
        <header className="journey__intro">
          <p className="eyebrow" data-reveal>
            {journeyIntro.eyebrow}
          </p>
          <h2 id="jornada-title" className="section-title" data-lines>
            <Lines lines={journeyIntro.titleLines} />
          </h2>
          <div className="journey__lead" data-reveal>
            {journeyIntro.lead.map((paragraph) => (
              <p className="lead" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <figure className="journey__juno" data-reveal>
            <Juno className="journey__mascot" />
            <figcaption className="journey__bubble">{journeyIntro.juno}</figcaption>
          </figure>
        </header>

        <div className="journey__track" data-journey>
          <span className="journey__rail" aria-hidden="true">
            <span className="journey__fill" data-journey-fill />
          </span>
          <ol className="journey__steps">
            {journeySteps.map((step) => (
              <JourneyStep key={step.id} step={step} />
            ))}
          </ol>
        </div>
      </div>

      <div className="wrap">
        <div className="journey__closing" data-reveal>
          <p className="journey__closing-quote">
            {journeyClosing.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="journey__closing-text">{journeyClosing.complement}</p>
          <Button href="#participe">{journeyClosing.cta}</Button>
        </div>
      </div>
    </section>
  );
}
