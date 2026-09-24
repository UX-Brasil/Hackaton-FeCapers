import {ArrowDown} from 'lucide-react';

import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from '@/components/ui/animated-gallery';
import {Lines} from '@/components/ui/lines';
import {communityGalleryColumns, photoSize, type CommunityPhoto} from '@/content/community-gallery';

/**
 * Deslocamento de cada coluna na segunda metade do trilho: as laterais descem
 * e a central sobe, em percentuais da altura da coluna.
 */
const COLUMN_Y_RANGES: [string, string][] = [
  ['-8%', '2%'],
  ['10%', '-2%'],
  ['-8%', '2%'],
];

/** Largura de cada coluna: 2 colunas no celular, 3 a partir de 640px. */
const PHOTO_SIZES = '(min-width: 640px) min(31vw, 22rem), 46vw';

function GalleryPhoto({photo}: {photo: CommunityPhoto}) {
  const {width, height} = photoSize(photo.ratio);

  return (
    <figure className="experience__photo" style={{aspectRatio: photo.ratio}} data-accent={photo.label?.accent}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={photo.srcSet ? PHOTO_SIZES : undefined}
        alt={photo.alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={photo.position ? {objectPosition: photo.position} : undefined}
      />
      {photo.label && (
        <span className="experience__tag" aria-hidden="true">
          {photo.label.text}
        </span>
      )}
    </figure>
  );
}

/**
 * "A experiência na prática": ponte visual entre os Pilares e as Áreas.
 * A galeria entra inclinada e fica de frente conforme a rolagem avança;
 * o palco fica fixo sob o cabeçalho sem nunca bloquear o scroll.
 */
export function CommunityGallerySection() {
  return (
    <section id="experiencia" className="section experience" aria-labelledby="experiencia-title" data-nav="sobre">
      <div className="wrap">
        <ContainerStagger
          className="section-header section-header--split experience__header"
          viewport={{margin: '0px 0px -12% 0px'}}
        >
          <div>
            <ContainerAnimated>
              <p className="eyebrow">A experiência na prática</p>
            </ContainerAnimated>
            <ContainerAnimated>
              <h2 id="experiencia-title" className="section-title">
                <Lines
                  lines={[
                    'Aqui, você não fica',
                    'só na teoria.',
                    <span className="text-accent" key="accent">
                      Você constrói.
                    </span>,
                  ]}
                />
              </h2>
            </ContainerAnimated>
          </div>

          <div>
            <ContainerAnimated>
              <p className="lead">
                Na SouJunior, aprendizado acontece em movimento. São squads colaborando, mentores compartilhando
                experiência, pessoas de diferentes áreas resolvendo problemas reais e projetos evoluindo todos os dias.
              </p>
            </ContainerAnimated>
            <ContainerAnimated>
              <p className="experience__hint">
                <ArrowDown size={16} strokeWidth={2.25} aria-hidden="true" />
                Explore um pouco do que acontece por aqui.
              </p>
            </ContainerAnimated>
          </div>
        </ContainerStagger>
      </div>

      <ContainerScroll className="experience__scroll">
        <ContainerSticky className="experience__stage">
          <GalleryContainer className="experience__gallery">
            {communityGalleryColumns.map((column, index) => (
              <GalleryCol key={index} className="experience__col" yRange={COLUMN_Y_RANGES[index]}>
                {column.map((photo) => (
                  <GalleryPhoto key={photo.src} photo={photo} />
                ))}
              </GalleryCol>
            ))}
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>

      <div className="wrap experience__bridge">
        <span className="experience__bridge-icon" aria-hidden="true">
          <ArrowDown size={18} strokeWidth={2.25} />
        </span>
        <p>
          E tudo isso acontece em diferentes áreas. <strong>Agora, encontre onde você pode contribuir.</strong>
        </p>
      </div>
    </section>
  );
}
