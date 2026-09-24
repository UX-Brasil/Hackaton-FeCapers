import {areas} from '@/content/site';

export function AreasSection() {
  return (
    <section id="areas" className="section areas" aria-labelledby="areas-title" data-nav="areas">
      <div className="wrap areas__grid" data-stagger>
        <header className="areas__header">
          <p className="eyebrow">Áreas de atuação</p>
          <h2 id="areas-title" className="section-title">
            Encontre o seu lugar: <span className="text-accent">12 áreas</span> de atuação
          </h2>
          <p className="lead">
            A SouJunior reúne profissionais iniciantes de todas as áreas que compõem uma empresa de tecnologia.
          </p>
        </header>

        {areas.map((area) => (
          <article className="area" data-accent={area.accent} key={area.name}>
            <span className="area__num" aria-hidden="true">
              {area.number}
            </span>
            <h3 className="area__name">{area.name}</h3>
            <p className="area__desc">{area.description}</p>
            <area.icon className="area__icon" size={22} strokeWidth={1.75} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
