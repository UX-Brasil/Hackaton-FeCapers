import {testimonials} from '@/content/testimonials';
import {initials} from '@/lib/utils';
import {TestimonialsRail} from './testimonials-rail';

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="section testimonials"
      aria-labelledby="depoimentos-title"
      data-nav="participe"
    >
      <div className="wrap">
        <header className="section-header" data-reveal>
          <p className="eyebrow">Depoimentos</p>
          <h2 id="depoimentos-title" className="section-title">
            Quem vive a SouJunior conta
          </h2>
        </header>

        <TestimonialsRail label="Depoimentos da comunidade" total={testimonials.length}>
          {testimonials.map((item) => (
            <li key={item.name} data-accent={item.accent}>
              <figure className="quote-card">
                <span className="quote-card__mark" aria-hidden="true">
                  “
                </span>
                <blockquote>
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                  <span>
                    <span className="quote-card__name">{item.name}</span>
                    <span className="quote-card__role">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </TestimonialsRail>
      </div>
    </section>
  );
}
