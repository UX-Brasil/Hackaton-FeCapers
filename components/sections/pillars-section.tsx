import {pillars} from '@/content/site';

export function PillarsSection() {
  return (
    <section
      id="pilares"
      className="section panel surface-dark pillars"
      aria-labelledby="pilares-title"
      data-nav="sobre"
    >
      <span className="pillars__deco" aria-hidden="true" data-parallax="-28" />

      <div className="wrap pillars__grid">
        <header className="pillars__header" data-reveal>
          <p className="eyebrow">Pilares da SouJunior</p>
          <h2 id="pilares-title" className="section-title">
            O que você encontra aqui
          </h2>
          <p className="lead">Veja o que oferecemos e o que isso significa para você:</p>
        </header>

        <ol className="pillars__list">
          {pillars.map((pillar, index) => (
            <li className="pillar" key={pillar.title} data-reveal>
              <span className="pillar__num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="pillar__title">{pillar.title}</h3>
                <p className="pillar__text">{pillar.text}</p>
                <p className="pillar__tag">{pillar.tag}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
