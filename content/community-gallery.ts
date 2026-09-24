/**
 * Galeria da seção "A experiência na prática" (#experiencia).
 *
 * PLACEHOLDERS TEMPORÁRIOS — o projeto ainda não tem fotos da comunidade.
 * As imagens abaixo vêm do Unsplash (licença Unsplash) e ilustram atividades
 * que acontecem na SouJunior; elas NÃO retratam integrantes reais. Por isso os
 * textos alternativos descrevem apenas a cena.
 *
 * Para usar as fotos oficiais: salve os arquivos em `public/images/comunidade/`,
 * troque `unsplash(...)` por `{src: '/images/comunidade/arquivo.webp'}` e
 * reescreva o `alt` descrevendo a cena real. A ordem de cada coluna define a
 * composição: as fotos 2 e 3 de cada coluna são as mais visíveis no fim da
 * animação.
 */

/** Proporções usadas na composição (largura / altura). */
export type GalleryRatio = '4/3' | '3/4' | '1/1';

/** Cores de destaque do design system (`[data-accent]` em styles/tokens.css). */
export type GalleryAccent = 'blue' | 'indigo' | 'cyan' | 'purple' | 'yellow';

export interface GalleryImageSource {
  src: string;
  srcSet?: string;
}

export interface CommunityPhoto extends GalleryImageSource {
  alt: string;
  ratio: GalleryRatio;
  /** Enquadramento para `object-fit: cover` (útil nas fotos locais). */
  position?: string;
  /** Rótulo curto exibido sobre a foto. Decorativo: o `alt` já descreve a cena. */
  label?: {text: string; accent: GalleryAccent};
}

const RATIO_SIZE: Record<GalleryRatio, [width: number, height: number]> = {
  '4/3': [4, 3],
  '3/4': [3, 4],
  '1/1': [1, 1],
};

const WIDTHS = [360, 540, 720, 960];

/** Dimensões intrínsecas usadas nos atributos `width`/`height` (evitam layout shift). */
export function photoSize(ratio: GalleryRatio, width = 720): {width: number; height: number} {
  const [w, h] = RATIO_SIZE[ratio];
  return {width, height: Math.round((width * h) / w)};
}

/** Foto do Unsplash já recortada na proporção do slot, com ponto focal. */
function unsplash(id: string, ratio: GalleryRatio, focus: [x: number, y: number] = [0.5, 0.5]): GalleryImageSource {
  const url = (width: number) => {
    const {height} = photoSize(ratio, width);
    return (
      `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}` +
      `&fit=crop&crop=focalpoint&fp-x=${focus[0]}&fp-y=${focus[1]}&auto=format&q=70`
    );
  };

  return {
    src: url(720),
    srcSet: WIDTHS.map((width) => `${url(width)} ${width}w`).join(', '),
  };
}

/** Três colunas (4 + 4 + 4). Em telas estreitas a terceira coluna é ocultada. */
export const communityGalleryColumns: CommunityPhoto[][] = [
  [
    {
      ...unsplash('1611224923853-80b023f02d71', '3/4'),
      ratio: '3/4',
      alt: 'Mão segurando notas adesivas com as etapas To Do, Doing e Done de um quadro kanban',
      label: {text: 'Ágil', accent: 'yellow'},
    },
    {
      ...unsplash('1531482615713-2afd69097998', '4/3', [0.55, 0.5]),
      ratio: '4/3',
      alt: 'Duas pessoas programando juntas diante de um notebook com código na tela',
      label: {text: 'Mentoria', accent: 'purple'},
    },
    {
      ...unsplash('1543269865-cbf427effbad', '4/3'),
      ratio: '4/3',
      alt: 'Quatro jovens conversando e sorrindo em volta de uma mesa com notebook',
    },
    {
      ...unsplash('1591115765373-5207764f72e7', '1/1'),
      ratio: '1/1',
      alt: 'Pessoa apresentando uma palestra para um público sentado em mesas compridas',
      label: {text: 'Evento', accent: 'blue'},
    },
  ],
  [
    {
      ...unsplash('1588196749597-9ff075ee6b5b', '1/1', [0.68, 0.5]),
      ratio: '1/1',
      alt: 'Notebook exibindo uma chamada de vídeo com várias pessoas, ao lado de uma caneca',
      label: {text: 'Daily', accent: 'cyan'},
    },
    {
      ...unsplash('1522071820081-009f0129c71c', '4/3'),
      ratio: '4/3',
      alt: 'Grupo trabalhando em notebooks ao redor de uma mesa de madeira',
      label: {text: 'Squad', accent: 'indigo'},
    },
    {
      ...unsplash('1557804506-669a67965ba0', '3/4', [0.45, 0.5]),
      ratio: '3/4',
      alt: 'Pessoa apresentando ideias em um quadro branco com notas adesivas para colegas sentados em sofás',
      label: {text: 'Workshop', accent: 'yellow'},
    },
    {
      ...unsplash('1581291518857-4e27b48ff24e', '4/3'),
      ratio: '4/3',
      alt: 'Mão desenhando o wireframe de uma interface em uma folha de papel',
      label: {text: 'UI & UX', accent: 'purple'},
    },
  ],
  [
    {
      ...unsplash('1552664730-d307ca884978', '4/3'),
      ratio: '4/3',
      alt: 'Equipe reunida em uma mesa enquanto uma pessoa organiza notas adesivas na parede',
      label: {text: 'Produto', accent: 'blue'},
    },
    {
      ...unsplash('1522202176988-66273c2fd55f', '4/3'),
      ratio: '4/3',
      alt: 'Três estudantes rindo enquanto trabalham em notebooks em uma mesa',
    },
    {
      ...unsplash('1603201667141-5a2d4c673378', '3/4'),
      ratio: '3/4',
      alt: 'Quatro pessoas reunidas em volta de um notebook, analisando algo juntas',
      label: {text: 'Code review', accent: 'indigo'},
    },
    {
      ...unsplash('1551288049-bebda4e38f71', '1/1'),
      ratio: '1/1',
      alt: 'Painel de dados com gráficos na tela de um notebook',
      label: {text: 'Data', accent: 'cyan'},
    },
  ],
];
