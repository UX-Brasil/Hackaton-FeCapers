import {JUNO_SECTION_IDS} from '@/content/juno-knowledge';
import type {SectionId} from '@/content/types';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Seção da landing que ocupa a faixa de leitura da tela (um pouco acima do meio). */
export function getCurrentSection(): SectionId | null {
  const line = window.innerHeight * 0.4;
  for (const id of JUNO_SECTION_IDS) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= line && rect.bottom > line) return id;
  }
  return null;
}

/**
 * Leva até uma seção e move o foco para ela, para que leitores de tela e
 * teclado continuem a partir dali.
 */
export function scrollToSection(id: SectionId) {
  const section = document.getElementById(id);
  if (!section) return false;
  section.scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start'});
  if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1');
  section.focus({preventScroll: true});
  return true;
}
