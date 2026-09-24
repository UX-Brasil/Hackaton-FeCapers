import {cn} from '@/lib/utils';

interface MascotProps {
  /** Texto alternativo; use `''` quando o mascote for decorativo. */
  alt?: string;
  className?: string;
  /** Carrega imediatamente (acima da dobra). */
  eager?: boolean;
  shadow?: boolean;
}

interface MascotImage {
  src: string;
  width: number;
  height: number;
}

function Mascot({image, alt = '', className, eager = false, shadow = false}: MascotProps & {image: MascotImage}) {
  return (
    <span className={cn('mascot', className)}>
      <span className="mascot__float">
        <img
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      </span>
      {shadow && <span className="mascot__shadow" aria-hidden="true" />}
    </span>
  );
}

/** Juno, o guardião da comunidade — mascote oficial da SouJunior. */
export function Juno(props: MascotProps) {
  return <Mascot image={{src: '/images/juno-oficial.png', width: 81, height: 107}} {...props} />;
}

/** Mascote da campanha de apoio financeiro no Apoia.se. */
export function SupportMascot(props: MascotProps) {
  return <Mascot image={{src: '/images/robo-apoia-se.png', width: 104, height: 114}} {...props} />;
}
