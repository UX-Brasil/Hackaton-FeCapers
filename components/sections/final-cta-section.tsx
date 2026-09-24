import {communityFacts} from '@/content/site';
import {Button} from '@/components/ui/button';
import {Lines} from '@/components/ui/lines';
import {JunoStage} from '@/components/mascot/juno-stage';

export function FinalCTASection() {
  return (
    <section className="section panel surface-dark final" aria-labelledby="final-title">
      <div className="wrap final__grid">
        <div>
          <h2 id="final-title" className="final__title" data-lines>
            <Lines lines={['Venha construir essa', 'oportunidade com a gente.']} />
          </h2>
          <p className="lead" data-reveal>
            O próximo passo da sua carreira na tecnologia está esperando por você.
            <br />
            {communityFacts.noBarriers}
          </p>
          <div data-reveal>
            <Button href="#participe">Faça parte da nossa comunidade</Button>
          </div>
        </div>

        <div className="final__art" data-scene="final">
          <JunoStage variant="dark" bubble={<strong>Te espero na comunidade!</strong>} />
        </div>
      </div>
    </section>
  );
}
