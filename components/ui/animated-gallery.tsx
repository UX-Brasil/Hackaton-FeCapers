'use client';

import * as React from 'react';
import {
  motion,
  stagger,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Transition,
  type Variants,
} from 'motion/react';

import {cn} from '@/lib/utils';

/**
 * Galeria em perspectiva conduzida pela rolagem.
 *
 * - `ContainerScroll` define o trilho de rolagem e publica o progresso (0–1).
 * - `ContainerSticky` fixa o palco enquanto o trilho passa.
 * - `GalleryContainer` sai inclinado e fica de frente; depois estabiliza a escala.
 * - `GalleryCol` desloca cada coluna em velocidade/direção própria.
 * - `ContainerStagger` + `ContainerAnimated` revelam o texto em sequência.
 *
 * A rolagem nunca é controlada: tudo apenas reage a `scrollY`. No SSR, durante
 * a hidratação e com `prefers-reduced-motion`, a galeria fica reta e o texto
 * visível; as transformações só entram depois de o cliente assumir.
 */

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>['offset']>;

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
  /** `false` no SSR, na hidratação e com movimento reduzido. */
  animated: boolean;
  /** Fator (0–1) aplicado às transformações em telas estreitas. */
  intensity: number;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DEFAULT_OFFSET: ScrollOffset = ['start end', 'end end'];

/** Trechos do progresso usados por cada transformação. */
const ROTATE_PROGRESS = [0, 0.5];
const SCALE_PROGRESS = [0.5, 0.9];
const COLUMN_PROGRESS = [0.5, 1];

const SPRING_CONFIG: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
};

const blurVariants: Variants = {
  hidden: {
    filter: 'blur(8px)',
    opacity: 0,
  },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
  },
};

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);

  if (!context) {
    throw new Error('useContainerScrollContext must be used within a ContainerScroll Component');
  }

  return context;
}

/**
 * Media query segura para SSR: devolve `serverValue` no servidor e durante a
 * hidratação e atualiza logo depois, sem divergência de markup.
 */
function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Movimento liberado somente no cliente e sem `prefers-reduced-motion`. */
function useMotionAllowed(): boolean {
  return !useMediaQuery(REDUCED_MOTION_QUERY, true);
}

/** Aproxima `value` de `rest` conforme a intensidade (1 = valor original). */
function soften(value: number, rest: number, intensity: number): number {
  return rest + (value - rest) * intensity;
}

/** Mesma ideia para comprimentos com unidade, como `-10%`. */
function softenLength(value: string, intensity: number): string {
  const match = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(value.trim());
  return match ? `${Number(match[1]) * intensity}${match[2]}` : value;
}

interface ContainerScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trecho da rolagem mapeado de 0 a 1 (mesma sintaxe do `useScroll`). */
  offset?: ScrollOffset;
  /** Telas em que os movimentos são suavizados. */
  compactQuery?: string;
  /** Intensidade das transformações nessas telas. */
  compactIntensity?: number;
}

export function ContainerScroll({
  children,
  className,
  offset = DEFAULT_OFFSET,
  compactQuery = '(max-width: 639px)',
  compactIntensity = 0.65,
  ...props
}: ContainerScrollProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: scrollRef, offset});
  const animated = useMotionAllowed();
  const compact = useMediaQuery(compactQuery, false);
  const intensity = compact ? compactIntensity : 1;

  const context = React.useMemo(
    () => ({scrollYProgress, animated, intensity}),
    [scrollYProgress, animated, intensity],
  );

  return (
    <ContainerScrollContext.Provider value={context}>
      <div ref={scrollRef} className={cn('relative min-h-[120vh]', className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}

/**
 * Palco fixo. A perspectiva pode ser ajustada por CSS com
 * `--gallery-perspective` e `--gallery-perspective-origin`.
 */
export function ContainerSticky({className, style, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden', className)}
      style={{
        perspective: 'var(--gallery-perspective, 1000px)',
        perspectiveOrigin: 'var(--gallery-perspective-origin, center top)',
        ...style,
      }}
      {...props}
    />
  );
}

interface GalleryContainerProps extends HTMLMotionProps<'div'> {
  /** Inclinação em graus: do início do trilho até a metade. */
  rotateXRange?: [number, number];
  /** Escala na aproximação final (50% → 90% do trilho). */
  scaleRange?: [number, number];
}

export function GalleryContainer({
  children,
  className,
  style,
  rotateXRange = [75, 0],
  scaleRange = [1.2, 1],
  ...props
}: GalleryContainerProps) {
  const {scrollYProgress, animated, intensity} = useContainerScrollContext();

  const rotateX = useTransform(
    scrollYProgress,
    ROTATE_PROGRESS,
    rotateXRange.map((value) => soften(value, 0, intensity)),
  );
  const scale = useTransform(
    scrollYProgress,
    SCALE_PROGRESS,
    scaleRange.map((value) => soften(value, 1, intensity)),
  );

  return (
    <motion.div
      className={cn('relative grid size-full grid-cols-3 gap-2', className)}
      style={{
        rotateX: animated ? rotateX : 0,
        scale: animated ? scale : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface GalleryColProps extends HTMLMotionProps<'div'> {
  /** Deslocamento vertical na segunda metade do trilho. */
  yRange?: [string, string];
}

export function GalleryCol({className, style, yRange = ['0%', '-10%'], ...props}: GalleryColProps) {
  const {scrollYProgress, animated, intensity} = useContainerScrollContext();

  const y = useTransform(
    scrollYProgress,
    COLUMN_PROGRESS,
    yRange.map((value) => softenLength(value, intensity)),
  );

  return (
    <motion.div
      className={cn('relative flex w-full flex-col gap-2', className)}
      style={{
        y: animated ? y : 0,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Revela os filhos `ContainerAnimated` em sequência ao entrar na viewport.
 * O conteúdo nasce visível no HTML do servidor; o estado oculto só é aplicado
 * depois da hidratação e quando o movimento é permitido.
 */
export const ContainerStagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({className, viewport, transition, ...props}, ref) => {
    const animated = useMotionAllowed();

    return (
      <motion.div
        key={animated ? 'animated' : 'static'}
        ref={ref}
        className={cn('relative', className)}
        initial={animated ? 'hidden' : false}
        whileInView={animated ? 'visible' : undefined}
        viewport={{
          once: viewport?.once ?? true,
          ...viewport,
        }}
        transition={{
          delayChildren: stagger(0.1),
          ...transition,
        }}
        {...props}
      />
    );
  },
);

ContainerStagger.displayName = 'ContainerStagger';

export const ContainerAnimated = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({className, transition, ...props}, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={blurVariants}
        transition={{
          ...SPRING_CONFIG,
          ...transition,
        }}
        {...props}
      />
    );
  },
);

ContainerAnimated.displayName = 'ContainerAnimated';
