import type {LucideIcon} from 'lucide-react';

/** Cores de destaque da identidade SouJunior usadas para diferenciar itens. */
export type Accent = 'blue' | 'indigo' | 'cyan' | 'purple' | 'yellow';

/** Âncoras das seções da landing. */
export type SectionId =
  | 'sobre'
  | 'pilares'
  | 'areas'
  | 'jornada'
  | 'descubra'
  | 'depoimentos'
  | 'participe'
  | 'mentores'
  | 'iniciativas'
  | 'apoie';

/** Destino de um CTA. `null` indica link oficial ainda não publicado. */
export type Href = string | null;

export interface NavItem {
  label: string;
  id: SectionId;
}

export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface ProposalPoint {
  title: string;
  text: string;
}

export interface Pillar {
  title: string;
  text: string;
  tag: string;
}

/** Identificador estável de cada área (âncora `#area-<id>` e pontuação do quiz). */
export type AreaId =
  | 'business'
  | 'tech-recruiter'
  | 'produtos'
  | 'agil'
  | 'social-media'
  | 'ui-ux'
  | 'front-end'
  | 'back-end'
  | 'data'
  | 'mobile'
  | 'qa'
  | 'devops';

export interface Area {
  id: AreaId;
  number: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  accent: Accent;
}

export interface CommunityRole {
  title: string;
  audience: string;
  text: string;
  cta: string;
  href: Href;
  pendingMessage: string;
  accent: Accent;
}

export interface Initiative {
  name: string;
  /** Parte do nome exibida com destaque, ex.: "Talk". */
  highlight: string;
  category: string;
  text: string;
  href: Href;
  pendingMessage: string;
  accent: Accent;
}

export interface SupportOption {
  title: string;
  text: string;
  icon: LucideIcon;
}

export interface FooterLink {
  label: string;
  href: string;
}

/** Complemento visual de cada etapa da jornada. */
export type JourneyExtra = 'notNeeded' | 'areas' | 'squad' | 'practice' | 'growth';

export interface JourneyStep {
  id: number;
  /** Nome curto da etapa, ex.: "Você chega". */
  label: string;
  title: string;
  text: string[];
  /** Frase de apoio em destaque. */
  highlight?: string;
  extra: JourneyExtra;
  accent: Accent;
}

export interface DiscoveryOption {
  label: string;
  /** Pontos que a opção soma a cada área relacionada. */
  scores: Partial<Record<AreaId, number>>;
}

export interface DiscoveryQuestion {
  id: string;
  question: string;
  options: DiscoveryOption[];
}
