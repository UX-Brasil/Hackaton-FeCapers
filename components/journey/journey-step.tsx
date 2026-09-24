import type {ReactNode} from 'react';
import {ArrowRight, Check, Sparkles} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  journeyAreaPreview,
  journeyShift,
  journeyTestimonial,
  notNeeded,
  practiceTags,
  squadExample,
} from '@/content/journey';
import {areas, communityFacts, metrics} from '@/content/site';
import {testimonials} from '@/content/testimonials';
import type {JourneyExtra, JourneyStep as Step} from '@/content/types';
import {initials} from '@/lib/utils';

const numberFormat = new Intl.NumberFormat('pt-BR');

function NotNeeded() {
  return (
    <div className="journey-card journey-card--list">
      <p className="journey-card__title">{notNeeded.title}</p>
      <ul className="journey-nope">
        {notNeeded.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="journey-card__closing">
        <Check size={18} strokeWidth={2.5} aria-hidden="true" />
        {notNeeded.closing}
      </p>
    </div>
  );
}

function AreaPreview() {
  const shown = areas.slice(0, journeyAreaPreview);
  return (
    <div className="journey-areas">
      <ul className="journey-chips" aria-label="Algumas das áreas da comunidade">
        {shown.map((area) => (
          <li className="journey-chip" data-accent={area.accent} key={area.id}>
            {area.name}
          </li>
        ))}
        <li className="journey-chip journey-chip--more">+{areas.length - shown.length} áreas</li>
      </ul>
      <Button href="#areas" variant="secondary" size="sm" icon="down">
        Ver as {areas.length} áreas
      </Button>
    </div>
  );
}

function Squad() {
  const proof = [
    `${numberFormat.format(metrics[0].value)}${metrics[0].suffix ?? ''} ${metrics[0].label.toLowerCase()}`,
    `${metrics[1].value} ${metrics[1].label.toLowerCase()}`,
    communityFacts.openAndFree,
  ];
  return (
    <>
      <figure className="journey-card journey-squad">
        <ul className="journey-squad__members">
          {squadExample.map((member) => (
            <li key={member.label} data-accent={member.accent} data-you={member.short === null || undefined}>
              <span className="journey-squad__avatar" aria-hidden="true">
                {member.short ?? <Sparkles size={16} strokeWidth={2.25} />}
              </span>
              {member.label}
            </li>
          ))}
        </ul>
        <figcaption className="journey-squad__caption">Exemplo de squad multidisciplinar</figcaption>
      </figure>
      <p className="journey-proof">
        {proof.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </p>
    </>
  );
}

function Practice() {
  return (
    <>
      <ul className="journey-tags" aria-label="O que faz parte da prática">
        {practiceTags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <figure className="journey-shift">
        <div className="journey-shift__side">
          <span className="journey-shift__label">Antes</span>
          <blockquote>“{journeyShift.before}”</blockquote>
        </div>
        <span className="journey-shift__via">
          SouJunior <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <div className="journey-shift__side journey-shift__side--after">
          <span className="journey-shift__label">Depois</span>
          <blockquote>“{journeyShift.after}”</blockquote>
        </div>
        <figcaption className="journey-shift__note">{journeyShift.note}</figcaption>
      </figure>
    </>
  );
}

function Growth() {
  const testimonial = testimonials.find(({name}) => name === journeyTestimonial.name);
  if (!testimonial) return null;
  // Só usa o trecho se ele estiver, de fato, no depoimento publicado.
  const quote = testimonial.quote.includes(journeyTestimonial.excerpt) ? journeyTestimonial.excerpt : testimonial.quote;
  return (
    <figure className="journey-quote" data-accent={testimonial.accent}>
      <blockquote>
        <p>“{quote}”</p>
      </blockquote>
      <figcaption>
        <span className="avatar" aria-hidden="true">
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="journey-quote__name">{testimonial.name}</span>
          <span className="journey-quote__role">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

const extras: Record<JourneyExtra, () => ReactNode> = {
  notNeeded: NotNeeded,
  areas: AreaPreview,
  squad: Squad,
  practice: Practice,
  growth: Growth,
};

export function JourneyStep({step}: {step: Step}) {
  const Extra = extras[step.extra];
  const number = String(step.id).padStart(2, '0');
  return (
    <li className="journey-step" data-journey-step data-accent={step.accent}>
      <span className="journey-step__dot" aria-hidden="true" />
      <div className="journey-step__head">
        <span className="journey-step__num" aria-hidden="true">
          {number}
        </span>
        <span className="journey-step__label">
          <span className="sr-only">Etapa {number}: </span>
          {step.label}
        </span>
      </div>
      <div className="journey-step__body">
        <h3 className="journey-step__title">{step.title}</h3>
        {step.text.map((paragraph) => (
          <p className="journey-step__text" key={paragraph}>
            {paragraph}
          </p>
        ))}
        {step.highlight && <p className="journey-step__highlight">{step.highlight}</p>}
        <Extra />
      </div>
    </li>
  );
}
