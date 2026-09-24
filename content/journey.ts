import type {JourneyStep} from './types';

/**
 * Seção "Sua jornada na SouJunior": como seria a experiência de quem entra.
 * Nada aqui promete vaga ou resultado; a jornada mostra uma evolução possível.
 */

export const journeyIntro = {
  eyebrow: 'Da primeira contribuição à experiência real',
  titleLines: ['Sua jornada pode', 'começar aqui.'],
  lead: [
    'Você não precisa chegar sabendo tudo.',
    'Na SouJunior, você entra para aprender fazendo, colaborar com outras pessoas e evoluir através de experiências que aproximam você da rotina real de tecnologia.',
  ],
  juno: 'Todo mundo começa de algum lugar.',
};

export const journeySteps: JourneyStep[] = [
  {
    id: 1,
    label: 'Você chega',
    title: 'Você chega como está.',
    text: [
      'Não importa se você ainda está estudando, mudando de carreira ou buscando sua primeira experiência prática.',
      'O primeiro passo é encontrar onde você quer começar.',
    ],
    highlight: 'Você não precisa chegar pronto.',
    extra: 'notNeeded',
    accent: 'yellow',
  },
  {
    id: 2,
    label: 'Encontra sua área',
    title: 'Você encontra seu lugar.',
    text: [
      'Front-end, Back-end, Produto, Design, QA, Dados, Mobile, DevOps e muitas outras áreas trabalham juntas dentro da comunidade.',
    ],
    extra: 'areas',
    accent: 'cyan',
  },
  {
    id: 3,
    label: 'Entra em uma equipe',
    title: 'Você passa a fazer parte de uma squad.',
    text: [
      'Aqui você começa a colaborar com pessoas de diferentes áreas, participar de alinhamentos e entender como um produto digital evolui em equipe.',
    ],
    highlight: 'Você não pratica sozinho.',
    extra: 'squad',
    accent: 'blue',
  },
  {
    id: 4,
    label: 'Constrói de verdade',
    title: 'Você deixa de apenas estudar e começa a construir.',
    text: [
      'Você participa de projetos, resolve problemas, recebe feedback e começa a entender decisões que cursos e tutoriais nem sempre conseguem reproduzir.',
    ],
    extra: 'practice',
    accent: 'purple',
  },
  {
    id: 5,
    label: 'Evolui profissionalmente',
    title: 'Você começa a enxergar sua evolução.',
    text: [
      'Cada experiência ajuda você a desenvolver repertório, confiança, comunicação, trabalho em equipe e maturidade profissional.',
    ],
    highlight: 'Você chega mais preparado para buscar oportunidades.',
    extra: 'growth',
    accent: 'indigo',
  },
];

/** Etapa 01: o que não é pré-requisito (coerente com o público "começando ou em transição"). */
export const notNeeded = {
  title: 'Você não precisa…',
  items: ['ter anos de experiência;', 'dominar uma stack inteira;', 'saber tudo antes de entrar.'],
  closing: 'Você precisa estar disposto a aprender, colaborar e construir.',
};

/** Etapa 02: quantas áreas aparecem como exemplo antes do link para todas. */
export const journeyAreaPreview = 8;

/** Etapa 03: exemplo ilustrativo de squad, não uma composição fixa. */
export const squadExample = [
  {label: 'Você', short: null, accent: 'yellow'},
  {label: 'Front-end', short: 'FE', accent: 'blue'},
  {label: 'Back-end', short: 'BE', accent: 'purple'},
  {label: 'UI & UX', short: 'UX', accent: 'cyan'},
  {label: 'Produto', short: 'PO', accent: 'indigo'},
  {label: 'QA', short: 'QA', accent: 'blue'},
] as const;

/** Etapa 04. */
export const practiceTags = ['Projetos', 'Feedback', 'Colaboração', 'Entregas'];

/** Etapa 04: evolução possível, apresentada como conceito e não como resultado garantido. */
export const journeyShift = {
  before: 'Só tenho projetos de curso.',
  after: 'Já consigo explicar como trabalhei em equipe, recebi feedback e participei da evolução de um produto.',
  note: 'Uma evolução possível, não uma promessa: cada jornada é única.',
};

/** Etapa 05: trecho de um depoimento que já está na landing (content/testimonials.ts). */
export const journeyTestimonial = {
  name: 'Ana Santos',
  excerpt: 'Saí do tutorial hell direto para um repositório profissional.',
};

export const journeyClosing = {
  lines: ['Ninguém começa experiente.', 'Experiência começa quando alguém te dá espaço para praticar.'],
  complement: 'É esse espaço que a SouJunior busca criar.',
  cta: 'Quero começar minha jornada',
};
