import {Check} from 'lucide-react';
import {proposalPoints} from '@/content/site';
import {Lines} from '@/components/ui/lines';

export function ProposalSection() {
  return (
    <section id="sobre" className="section proposal" aria-labelledby="sobre-title" data-nav="sobre">
      <div className="wrap">
        <div className="proposal__intro">
          <div>
            <p className="eyebrow" data-reveal>
              Nossa proposta
            </p>
            <h2 id="sobre-title" className="section-title" data-lines>
              <Lines
                lines={[
                  'Estudar é o começo.',
                  <span className="text-accent" key="a">Praticar é o que</span>,
                  <span className="text-accent" key="b">faz a diferença.</span>,
                ]}
              />
            </h2>
          </div>

          <div className="proposal__text" data-reveal>
            <p>
              Cursos ensinam a teoria, mas a rotina do trabalho tem desafios que o slide da aula não explica. É nessa
              transição entre estudar e atuar que muita gente se perde.
            </p>
            <p>
              A SouJunior existe para preencher essa lacuna. É um ambiente aberto e seguro, construído para colocar
              profissionais em projetos reais, em constante evolução, onde você aprende fazendo.
            </p>
          </div>
        </div>

        <div className="bridge">
          <p className="bridge__statement" data-reveal>
            <span className="bridge__check" aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
            Uma ponte sólida da teoria até a contratação formal.
          </p>

          <div className="bridge__body">
            <p className="bridge__end bridge__end--start">
              <small>Ponto de partida</small> Teoria
            </p>
            <span className="bridge__line" aria-hidden="true" data-draw />
            <ol className="bridge__points" data-stagger>
              {proposalPoints.map((point, index) => (
                <li className="bridge__point" key={point.title}>
                  <span className="bridge__num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </li>
              ))}
            </ol>
            <p className="bridge__end bridge__end--finish">
              <small>Destino</small> Contratação formal
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
