import {communityRoles} from '@/content/site';
import {Button} from '@/components/ui/button';
import {TileMark} from '@/components/ui/tile-mark';

export function CommunitySection() {
  return (
    <section id="participe" className="section community" aria-labelledby="participe-title" data-nav="participe">
      <div className="wrap">
        <header className="section-header section-header--split" data-reveal>
          <div>
            <p className="eyebrow">Participe</p>
            <h2 id="participe-title" className="section-title">
              Faça parte da comunidade
            </h2>
          </div>
          <p className="lead">
            Há mais de uma forma de participar: como junior ou mentor, ajudando diretamente na construção do projeto,
            ou como apoiador, com divulgação, recrutamento e patrocínio.
          </p>
        </header>

        <ul className="paths" data-stagger>
          {communityRoles.map((role) => {
            const [prefix, ...rest] = role.title.split(' ');
            return (
              <li className="path" data-accent={role.accent} key={role.title}>
                <div className="path__head">
                  <h3 className="path__title">
                    <span>{prefix}</span> {rest.join(' ')}
                  </h3>
                  <TileMark className="path__tiles" />
                </div>
                <div className="path__body">
                  <div>
                    <p className="path__audience">{role.audience}</p>
                    <p className="path__text">{role.text}</p>
                  </div>
                  <Button href={role.href} variant="secondary" pendingMessage={role.pendingMessage}>
                    {role.cta}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
