import {communityFacts, metrics} from '@/content/site';
import {Button} from '@/components/ui/button';
import {Lines} from '@/components/ui/lines';
import {JunoStage} from '@/components/mascot/juno-stage';

const numberFormat = new Intl.NumberFormat('pt-BR');

export function HeroSection() {
  return (
    <section id="topo" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__pattern" aria-hidden="true" />

      <div className="wrap hero__grid">
        <div>
          <p className="pill" data-hero="">
            <span className="pill__dot" aria-hidden="true" />
            {communityFacts.openAndFree}
          </p>

          <h1 id="hero-title" className="hero__title" data-hero="">
            <Lines
              lines={['Sua primeira', 'experiência real', 'em tecnologia', <span className="text-accent" key="accent">começa aqui.</span>]}
            />
          </h1>

          <p className="lead hero__lead" data-hero="">
            Na SouJunior, você trabalha em produtos digitais de verdade, aprende com mentores e desenvolve as
            habilidades para entrar no mercado de tecnologia ou fazer a transição de carreira.
          </p>

          <div className="hero__actions" data-hero="">
            <Button href="#participe">Faça parte da comunidade</Button>
            <Button href="#sobre" variant="ghost" icon="down">
              Conheça a SouJunior
            </Button>
          </div>

          <dl className="metrics">
            {metrics.map((metric) => {
              const text = `${numberFormat.format(metric.value)}${metric.suffix ?? ''}`;
              return (
                <div className="metric" key={metric.label} data-hero="">
                  <dt>{metric.label}</dt>
                  <dd>
                    <span className="metric__sizer" aria-hidden="true">
                      {text}
                    </span>
                    <span
                      className="metric__count"
                      aria-hidden="true"
                      data-count={metric.value}
                      data-suffix={metric.suffix ?? ''}
                    >
                      {text}
                    </span>
                    <span className="sr-only">{text}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <JunoStage
          intro
          junoAlt="Juno, o mascote robô da SouJunior, com um coração amarelo no peito"
          bubble={
            <>
              <strong>Oi, eu sou o Juno!</strong>
              <span className="bubble__more">Vem que eu te mostro como a comunidade funciona.</span>
            </>
          }
          caption={
            <>
              <strong>Juno</strong>
              <span>O guardião da comunidade</span>
              <span>Seu guia para descobrir a SouJunior</span>
            </>
          }
        />
      </div>

      <span className="hero__deco" aria-hidden="true" data-parallax="24" />
    </section>
  );
}
