import {Juno} from '@/components/mascot/mascots';
import {TileMark} from '@/components/ui/tile-mark';
import {discoveryIntro} from '@/content/area-discovery';
import {AreaDiscovery} from './area-discovery';

/** "Descubra seu lugar": ferramenta de descoberta de áreas, logo depois da jornada. */
export function AreaDiscoverySection() {
  return (
    <section
      id="descubra"
      className="section panel surface-dark discovery"
      aria-labelledby="descubra-title"
      data-nav="participe"
    >
      <TileMark className="discovery__pattern" />

      <div className="wrap discovery__grid">
        <header className="discovery__intro" data-reveal>
          <p className="eyebrow">{discoveryIntro.eyebrow}</p>
          <h2 id="descubra-title" className="section-title">
            {discoveryIntro.title}
          </h2>
          <p className="lead">{discoveryIntro.lead}</p>
          <p className="discovery__note">{discoveryIntro.note}</p>
          <figure className="discovery__juno">
            <Juno className="discovery__mascot" />
            <figcaption className="discovery__bubble">{discoveryIntro.juno}</figcaption>
          </figure>
        </header>

        <AreaDiscovery />
      </div>
    </section>
  );
}
