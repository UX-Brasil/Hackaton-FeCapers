import type {JunoArea} from '@/content/juno-knowledge';
import type {SectionId} from '@/content/types';
import * as answers from './answers';
import type {Draft} from './answers';
import {findAreas, findUnknownTopics, scoreIntents, signals, wordCount, type IntentId} from './intents';
import {containsSensitiveNumber, normalize} from './text';
import type {JunoMessage, JunoProvider, JunoRequest, JunoResponse, JunoResponseKind} from './types';

/**
 * Provider local: responde perguntas frequentes com a base de conhecimento,
 * sem rede e sem IA. Segue o princípio do Juno:
 * sei → respondo; sei em parte → deixo claro; não sei → canais oficiais.
 */

type Resolution = Omit<JunoResponse, 'source'>;

const INTENT_THRESHOLD = 2;
const STRONG_SCORE = 3;

/** Intenções que cedem lugar à resposta sobre uma área citada ("qual área usa React?"). */
const AREA_FIRST: IntentId[] = ['areasList', 'areaChoice', 'projects', 'employability'];

/** Intenção equivalente a cada seção, para perguntas como "o que é isso aqui?". */
const SECTION_INTENT: Record<SectionId, IntentId> = {
  sobre: 'about',
  pilares: 'pillars',
  areas: 'areasList',
  jornada: 'participate',
  descubra: 'areaChoice',
  depoimentos: 'testimonials',
  participe: 'participate',
  mentores: 'beMentor',
  iniciativas: 'initiatives',
  apoie: 'support',
};

function draftFor(id: IntentId, text: string, area?: JunoArea): Draft | null {
  switch (id) {
    case 'identity':
      return answers.identity();
    case 'contact':
      return answers.contact();
    case 'personal':
      return answers.personalSituation();
    case 'about':
      return answers.about();
    case 'free':
      return answers.free(text);
    case 'audience':
      return answers.audience();
    case 'participate':
      return answers.participate(area);
    case 'squads':
      return answers.squads(area);
    case 'areaChoice':
      return answers.areaChoice();
    case 'areasList':
      return answers.areasList();
    case 'mentorship':
      return answers.mentorship();
    case 'beMentor':
      return answers.beMentor(area);
    case 'head':
      return answers.head(area);
    case 'company':
      return answers.company();
    case 'apoiaSe':
      return answers.apoiaSe();
    case 'support':
      return answers.support();
    case 'talk':
      return answers.initiative('talk');
    case 'labs':
      return answers.initiative('labs');
    case 'initiatives':
      return answers.initiativesList();
    case 'social':
      return answers.socialChannels();
    case 'metrics':
      return answers.metricsAnswer();
    case 'testimonials':
      return answers.testimonialsAnswer();
    case 'pillars':
      return answers.pillarsOverview();
    case 'employability':
      return answers.employability();
    case 'projects':
      return answers.projects();
    case 'routine':
      return answers.routine();
    case 'networking':
      return answers.networking();
  }
}

function lastAssistant(history: JunoMessage[]) {
  return [...history].reverse().find(({role}) => role === 'assistant');
}

/** Quantas respostas "não entendi" seguidas o Juno acabou de dar. */
function notUnderstoodStreak(history: JunoMessage[]) {
  let streak = 0;
  for (const message of [...history].reverse()) {
    if (message.role === 'user') continue;
    if (message.kind !== 'not-understood') break;
    streak += 1;
  }
  return streak;
}

function affirmation(history: JunoMessage[]): Draft {
  const previous = lastAssistant(history);
  if (previous?.intent === 'areasList') return answers.areaChoice();
  if (previous?.followUps?.length && !previous.actions?.length) {
    return {answer: 'Claro! É só escolher uma das opções abaixo ou me contar com suas palavras.', followUps: previous.followUps};
  }
  return answers.affirmFollowUp(previous?.actions);
}

export function resolveLocally({question, history, context}: JunoRequest): Resolution {
  const text = normalize(question);
  const resolve = (kind: JunoResponseKind, confidence: number, draft: Draft, intent?: string): Resolution => ({
    kind,
    confidence,
    intent,
    answer: draft.answer,
    actions: draft.actions,
    followUps: draft.followUps,
    requiresHumanSupport: draft.requiresHumanSupport,
  });

  if (!text) return resolve('not-understood', 0, answers.notUnderstood(context.voiceInput, false));

  // Dados pessoais e tentativas de mudar as regras do Juno vêm antes de tudo.
  if (containsSensitiveNumber(question) || signals.sensitive.test(text)) {
    return resolve('answer', 1, answers.privacy(), 'privacy');
  }
  if (signals.injection.test(text)) return resolve('out-of-scope', 1, answers.outOfScope(), 'scope');

  const intents = scoreIntents(text);
  const [top] = intents;
  const best = top && top.score >= INTENT_THRESHOLD ? top : undefined;
  const areas = findAreas(text);
  const unknownTopics = findUnknownTopics(text);
  const inDomain = Boolean(best) || areas.length > 0 || signals.domain.test(text);

  if (!inDomain && signals.offTopic.test(text)) return resolve('out-of-scope', 0.9, answers.outOfScope(), 'scope');

  let draft: Draft | null = null;
  let intent: string | undefined;
  let confidence = 0;

  const areaFirst = areas.length > 0 && (!best || best.score < STRONG_SCORE || AREA_FIRST.includes(best.id));
  if (areaFirst) {
    const [first] = areas;
    draft =
      areas.length === 1
        ? answers.areaAnswer(first.area, first.direct, signals.askedIfExists.test(text))
        : answers.multipleAreas(areas.slice(0, 3).map(({area}) => area));
    intent = 'area';
    confidence = areas.length === 1 && first.direct ? 0.9 : 0.7;
  } else if (best) {
    draft = draftFor(best.id, text, areas[0]?.area);
    intent = best.id;
    confidence = best.score >= STRONG_SCORE ? 0.9 : 0.7;
  }

  // Detalhes que a SouJunior não publicou (datas, requisitos, local...): nunca improvisar.
  const escalatesAnyway = intent === 'contact' || intent === 'personal';
  if (unknownTopics.length > 0 && !escalatesAnyway && (inDomain || wordCount(text) <= 6)) {
    if (unknownTopics.includes('date')) return resolve('no-info', 0.4, answers.noDate(), intent ?? 'unknown');
    if (draft) return resolve('partial', 0.5, answers.partial(unknownTopics[0], draft), intent);
    return resolve('no-info', 0.4, answers.noInfo(), 'unknown');
  }

  if (draft) return resolve('answer', confidence, draft, intent);

  // Conversa: cumprimentos e respostas curtas a uma pergunta do Juno.
  const short = wordCount(text) <= 4;
  if (short && signals.greeting.test(text)) return resolve('answer', 1, answers.greeting(), 'greeting');
  if (signals.thanks.test(text)) return resolve('answer', 1, answers.thanks(), 'thanks');
  if (signals.goodbye.test(text)) return resolve('answer', 1, answers.goodbye(), 'goodbye');
  if (short && signals.affirm.test(text)) return resolve('answer', 0.8, affirmation(history), 'affirm');
  if (short && signals.decline.test(text)) return resolve('answer', 0.8, answers.declineFollowUp(), 'decline');

  // "O que é isso aqui?" enquanto a pessoa vê uma seção.
  const section = context.currentSection;
  if (section && signals.deictic.test(text)) {
    const base = draftFor(SECTION_INTENT[section], text);
    if (base) return resolve('answer', 0.6, answers.currentSectionIntro(section, base), SECTION_INTENT[section]);
  }

  // Sobre a SouJunior, mas sem resposta na base.
  if (inDomain) return resolve('no-info', 0.3, answers.noInfo(), 'unknown');

  if (wordCount(text) >= 4) return resolve('out-of-scope', 0.5, answers.outOfScope(), 'scope');

  const escalate = notUnderstoodStreak(history) >= 1;
  return resolve('not-understood', 0.1, answers.notUnderstood(context.voiceInput, escalate), 'unknown');
}

export class LocalKnowledgeProvider implements JunoProvider {
  async sendMessage(request: JunoRequest): Promise<JunoResponse> {
    return {...resolveLocally(request), source: 'local'};
  }
}
