import {
  JUNO_KNOWLEDGE as K,
  sectionLabel,
  type JunoArea,
} from '@/content/juno-knowledge';
import {SOUJUNIOR_CONTACT_CHANNELS, SOUJUNIOR_SUPPORT_CHANNELS} from '@/content/contact-channels';
import type {CommunityRole, Metric, SectionId} from '@/content/types';
import {joinList, lowerFirst, normalize} from './text';
import type {JunoAction} from './types';

/**
 * Respostas do Juno. Cada texto é montado a partir da base de conhecimento:
 * nada de datas, links, números ou processos que a SouJunior não publicou.
 */
export interface Draft {
  answer: string;
  actions?: JunoAction[];
  followUps?: string[];
  requiresHumanSupport?: boolean;
  /** Uma frase com o que é certo — usada quando só parte da pergunta tem resposta. */
  summary?: string;
}

const scroll = (target: SectionId, label: string): JunoAction => ({type: 'scroll', target, label});
const link = (href: string, label: string): JunoAction => ({type: 'link', href, label});
const CONTACT: JunoAction = {type: 'contact', label: 'Falar com a SouJunior'};

export const INITIAL_SUGGESTIONS = [
  'Como faço para participar?',
  'Quais áreas existem?',
  'Quero ser mentor.',
  'A SouJunior é gratuita?',
  'Como posso apoiar?',
];

/* ---------- Auxiliares ---------- */

function findRole(term: string): CommunityRole | undefined {
  return K.roles.find(({title}) => normalize(title).includes(term));
}

function findPillar(term: string) {
  return K.pillars.find(({title}) => normalize(title).includes(term));
}

function findPoint(term: string) {
  return K.proposalPoints.find(({title}) => normalize(title).includes(term));
}

/** Link do formulário, se publicado; senão, o aviso "será divulgado em breve". */
function formStatus(role: CommunityRole | undefined) {
  if (!role) return {note: '', actions: [] as JunoAction[]};
  if (role.href) return {note: '', actions: [link(role.href, role.cta)]};
  return {note: role.pendingMessage, actions: [] as JunoAction[]};
}

function metricPhrase({value, suffix, label}: Metric) {
  const number = value.toLocaleString('pt-BR');
  const text = label.toLowerCase();
  return suffix === '+' ? `mais de ${number} ${text}` : `${number}${suffix ?? ''} ${text}`;
}

const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Existe algum canal publicado para enviar uma dúvida? */
const hasSupportChannels = SOUJUNIOR_SUPPORT_CHANNELS.length > 0;

const SEND_THROUGH_CHANNELS = hasSupportChannels
  ? 'Você pode enviar sua dúvida pelos canais oficiais da SouJunior.'
  : 'Os canais oficiais de contato ainda não foram publicados nesta página, então não tenho um endereço confirmado para te passar agora. Deixei sua dúvida pronta para você copiar e enviar à equipe.';

function findMetric(term: string) {
  return K.metrics.find(({label}) => normalize(label).includes(term));
}

function roleLine(role: CommunityRole) {
  return `• ${role.title} — ${lowerFirst(role.audience)}`;
}

const paragraphs = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('\n\n');

const areaCount = K.areas.length;

/* ---------- Comunidade ---------- */

export function about(): Draft {
  const members = findMetric('membro');
  const points = K.proposalPoints.map(({title}) => title.toLowerCase());
  return {
    answer: paragraphs(
      `A SouJunior é uma comunidade aberta e gratuita para ${K.facts.audience}. A proposta é ${K.facts.mission}.`,
      points.length > 0 && `Na prática, isso envolve ${joinList(points)}.`,
      members && `Hoje são ${metricPhrase(members)} em ${areaCount} áreas profissionais.`,
    ),
    summary: `A SouJunior é uma comunidade aberta e gratuita para ${K.facts.audience}.`,
    actions: [scroll('sobre', 'Conhecer a proposta')],
    followUps: ['Como faço para participar?', 'Quais áreas existem?'],
  };
}

/** `question` normalizada: "é pago?" pede "Não", "é gratuita?" pede "Sim". */
export function free(question: string): Draft {
  const opener = /\b(gratis|gratuit\w*|de graca|free)\b/.test(question)
    ? 'Sim! '
    : /\b(pago|paga|cobra|cobrado|cobram|mensalidade|taxa)\b/.test(question)
      ? 'Não. '
      : '';
  return {
    answer: paragraphs(
      `${opener}A SouJunior é uma comunidade aberta e 100% gratuita: sem custos e sem barreiras para participar.`,
      'Quem quiser pode apoiar financeiramente pelo Apoia.se, mas isso é opcional.',
    ),
    summary: 'A SouJunior é uma comunidade aberta e 100% gratuita.',
    actions: [scroll('participe', 'Ver formas de participar')],
  };
}

export function audience(): Draft {
  return {
    answer: paragraphs(
      `A SouJunior é voltada principalmente para ${K.facts.audience}. Existem caminhos para diferentes momentos:`,
      K.roles.map(roleLine).join('\n'),
      'Critérios específicos de inscrição não estão publicados aqui.',
    ),
    summary: `A SouJunior é voltada principalmente para ${K.facts.audience}.`,
    actions: [scroll('participe', 'Ver formas de participar')],
  };
}

export function participate(area?: JunoArea): Draft {
  const junior = findRole('junior');
  const form = formStatus(junior);
  return {
    answer: paragraphs(
      area && `A área de ${area.name} faz parte da SouJunior.`,
      'Você pode participar da SouJunior de diferentes formas:',
      K.roles.map(roleLine).join('\n'),
      junior &&
        `Se você busca sua primeira experiência prática em tecnologia, “${junior.title}” é o melhor ponto de partida.`,
      form.note,
    ),
    summary: `Dá para participar como ${joinList(K.roles.map(({title}) => title))}.`,
    actions: [scroll('participe', 'Ver formas de participar'), ...form.actions],
    followUps: ['Como entro em uma squad?', 'A SouJunior é gratuita?'],
  };
}

export function squads(area?: JunoArea): Draft {
  const point = findPoint('squad');
  const junior = findRole('junior');
  const form = formStatus(junior);
  return {
    answer: paragraphs(
      point && `As squads da SouJunior são ${lowerFirst(point.text).replace(/\.$/, '')}, desenvolvendo produtos digitais.`,
      junior &&
        `Para entrar em uma squad${area ? ` de ${area.name}` : ''}, o caminho é participar como “${junior.title}” — ${lowerFirst(junior.audience)}.`,
      form.note,
      'Os detalhes de como as squads são formadas não estão publicados aqui.',
    ),
    summary: point ? `As squads são ${lowerFirst(point.text)}` : undefined,
    actions: [scroll('participe', 'Ver formas de participar'), ...form.actions],
    followUps: ['Quais áreas existem?'],
  };
}

export function pillarsOverview(): Draft {
  return {
    answer: paragraphs(
      `A SouJunior se apoia em ${K.pillars.length} pilares:`,
      K.pillars.map(({title}) => `• ${title}`).join('\n'),
    ),
    actions: [scroll('pilares', 'Ver os pilares')],
    followUps: ['Como funciona a mentoria?', 'Como entro em uma squad?'],
  };
}

function pillar(term: string, extra?: string): Draft | null {
  const item = findPillar(term);
  if (!item) return null;
  return {
    answer: paragraphs(`Um dos pilares da SouJunior é “${item.title}”: a ideia é ${lowerFirst(item.text)}`, extra),
    summary: `Um dos pilares da SouJunior é “${item.title}”.`,
    actions: [scroll('pilares', 'Ver os pilares')],
  };
}

export function projects(): Draft | null {
  const code = findPoint('codigo');
  return pillar('projetos', code && `O trabalho envolve ${lowerFirst(code.text)}`);
}

export function routine(): Draft | null {
  return pillar('equipes');
}

export function networking(): Draft | null {
  return pillar('comunidade');
}

export function employability(): Draft | null {
  return pillar('empregabilidade', 'Não tenho informações sobre vagas abertas ou contratações.');
}

export function mentorship(): Draft {
  const base = pillar('mentoria');
  return {
    answer: paragraphs(base?.answer, 'Formato e frequência das mentorias não estão descritos aqui.'),
    summary: base?.summary,
    actions: [scroll('pilares', 'Ver os pilares')],
    followUps: ['Quero ser mentor.'],
  };
}

export function metricsAnswer(): Draft {
  return {
    answer: `A SouJunior em números:\n${K.metrics.map((metric) => `• ${upperFirst(metricPhrase(metric))}`).join('\n')}`,
    actions: [scroll('sobre', 'Conhecer a SouJunior')],
  };
}

export function testimonialsAnswer(): Draft {
  return {
    answer: `Na seção de depoimentos, pessoas da comunidade contam como foi a experiência na SouJunior — em papéis como ${joinList(K.testimonialRoles)}.`,
    actions: [scroll('depoimentos', 'Ler os depoimentos')],
  };
}

/* ---------- Áreas ---------- */

export function areasList(): Draft {
  return {
    answer: paragraphs(
      `A SouJunior reúne ${areaCount} áreas de atuação:`,
      `${joinList(K.areas.map(({name}) => name))}.`,
      'Quer ajuda para descobrir qual combina com você?',
    ),
    summary: `A SouJunior reúne ${areaCount} áreas de atuação.`,
    actions: [scroll('areas', `Ver as ${areaCount} áreas`)],
    followUps: ['Qual área usa React?', 'Não sei qual área escolher'],
  };
}

function describeArea(area: JunoArea) {
  return area.kind === 'stack'
    ? `${area.name}, que trabalha com tecnologias como ${joinList(area.listed)}`
    : `${area.name} (${area.description})`;
}

export function areaAnswer(area: JunoArea, direct: boolean, askedIfExists: boolean): Draft {
  const intro = direct
    ? `${askedIfExists ? 'Tem sim! ' : ''}A SouJunior tem uma área de ${describeArea(area)}.`
    : `A área mais próxima disso é ${describeArea(area)}.`;
  return {
    answer: paragraphs(
      intro,
      !direct && area.kind === 'stack' && 'Não tenho a lista completa de tecnologias usadas em cada projeto.',
      'Quer que eu te leve até a seção de áreas?',
    ),
    summary: `A SouJunior tem uma área de ${area.name}.`,
    actions: [scroll('areas', `Ver a área de ${area.name}`)],
    followUps: ['Como faço para participar?'],
  };
}

export function multipleAreas(matches: JunoArea[]): Draft {
  return {
    answer: paragraphs(
      'Isso se conecta com mais de uma área da SouJunior:',
      matches.map((area) => `• ${area.name} — ${area.description}`).join('\n'),
      'Quer conhecer todas as áreas?',
    ),
    actions: [scroll('areas', `Ver as ${areaCount} áreas`)],
  };
}

export function areaChoice(): Draft {
  return {
    answer: paragraphs(
      'Posso te ajudar com isso.',
      'Temos uma experiência rápida que sugere algumas áreas para você conhecer, com base no que você gosta de fazer.',
      `A SouJunior possui ${areaCount} áreas diferentes. Se você gosta de construir interfaces, Front-end pode ser um caminho. Se prefere APIs e lógica de servidor, vale conhecer Back-end. Se você se interessa mais por pessoas, produto ou comunicação, dê uma olhada em Produtos, Ágil, UI & UX Design, Tech Recruiter, Social Media e Business.`,
    ),
    actions: [scroll('descubra', 'Descobrir meu lugar'), scroll('areas', `Ver as ${areaCount} áreas`)],
    followUps: ['Gosto de criar interfaces', 'Prefiro trabalhar com dados'],
  };
}

/* ---------- Mentoria, liderança e apoio ---------- */

export function beMentor(area?: JunoArea): Draft {
  const mentor = findRole('mentor');
  const form = formStatus(mentor);
  return {
    answer: paragraphs(
      mentor &&
        `Você pode participar como mentor${area ? ` na área de ${area.name}` : ''}: ${lowerFirst(mentor.text)}`,
      `Também existem outras formas de apoiar, como ${joinList(K.support.options.map(({title}) => title))}.`,
      form.note,
    ),
    summary: mentor ? `“${mentor.title}” é ${lowerFirst(mentor.audience)}.` : undefined,
    actions: [scroll('mentores', 'Conhecer a mentoria'), scroll('apoie', 'Ver formas de apoiar'), ...form.actions],
  };
}

export function head(area?: JunoArea): Draft {
  const role = findRole('head');
  const form = formStatus(role);
  return {
    answer: paragraphs(
      role && `“${role.title}” é ${lowerFirst(role.audience)}${area ? `, como ${area.name}` : ''}: ${lowerFirst(role.text)}`,
      form.note,
    ),
    summary: role ? `“${role.title}” é ${lowerFirst(role.audience)}.` : undefined,
    actions: [scroll('participe', 'Ver formas de participar'), ...form.actions],
  };
}

export function support(): Draft {
  return {
    answer: paragraphs(
      'Você pode apoiar a SouJunior de várias formas:',
      K.support.options.map(({title}) => `• ${title}`).join('\n'),
      `Também dá para apoiar financeiramente pelo Apoia.se — isso ajuda a custear ${joinList(K.support.fundedItems.map((item) => item.toLowerCase()))}.`,
    ),
    summary: `Dá para apoiar como ${joinList(K.support.options.map(({title}) => title))}, ou pelo Apoia.se.`,
    actions: [scroll('apoie', 'Ver formas de apoiar'), link(K.support.apoiaSe, 'Abrir o Apoia.se')],
  };
}

export function company(): Draft {
  const partner = K.support.options.find(({title}) => normalize(title).includes('empresa'));
  return {
    answer: paragraphs(
      partner && `Uma empresa pode apoiar como ${partner.title}: ${lowerFirst(partner.text)}`,
      'Para combinar uma parceria, o melhor caminho é falar diretamente com a equipe da SouJunior.',
    ),
    summary: partner ? `Empresas podem apoiar como ${partner.title}.` : undefined,
    actions: [scroll('apoie', 'Ver formas de apoiar')],
    requiresHumanSupport: true,
  };
}

export function apoiaSe(): Draft {
  return {
    answer: paragraphs(
      `O Apoia.se é a forma de apoiar a SouJunior financeiramente. As contribuições ajudam a custear ${joinList(K.support.fundedItems.map((item) => item.toLowerCase()))}.`,
      'Valores e condições estão na própria página da campanha.',
    ),
    actions: [link(K.support.apoiaSe, 'Abrir o Apoia.se'), scroll('apoie', 'Ver formas de apoiar')],
  };
}

/* ---------- Iniciativas ---------- */

export function initiative(term: string): Draft | null {
  const item = K.initiatives.find(({name}) => normalize(name).includes(term));
  if (!item) return null;
  return {
    answer: paragraphs(
      `A ${item.name} é uma iniciativa da SouJunior de ${item.category.toLowerCase()}. ${item.text}`,
      !item.href && item.pendingMessage,
    ),
    summary: `A ${item.name} é uma iniciativa de ${item.category.toLowerCase()}.`,
    actions: item.href
      ? [link(item.href, `Conhecer a ${item.name}`), scroll('iniciativas', 'Ver iniciativas')]
      : [scroll('iniciativas', 'Ver iniciativas')],
  };
}

export function initiativesList(): Draft {
  return {
    answer: paragraphs(
      `A SouJunior tem ${K.initiatives.length} iniciativas complementares:`,
      K.initiatives.map(({name, category}) => `• ${name} — ${category}`).join('\n'),
      'Quer saber mais sobre alguma delas?',
    ),
    actions: [scroll('iniciativas', 'Ver iniciativas')],
    followUps: K.initiatives.map(({name}) => `O que é ${name}?`),
  };
}

/* ---------- Canais e contato ---------- */

export function socialChannels(): Draft {
  if (SOUJUNIOR_CONTACT_CHANNELS.length > 0) {
    return {
      answer: 'Estes são os canais oficiais da SouJunior:',
      actions: SOUJUNIOR_CONTACT_CHANNELS.map(({href, label}) => link(href, label)),
    };
  }
  return {
    answer: paragraphs(
      'Os endereços oficiais das redes sociais da SouJunior ainda não foram publicados nesta página — prefiro não te passar um link que pode estar errado.',
      'Por enquanto, o endereço externo confirmado é a campanha no Apoia.se.',
    ),
    actions: [link(K.support.apoiaSe, 'Abrir o Apoia.se')],
  };
}

export function contact(): Draft {
  return {answer: SEND_THROUGH_CHANNELS, requiresHumanSupport: true};
}

export function personalSituation(): Draft {
  return {
    answer: paragraphs(
      'Essa é uma situação específica, e quem pode te ajudar de verdade é a equipe da SouJunior.',
      SEND_THROUGH_CHANNELS,
    ),
    requiresHumanSupport: true,
  };
}

/* ---------- Conversa ---------- */

export function identity(): Draft {
  return {
    answer: paragraphs(
      'Eu sou o Juno, mascote oficial e guia da SouJunior aqui na página. Sou um assistente automático — não uma pessoa — e respondo com base nas informações publicadas pela comunidade.',
      'Posso explicar como participar, apresentar as áreas ou mostrar formas de apoiar.',
    ),
    followUps: INITIAL_SUGGESTIONS.slice(0, 3),
  };
}

export function greeting(): Draft {
  return {
    answer:
      'Oi! Que bom ter você por aqui. Posso te apresentar a SouJunior, ajudar a escolher uma área ou explicar como participar. Por onde começamos?',
    followUps: INITIAL_SUGGESTIONS.slice(0, 3),
  };
}

export function thanks(): Draft {
  return {answer: 'Por nada! Se surgir outra dúvida sobre a SouJunior, é só perguntar.'};
}

export function goodbye(): Draft {
  return {answer: 'Até mais! Quando quiser, é só me chamar aqui no canto da tela.'};
}

export function privacy(): Draft {
  return {
    answer: paragraphs(
      'Não preciso dos seus dados pessoais para te ajudar — evite enviar CPF, documentos, senhas ou dados bancários por aqui.',
      'Posso explicar como a comunidade funciona e como participar.',
    ),
    followUps: ['Como faço para participar?'],
  };
}

export function affirmFollowUp(previous: JunoAction[] | undefined): Draft {
  const navigation = previous?.filter(({type}) => type === 'scroll' || type === 'link') ?? [];
  if (navigation.length > 0) {
    return {answer: 'Combinado! É só tocar no botão abaixo.', actions: navigation};
  }
  return {
    answer: 'Legal! Sobre o que você quer saber? Posso explicar como participar, apresentar as áreas ou mostrar como apoiar.',
    followUps: INITIAL_SUGGESTIONS.slice(0, 3),
  };
}

export function declineFollowUp(): Draft {
  return {answer: 'Tudo bem! Se quiser saber mais alguma coisa sobre a SouJunior, é só perguntar.'};
}

export function currentSectionIntro(id: SectionId, base: Draft): Draft {
  return {...base, answer: `Você está na seção “${sectionLabel(id)}”.\n\n${base.answer}`};
}

/* ---------- Fallbacks ---------- */

export function outOfScope(): Draft {
  return {
    answer: paragraphs(
      'Eu consigo te ajudar principalmente com informações sobre a SouJunior 🙂',
      'Se quiser, posso explicar como participar, apresentar as áreas da comunidade ou mostrar como entrar em contato com a equipe.',
    ),
    followUps: ['Como faço para participar?', 'Quais áreas existem?', 'Como falo com a equipe?'],
  };
}

export function notUnderstood(voiceInput: boolean, escalate: boolean): Draft {
  return {
    answer: paragraphs(
      'Não consegui entender completamente sua dúvida.',
      `Você pode tentar escrever de outra forma${voiceInput ? ' ou falar novamente pelo microfone' : ''}.`,
    ),
    actions: [
      {type: 'rephrase', label: 'Tentar novamente'},
      ...(voiceInput ? [{type: 'voice', label: 'Falar novamente'} as const] : []),
      CONTACT,
    ],
    requiresHumanSupport: escalate,
  };
}

export function noInfo(): Draft {
  return {
    answer: paragraphs(
      'Essa informação não está disponível para mim no momento.',
      'Para te passar uma orientação correta, o melhor caminho é falar diretamente com a equipe da SouJunior.',
    ),
    requiresHumanSupport: true,
  };
}

export function noDate(): Draft {
  return {
    answer: paragraphs(
      'Eu não tenho uma data confirmada para te passar.',
      'Para garantir que você receba uma informação correta, recomendo falar diretamente com a equipe da SouJunior.',
    ),
    requiresHumanSupport: true,
  };
}

/** Parte da pergunta tem resposta na base e parte não: deixa claro o que é certo. */
export function partial(topic: string, base: Draft): Draft {
  return {
    answer: paragraphs(
      `Não tenho uma informação confirmada sobre ${topic}.`,
      base.summary && `O que eu sei é que ${lowerFirst(base.summary)}`,
      'Para não te passar algo incorreto, o melhor caminho é falar com a equipe da SouJunior.',
    ),
    actions: base.actions?.filter(({type}) => type === 'scroll'),
    requiresHumanSupport: true,
  };
}

export function remoteFailure(): Draft {
  return {
    answer: paragraphs(
      'Tive um problema para responder agora.',
      'Você pode tentar novamente ou falar diretamente com a equipe da SouJunior.',
    ),
    actions: [{type: 'retry', label: 'Tentar novamente'}, CONTACT],
  };
}

export function offline(): Draft {
  return {
    answer: paragraphs(
      'Parece que você está sem conexão.',
      'Algumas respostas do Juno podem não funcionar agora, mas você ainda pode navegar normalmente pela SouJunior.',
    ),
    actions: [{type: 'retry', label: 'Tentar novamente'}],
  };
}
