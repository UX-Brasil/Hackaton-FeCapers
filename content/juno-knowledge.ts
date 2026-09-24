import {SOUJUNIOR_CONTACT_CHANNELS} from './contact-channels';
import {links} from './links';
import {
  areas,
  communityFacts,
  communityRoles,
  footerCommunity,
  footerNavigation,
  fundedItems,
  initiatives,
  metrics,
  pillars,
  proposalPoints,
  supportOptions,
} from './site';
import {testimonials} from './testimonials';
import type {Area, SectionId} from './types';

/**
 * Base de conhecimento do Juno.
 *
 * Tudo o que a landing já publica vem de content/site.ts, links.ts e
 * testimonials.ts: se um texto mudar na página, muda também no Juno.
 * Aqui ficam apenas metadados do próprio Juno (palavras-chave, rótulos)
 * e o resumo de duas frases do hero e da seção "Nossa proposta".
 */
export const COMMUNITY_FACTS = {
  ...communityFacts,
  /** Resumo do hero e do card "Sou Júnior". */
  audience: 'quem está começando em tecnologia ou fazendo transição de carreira',
  /** Resumo da seção "Nossa proposta". */
  mission:
    'colocar profissionais em projetos reais, em constante evolução, onde se aprende fazendo — uma ponte entre estudar e atuar',
} as const;

/* ---------- Seções da landing ---------- */

const SECTION_FLAGS: Record<SectionId, true> = {
  sobre: true,
  pilares: true,
  areas: true,
  jornada: true,
  descubra: true,
  depoimentos: true,
  participe: true,
  mentores: true,
  iniciativas: true,
  apoie: true,
};

/** Seções para as quais o Juno pode levar a pessoa (na ordem da página). */
export const JUNO_SECTION_IDS = Object.keys(SECTION_FLAGS) as SectionId[];

export function isSectionId(value: unknown): value is SectionId {
  return typeof value === 'string' && value in SECTION_FLAGS;
}

/** Nome de cada seção, reaproveitado dos links do rodapé. */
export function sectionLabel(id: SectionId): string {
  const link = [...footerNavigation, ...footerCommunity].find(({href}) => href === `#${id}`);
  return link?.label ?? id;
}

/* ---------- Números ---------- */

export function formatMetric({value, suffix = ''}: {value: number; suffix?: string}) {
  return `${value.toLocaleString('pt-BR')}${suffix}`;
}

/* ---------- Áreas ---------- */

interface AreaProfile {
  /** `stack`: a descrição lista tecnologias; `focus`: descreve a atuação. */
  kind: 'stack' | 'focus';
  /** Outros nomes da própria área (ex.: "frontend"). Levam a uma resposta direta. */
  aliases: string[];
  /**
   * Termos próximos da área que a SouJunior não cita. Levam a
   * "a área mais próxima é…", nunca a uma afirmação sobre a stack.
   */
  related: string[];
}

const AREA_PROFILES: Record<string, AreaProfile> = {
  Business: {
    kind: 'focus',
    aliases: ['business', 'negocio', 'negocios', 'analise de negocios', 'analista de negocios'],
    related: ['viabilidade', 'estrategia'],
  },
  'Tech Recruiter': {
    kind: 'focus',
    aliases: ['tech recruiter', 'recruiter', 'recrutamento', 'recrutador', 'recrutadora', 'tech recruiting'],
    related: ['rh', 'recursos humanos', 'talentos', 'hunting', 'gestao de talentos'],
  },
  Produtos: {
    kind: 'focus',
    aliases: ['produtos', 'produto', 'product', 'product manager', 'product owner', 'gestao de produto', 'apm'],
    related: ['pm', 'po', 'discovery', 'roadmap', 'backlog'],
  },
  Ágil: {
    kind: 'focus',
    aliases: ['agil', 'agile', 'agilidade', 'agilista', 'agilistas', 'scrum master'],
    related: ['scrum', 'kanban', 'metodologias ageis'],
  },
  'Social Media': {
    kind: 'focus',
    aliases: ['social media', 'midias sociais', 'redes sociais'],
    related: ['marketing', 'comunicacao', 'conteudo', 'engajamento'],
  },
  'UI & UX Design': {
    kind: 'focus',
    aliases: ['ui & ux design', 'ux/ui', 'ui/ux', 'ux', 'ui', 'design', 'designer', 'ux design', 'ui design', 'product design'],
    related: ['figma', 'wireframe', 'wireframes', 'prototipo', 'prototipagem', 'usabilidade', 'pesquisa com usuarios', 'interface', 'interfaces'],
  },
  'Front-end': {
    kind: 'stack',
    aliases: ['front-end', 'frontend', 'front end', 'front', 'desenvolvimento front'],
    related: ['html', 'css', 'javascript', 'js', 'typescript', 'angular', 'interface', 'interfaces', 'site', 'sites', 'web'],
  },
  'Back-end': {
    kind: 'stack',
    aliases: ['back-end', 'backend', 'back end', 'back', 'desenvolvimento back', 'api'],
    related: ['nodejs', 'node.js', '.net', 'dotnet', 'spring', 'php', 'golang', 'servidor', 'banco de dados', 'sql'],
  },
  Data: {
    kind: 'focus',
    aliases: ['area de data', 'dados', 'data science', 'data analytics', 'engenharia de dados', 'analise de dados', 'analista de dados'],
    related: ['ciencia de dados', 'cientista de dados', 'bi', 'power bi', 'analytics', 'sql', 'machine learning', 'estatistica'],
  },
  Mobile: {
    kind: 'stack',
    aliases: ['mobile', 'desenvolvimento mobile', 'app', 'apps', 'aplicativo', 'aplicativos'],
    related: ['celular', 'android', 'ios'],
  },
  QA: {
    kind: 'focus',
    aliases: ['qa', 'quality assurance', 'qualidade', 'teste', 'testes', 'tester', 'testes automatizados', 'automacao de testes'],
    related: ['cypress', 'selenium', 'playwright'],
  },
  DevOps: {
    kind: 'stack',
    aliases: ['devops', 'dev ops'],
    related: ['infra', 'infraestrutura', 'cloud', 'aws', 'azure', 'gcp', 'deploy', 'linux', 'pipeline', 'sre'],
  },
};

export interface JunoArea extends Pick<Area, 'number' | 'name' | 'description'> {
  kind: AreaProfile['kind'];
  /** Itens citados na própria descrição da área (ex.: React, Next.js). */
  listed: string[];
  aliases: string[];
  related: string[];
}

/** Separa "React, Next.js, Tailwind, Vue" ou "Node, Java, Python, C# e APIs". */
function splitList(description: string) {
  return description
    .split(/\s*(?:,|&|\be\b)\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const JUNO_AREAS: JunoArea[] = areas.map(({number, name, description}) => {
  const profile = AREA_PROFILES[name] ?? {kind: 'focus', aliases: [], related: []};
  return {
    number,
    name,
    description,
    kind: profile.kind,
    listed: profile.kind === 'stack' ? splitList(description) : [],
    aliases: profile.aliases,
    related: profile.related,
  };
});

/* ---------- Participação, iniciativas e apoio ---------- */

export const JUNO_KNOWLEDGE = {
  facts: COMMUNITY_FACTS,
  metrics,
  proposalPoints,
  pillars,
  areas: JUNO_AREAS,
  roles: communityRoles,
  initiatives,
  support: {
    options: supportOptions,
    fundedItems,
    apoiaSe: links.apoiaSe,
  },
  testimonialRoles: [...new Set(testimonials.map(({role}) => role))],
  channels: SOUJUNIOR_CONTACT_CHANNELS,
} as const;

/**
 * Destinos externos que o Juno pode oferecer. Qualquer link fora desta lista
 * é descartado — inclusive os sugeridos por um provedor remoto.
 */
export const JUNO_ALLOWED_LINKS = new Set<string>(
  [
    ...Object.values(links),
    ...communityRoles.map(({href}) => href),
    ...initiatives.map(({href}) => href),
    ...SOUJUNIOR_CONTACT_CHANNELS.map(({href}) => href),
  ].filter((href): href is string => typeof href === 'string' && /^(https:|mailto:)/.test(href)),
);
