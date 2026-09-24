import type {AreaId} from '@/content/types';

const HIGHLIGHT_MS = 2600;
let highlightTimer: number | undefined;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Leva até o card de uma área, move o foco para ele (leitores de tela e
 * teclado continuam dali) e o destaca por alguns segundos.
 */
export function revealArea(id: AreaId) {
  const card = document.getElementById(`area-${id}`);
  if (!card) return false;

  document.querySelectorAll<HTMLElement>('.area[data-highlight]').forEach((el) => el.removeAttribute('data-highlight'));
  window.clearTimeout(highlightTimer);

  card.scrollIntoView({behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center'});
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '-1');
  card.focus({preventScroll: true});
  card.setAttribute('data-highlight', 'true');
  highlightTimer = window.setTimeout(() => card.removeAttribute('data-highlight'), HIGHLIGHT_MS);
  return true;
}
