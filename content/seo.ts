/**
 * Dados de SEO e compartilhamento: metadados, imagem Open Graph, manifest,
 * JSON-LD, llms.txt e humans.txt leem daqui.
 */

export const siteName = 'SouJunior';

/** Título da aba e dos cartões de compartilhamento. */
export const siteTitle = 'SouJunior — Sua primeira experiência real em tecnologia';

/** Frase de efeito do hero; o destaque aparece em outra cor na imagem Open Graph. */
export const taglineLead = 'Sua primeira experiência real em tecnologia';
export const taglineHighlight = 'começa aqui.';
export const tagline = `${taglineLead} ${taglineHighlight}`;

/** Descrição curta (até ~160 caracteres) para buscadores e cartões. */
export const siteDescription =
  'Comunidade gratuita onde iniciantes ganham experiência real em tecnologia: projetos de verdade, squads multidisciplinares e mentoria de profissionais do mercado.';

/** Descrição longa, usada no JSON-LD e no llms.txt. */
export const siteLongDescription =
  'A SouJunior é uma comunidade aberta e 100% gratuita onde pessoas em início de carreira ou em transição para tecnologia trabalham em produtos digitais reais, em squads multidisciplinares com Scrum e Kanban, recebem mentoria de profissionais experientes e ganham visibilidade com recrutadores parceiros.';

export const keywords = [
  'SouJunior',
  'comunidade de tecnologia',
  'comunidade gratuita',
  'primeiro emprego em tecnologia',
  'primeira experiência em tecnologia',
  'transição de carreira',
  'júnior',
  'desenvolvedor júnior',
  'estágio em tecnologia',
  'projetos reais',
  'squads',
  'mentoria em tecnologia',
  'mentoria gratuita',
  'portfólio',
  'empregabilidade',
  'front-end',
  'back-end',
  'mobile',
  'UI/UX design',
  'produto',
  'dados',
  'QA',
  'DevOps',
  'agilidade',
  'Scrum',
  'tech recruiter',
  'voluntariado em tecnologia',
  'Hackathon SouJunior',
];

/** Equipe que criou a landing (créditos em metadados, JSON-LD e humans.txt). */
export const team = {
  name: 'Equipe Fecapers',
  event: 'Hackathon SouJunior',
  repository: 'https://github.com/UX-Brasil/Hackaton-FeCapers',
  members: [
    {name: 'Caio Moraes', github: 'caiomorhaes'},
    {name: 'João Guilherme Gumiero de Micheli', github: 'JonasCrack'},
    {name: 'Julia Damásio', github: 'Juliadamassio'},
    {name: 'Vinicius Binda', github: 'VinnizzZ'},
    {name: 'Vinícius Nishimura', github: 'Vinishireis'},
  ],
} as const;

export const githubUrl = (user: string) => `https://github.com/${user}`;
