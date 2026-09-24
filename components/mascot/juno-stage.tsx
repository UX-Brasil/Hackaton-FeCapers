import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';
import {Juno} from './mascots';

interface JunoStageProps {
  bubble: ReactNode;
  caption?: ReactNode;
  junoAlt?: string;
  variant?: 'light' | 'dark';
  /** Marca os elementos para a animação de abertura do hero. */
  intro?: boolean;
  className?: string;
}

const TILES = ['', 'stage__tile--dot', '', 'stage__tile--blue'];
const TILE_PARALLAX = ['-8', '-16', '6', '12'];

/**
 * Juno pousado sobre o símbolo SouJunior em blocos (grade 2×2 do logo).
 * Usado na abertura e no fechamento da página.
 */
export function JunoStage({bubble, caption, junoAlt = '', variant = 'light', intro = false, className}: JunoStageProps) {
  const heroAttr = intro ? {'data-hero': ''} : {};

  return (
    <figure className={cn('stage', variant === 'dark' && 'stage--dark', className)} data-stage>
      <div className="stage__mark" aria-hidden="true">
        {TILES.map((modifier, index) => (
          <span
            key={index}
            className={cn('stage__tile', modifier)}
            data-stage-tile
            data-parallax={TILE_PARALLAX[index]}
            {...heroAttr}
          />
        ))}
      </div>

      <div className="stage__juno" data-stage-juno {...heroAttr}>
        <div data-parallax="-32" data-juno-tilt={intro ? '' : undefined}>
          <Juno alt={junoAlt} eager={intro} />
        </div>
      </div>

      <p className="bubble bubble--right stage__bubble" data-stage-bubble {...heroAttr}>
        {bubble}
      </p>

      {caption && (
        <figcaption className="stage__caption" data-stage-caption {...heroAttr}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
