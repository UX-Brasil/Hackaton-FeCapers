'use client';

import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const EASE = 'power3.out';
const numberFormat = new Intl.NumberFormat('pt-BR');

const q = <T extends Element = HTMLElement>(selector: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/** Abertura do hero: título, texto, CTAs, métricas e, por último, o Juno. */
function playHeroIntro() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return () => {};

  const counters = q('[data-count]', hero);
  const finalText = counters.map((el) => el.textContent ?? '');

  const tl = gsap.timeline({defaults: {ease: EASE, duration: 0.7}});
  tl.fromTo(q('.pill', hero), {y: 14, opacity: 0}, {y: 0, opacity: 1, duration: 0.5})
    .fromTo(
      q('.hero__title .line__inner', hero),
      {yPercent: 110},
      {yPercent: 0, duration: 0.85, stagger: 0.08, ease: 'power4.out'},
      0.1,
    )
    .fromTo(q('.hero__lead', hero), {y: 16, opacity: 0}, {y: 0, opacity: 1}, 0.45)
    .fromTo(q('.hero__actions', hero), {y: 16, opacity: 0}, {y: 0, opacity: 1}, 0.55)
    .fromTo(q('.metric', hero), {y: 16, opacity: 0}, {y: 0, opacity: 1, stagger: 0.08}, 0.65)
    .add(() => {
      counters.forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? '';
        const state = {value: 0};
        gsap.to(state, {
          value: target,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${numberFormat.format(Math.round(state.value))}${suffix}`;
          },
        });
      });
    }, 0.7)
    .fromTo(
      q('[data-stage-tile]', hero),
      {scale: 0.6, opacity: 0},
      {scale: 1, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.7)'},
      0.35,
    )
    .fromTo(q('[data-stage-caption]', hero), {opacity: 0}, {opacity: 1, duration: 0.5}, 0.8)
    .fromTo(q('[data-stage-juno]', hero), {y: -48, opacity: 0}, {y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out'}, 0.75)
    .fromTo(
      q('[data-stage-bubble]', hero),
      {scale: 0.7, opacity: 0, transformOrigin: '100% 30%'},
      {scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)'},
      1.35,
    );

  // Garante os valores finais das métricas se a animação for interrompida.
  return () => counters.forEach((el, index) => (el.textContent = finalText[index]));
}

/** Elementos isolados surgem ao entrar na viewport. */
function setupReveals() {
  q('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: EASE,
      clearProps: 'transform,opacity',
      scrollTrigger: {trigger: el, start: 'top 88%', once: true},
    });
  });
}

/** Grupos (cards, áreas, depoimentos) entram em sequência rápida, por lote visível. */
function setupStaggers() {
  q('[data-stagger]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];
    gsap.set(items, {y: 24, opacity: 0});
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: EASE,
          stagger: 0.06,
          overwrite: true,
          clearProps: 'transform,opacity',
        }),
    });
  });
}

/** Títulos principais revelados linha a linha. */
function setupLineReveals() {
  q('[data-lines]').forEach((heading) => {
    gsap.from(q('.line__inner', heading), {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
      clearProps: 'transform',
      scrollTrigger: {trigger: heading, start: 'top 85%', once: true},
    });
  });
}

/** A linha da ponte é desenhada da teoria até a contratação. */
function setupBridge() {
  q('[data-draw]').forEach((line) => {
    const vertical = line.offsetHeight > line.offsetWidth;
    gsap.from(line, {
      [vertical ? 'scaleY' : 'scaleX']: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      clearProps: 'transform',
      scrollTrigger: {trigger: line, start: 'top 85%', once: true},
    });
  });
}

/** Pequenas cenas: o Juno reage quando o visitante chega em cada seção. */
function setupScenes() {
  const careers = document.querySelector<HTMLElement>('[data-scene="careers"]');
  if (careers) {
    gsap
      .timeline({scrollTrigger: {trigger: careers, start: 'top 80%', once: true}})
      .from(q('[data-scene-item]', careers), {scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.6)'})
      .from(q('[data-scene-juno]', careers), {y: 40, opacity: 0, duration: 0.7, ease: 'back.out(1.8)'}, '-=0.25')
      .from(
        q('[data-scene-bubble]', careers),
        {scale: 0.7, opacity: 0, transformOrigin: '15% 100%', duration: 0.45, ease: 'back.out(2)'},
        '-=0.2',
      );
  }

  const final = document.querySelector<HTMLElement>('[data-scene="final"]');
  if (final) {
    gsap
      .timeline({scrollTrigger: {trigger: final, start: 'top 80%', once: true}})
      .from(q('[data-stage-tile]', final), {scale: 0.6, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.7)'})
      .from(q('[data-stage-juno]', final), {y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out'}, '-=0.2')
      .to(q('[data-stage-juno]', final), {keyframes: {rotation: [0, -10, 8, -4, 0]}, duration: 0.9, ease: 'power1.inOut'})
      .from(
        q('[data-stage-bubble]', final),
        {scale: 0.7, opacity: 0, transformOrigin: '100% 30%', duration: 0.45, ease: 'back.out(2)'},
        '-=0.6',
      );
  }

  const apoia = document.querySelector<HTMLElement>('[data-scene="apoia"]');
  if (apoia) {
    gsap.from(q('[data-scene-robot]', apoia), {
      y: 56,
      rotation: -12,
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.7)',
      scrollTrigger: {trigger: apoia, start: 'top 80%', once: true},
    });
  }

  q('[data-art]').forEach((art) => {
    gsap.from(q('[data-art-piece]', art), {
      scale: 0.6,
      opacity: 0,
      transformOrigin: '50% 50%',
      duration: 0.5,
      stagger: 0.06,
      ease: 'back.out(1.8)',
      scrollTrigger: {trigger: art, start: 'top 85%', once: true},
    });
  });
}

/** Parallax discreto em mascotes e formas decorativas (somente desktop). */
function setupParallax() {
  q('[data-parallax]').forEach((el) => {
    const distance = Number(el.dataset.parallax) || 0;
    gsap.fromTo(
      el,
      {y: -distance / 2},
      {
        y: distance / 2,
        ease: 'none',
        scrollTrigger: {trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6},
      },
    );
  });
}

/** O Juno do hero inclina levemente na direção do cursor. */
function setupJunoTilt() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const juno = hero?.querySelector<HTMLElement>('[data-juno-tilt]');
  if (!hero || !juno) return () => {};

  const rotate = gsap.quickTo(juno, 'rotation', {duration: 0.8, ease: EASE});
  const shift = gsap.quickTo(juno, 'x', {duration: 0.8, ease: EASE});

  const onMove = (event: PointerEvent) => {
    const bounds = juno.getBoundingClientRect();
    const offset = (event.clientX - (bounds.left + bounds.width / 2)) / window.innerWidth;
    rotate(gsap.utils.clamp(-6, 6, offset * 14));
    shift(gsap.utils.clamp(-8, 8, offset * 20));
  };
  const onLeave = () => {
    rotate(0);
    shift(0);
  };

  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', onLeave);
  return () => {
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
  };
}

/**
 * Camada de animação da landing. Todo o conteúdo já vem renderizado do
 * servidor; aqui só adicionamos movimento, respeitando movimento reduzido.
 */
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    // Se o fallback em CSS já começou a revelar o hero, a abertura não é repetida.
    const probe = document.querySelector('.hero [data-hero]');
    const introAllowed = probe ? parseFloat(getComputedStyle(probe).opacity) < 0.05 : false;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Libera o CSS de pré-ocultação no mesmo quadro em que o GSAP assume.
      root.classList.add('motion-ready');
      const restoreCounters = introAllowed ? playHeroIntro() : () => {};
      setupReveals();
      setupStaggers();
      setupLineReveals();
      setupBridge();
      setupScenes();

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);
      return () => {
        restoreCounters();
        window.removeEventListener('load', refresh);
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      root.classList.add('motion-ready');
    });

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (hover: hover)', () => {
      setupParallax();
      return setupJunoTilt();
    });

    return () => mm.revert();
  }, []);

  return null;
}
