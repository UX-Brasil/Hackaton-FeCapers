import {areaReasons, discoveryQuestions} from '@/content/area-discovery';
import {areas} from '@/content/site';
import type {Area, AreaId} from '@/content/types';

export interface AreaSuggestion {
  area: Area;
  reason: string;
}

/** Resposta escolhida em cada pergunta (índice da opção) ou `null` se ainda não respondida. */
export type DiscoveryAnswers = ReadonlyArray<number | null>;

/**
 * Soma os pontos das opções escolhidas e devolve até `limit` áreas.
 * Determinístico: empate em pontos favorece a área citada por mais respostas
 * e, depois, a ordem da seção de áreas. As mesmas respostas geram o mesmo resultado.
 */
export function suggestAreas(answers: DiscoveryAnswers, limit = 3): AreaSuggestion[] {
  const points = new Map<AreaId, number>();
  const mentions = new Map<AreaId, number>();

  answers.forEach((choice, index) => {
    const option = choice === null ? undefined : discoveryQuestions[index]?.options[choice];
    if (!option) return;
    for (const [id, value] of Object.entries(option.scores) as [AreaId, number][]) {
      points.set(id, (points.get(id) ?? 0) + value);
      mentions.set(id, (mentions.get(id) ?? 0) + 1);
    }
  });

  return areas
    .map((area, order) => ({area, order, points: points.get(area.id) ?? 0, mentions: mentions.get(area.id) ?? 0}))
    .filter((entry) => entry.points > 0)
    .sort((a, b) => b.points - a.points || b.mentions - a.mentions || a.order - b.order)
    .slice(0, limit)
    .map(({area}) => ({area, reason: areaReasons[area.id]}));
}
