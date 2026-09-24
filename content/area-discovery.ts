import type {AreaId, DiscoveryQuestion} from './types';

/**
 * "Descubra seu lugar": perguntas rápidas que sugerem áreas para conhecer.
 * Não é teste vocacional nem diagnóstico. As sugestões são só um ponto de partida.
 * A pontuação é local e determinística (lib/area-discovery.ts).
 */

export const discoveryIntro = {
  eyebrow: 'Ainda não sabe por onde começar?',
  title: 'Descubra onde você pode se encaixar.',
  lead: 'Responda algumas perguntas rápidas e conheça áreas da SouJunior que podem ter mais relação com o que você gosta de fazer.',
  note: 'As sugestões são apenas um ponto de partida para você conhecer melhor as áreas.',
  juno: 'Não existe resposta certa. Escolha o que mais combina com você.',
};

export const discoveryQuestions: DiscoveryQuestion[] = [
  {
    id: 'atencao',
    question: 'O que mais chama sua atenção em um projeto?',
    options: [
      {label: 'Criar interfaces e experiências visuais', scores: {'ui-ux': 3, 'front-end': 2, mobile: 2}},
      {label: 'Entender como sistemas funcionam por trás', scores: {'back-end': 3, devops: 2, data: 1}},
      {label: 'Organizar ideias e definir prioridades', scores: {produtos: 3, agil: 2, business: 1}},
      {label: 'Entender pessoas e suas necessidades', scores: {'ui-ux': 2, produtos: 2, 'tech-recruiter': 2, business: 1}},
      {label: 'Analisar informações e encontrar padrões', scores: {data: 3, business: 2, qa: 1}},
      {label: 'Garantir que tudo funcione corretamente', scores: {qa: 3, devops: 1, 'back-end': 1}},
    ],
  },
  {
    id: 'atividade',
    question: 'Qual atividade parece mais interessante?',
    options: [
      {label: 'Construir uma tela', scores: {'front-end': 3, mobile: 2, 'ui-ux': 1}},
      {label: 'Criar uma API', scores: {'back-end': 3, devops: 1}},
      {label: 'Conversar com usuários', scores: {'ui-ux': 3, produtos: 2}},
      {label: 'Planejar uma entrega', scores: {agil: 3, produtos: 2}},
      {label: 'Encontrar problemas em um produto', scores: {qa: 3, 'ui-ux': 1}},
      {label: 'Trabalhar com dados', scores: {data: 3, business: 1}},
      {label: 'Automatizar processos', scores: {devops: 3, qa: 1, 'back-end': 1}},
      {label: 'Criar conteúdo e comunicação', scores: {'social-media': 3, business: 1}},
    ],
  },
  {
    id: 'contribuicao',
    question: 'Como você prefere contribuir?',
    options: [
      {label: 'Criando', scores: {'front-end': 2, 'ui-ux': 2, mobile: 2, 'social-media': 1}},
      {label: 'Organizando', scores: {agil: 3, produtos: 1}},
      {label: 'Analisando', scores: {data: 2, business: 2, qa: 1}},
      {label: 'Pesquisando', scores: {'ui-ux': 2, produtos: 1, data: 1}},
      {label: 'Comunicando', scores: {'social-media': 3, 'tech-recruiter': 1, business: 1}},
      {label: 'Testando', scores: {qa: 3}},
      {label: 'Apoiando pessoas', scores: {'tech-recruiter': 3, agil: 1}},
    ],
  },
  {
    id: 'momento',
    question: 'Qual frase mais combina com você hoje?',
    options: [
      {label: 'Quero começar a programar profissionalmente', scores: {'front-end': 2, 'back-end': 2, mobile: 2}},
      {label: 'Gosto de entender pessoas e produtos', scores: {produtos: 3, 'ui-ux': 1, business: 1}},
      {label: 'Gosto de organização e processos', scores: {agil: 3, business: 1}},
      {label: 'Tenho interesse em dados', scores: {data: 3}},
      {label: 'Gosto de design e experiência do usuário', scores: {'ui-ux': 3, 'front-end': 1}},
      {label: 'Tenho interesse em infraestrutura e automação', scores: {devops: 3, 'back-end': 1}},
      {label: 'Quero trabalhar com pessoas e talentos', scores: {'tech-recruiter': 3, 'social-media': 1}},
    ],
  },
];

/** Por que cada área apareceu. Fala do que a pessoa escolheu, nunca de "quem ela é". */
export const areaReasons: Record<AreaId, string> = {
  business: 'Você mostrou interesse em analisar cenários e entender o que faz sentido para o negócio.',
  'tech-recruiter': 'Você mostrou interesse em pessoas, talentos e em apoiar quem está chegando.',
  produtos: 'Seu interesse em organização, prioridades e visão do produto pode combinar com essa área.',
  agil: 'Você mostrou interesse em organizar entregas, processos e o ritmo do time.',
  'social-media': 'Você mostrou interesse em comunicação, conteúdo e em contar boas histórias.',
  'ui-ux': 'Você mostrou interesse em experiência, design e em resolver problemas para pessoas.',
  'front-end': 'Você demonstrou interesse em interfaces, construção e experiência digital.',
  'back-end': 'Você mostrou interesse em entender como os sistemas funcionam por trás e em criar a lógica de um produto.',
  data: 'Você mostrou interesse em analisar informações e encontrar padrões.',
  mobile: 'Você mostrou interesse em construir telas e experiências que as pessoas usam no dia a dia.',
  qa: 'Você mostrou interesse em garantir qualidade e encontrar problemas antes que cheguem às pessoas.',
  devops: 'Você mostrou interesse em infraestrutura, automação e em manter tudo funcionando.',
};

export const discoveryResult = {
  title: 'Talvez você queira conhecer:',
  lead: 'Pelo que você escolheu, estas áreas podem ser interessantes para você conhecer:',
  areaCta: 'Conhecer essa área',
  notDefinitive:
    'Nenhuma dessas precisa ser uma decisão definitiva. Na SouJunior, você também pode conhecer outras áreas e entender melhor onde deseja evoluir.',
  juno: 'Essas sugestões são só o começo.',
  junoCta: 'Conversar com o Juno sobre essas áreas',
  ctaTitle: 'Encontrou algo que despertou seu interesse?',
  ctaText: 'Conheça as formas de participar e descubra como começar sua experiência na comunidade.',
  ctaPrimary: 'Quero fazer parte',
  ctaSecondary: 'Explorar todas as áreas',
  restart: 'Refazer',
  empty: 'Escolha pelo menos uma resposta para ver sugestões.',
};

/** Primeira mensagem do Juno quando a pessoa pede para conversar sobre as sugestões. */
export function junoDiscoveryMessage(areaNames: string[]) {
  const list =
    areaNames.length > 1 ? `${areaNames.slice(0, -1).join(', ')} e ${areaNames[areaNames.length - 1]}` : areaNames[0];
  return {
    content: [
      `Vi que ${list} ${areaNames.length > 1 ? 'apareceram' : 'apareceu'} como sugestões para você.`,
      'Posso explicar a diferença entre essas áreas ou te ajudar a conhecer cada uma.',
    ].join('\n\n'),
    followUps: areaNames.map((name) => `O que faz a área de ${name}?`),
  };
}
