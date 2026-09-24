import {links} from '@/content/links';
import {fundedItems, supportOptions} from '@/content/site';
import {Button} from '@/components/ui/button';
import {SupportMascot} from '@/components/mascot/mascots';

export function SupportSection() {
  return (
    <section id="apoie" className="section support" aria-labelledby="apoie-title" data-nav="apoie">
      <div className="wrap">
        <header className="section-header section-header--split" data-reveal>
          <div>
            <p className="eyebrow">Apoie</p>
            <h2 id="apoie-title" className="section-title">
              Apoie a SouJunior
            </h2>
          </div>
          <p className="lead">Cada apoio amplia as oportunidades de quem está dando os primeiros passos em tecnologia.</p>
        </header>

        <ul className="support__options" data-stagger>
          {supportOptions.map((option) => (
            <li className="support-option" key={option.title}>
              <option.icon size={26} strokeWidth={1.75} aria-hidden="true" />
              <h3>{option.title}</h3>
              <p>{option.text}</p>
            </li>
          ))}
        </ul>

        <div className="apoia" data-scene="apoia">
          <div className="apoia__mascot" data-scene-robot>
            <SupportMascot alt="Mascote do apoio financeiro da SouJunior: um robô com um grande coração amarelo" />
          </div>

          <div>
            <p className="eyebrow">Apoio financeiro</p>
            <h3 className="apoia__title">Prefere apoiar financeiramente?</h3>
            <p className="apoia__text">
              Sua contribuição ajuda a SouJunior a continuar oferecendo oportunidades e recursos para novos
              profissionais, apoiando servidores, ferramentas, licenças e expansão dos projetos.
            </p>
            <ul className="apoia__items" aria-label="O que o apoio financeiro sustenta">
              {fundedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="apoia__action">
            <Button href={links.apoiaSe}>Apoie no Apoia.se</Button>
            <p className="apoia__note">A contribuição é feita na página oficial do Apoia.se.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
