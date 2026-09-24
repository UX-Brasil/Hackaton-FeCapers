import {links} from '@/content/links';
import {Button} from '@/components/ui/button';
import {TileMark} from '@/components/ui/tile-mark';
import {Juno} from '@/components/mascot/mascots';

export function CareerSupportSection() {
  return (
    <section
      id="mentores"
      className="section panel surface-dark careers"
      aria-labelledby="mentores-title"
      data-nav="participe"
    >
      <TileMark className="careers__pattern" />

      <div className="wrap careers__grid">
        <div data-reveal>
          <p className="eyebrow">Para quem já tem experiência</p>
          <h2 id="mentores-title" className="careers__title">
            Ajude a impulsionar carreiras
          </h2>
          <p className="lead">
            Já tem experiência? Compartilhe o que sabe como mentor ou apoie a organização de outras formas. Você
            contribui diretamente para a formação dos próximos profissionais de tecnologia.
          </p>
          <div className="careers__actions">
            <Button href={links.formMentor} pendingMessage="O formulário de inscrição para mentores será divulgado em breve.">
              Quero ser mentor
            </Button>
            <Button href="#apoie" variant="ghost" icon="down">
              Outras formas de apoiar
            </Button>
          </div>
        </div>

        <figure className="careers__art" data-scene="careers">
          <div className="careers__tile" data-scene-item>
            <div className="careers__juno" data-scene-juno>
              <Juno />
            </div>
          </div>
          <figcaption className="bubble bubble--bottom careers__bubble" data-scene-bubble>
            Todo profissional experiente já foi júnior um dia.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
