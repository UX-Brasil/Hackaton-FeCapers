import {links, SITE_URL} from '@/content/links';
import {discoveryIntro, discoveryQuestions} from '@/content/area-discovery';
import {journeyClosing, journeyIntro, journeySteps} from '@/content/journey';
import {organization, siteDescription, siteLongDescription, siteName, tagline, team, githubUrl} from '@/content/seo';
import {
  areas,
  communityFacts,
  communityRoles,
  fundedItems,
  initiatives,
  metrics,
  pillars,
  proposalPoints,
  supportOptions,
} from '@/content/site';
import {testimonials} from '@/content/testimonials';
import type {Href} from '@/content/types';

/**
 * Textos para assistentes de IA e buscadores (padrão https://llmstxt.org).
 * São montados a partir de content/: se um texto muda na página, muda aqui.
 */

const PENDING = 'link oficial ainda não divulgado';

const anchor = (id: string) => `${SITE_URL}/#${id}`;
const metricText = metrics.map((m) => `${m.value.toLocaleString('pt-BR')}${m.suffix ?? ''} ${m.label.toLowerCase()}`).join(', ');

/** Link absoluto de um CTA: âncoras viram URL da página; `null` fica sem link. */
function resolveHref(href: Href) {
  if (!href) return null;
  return href.startsWith('#') ? `${SITE_URL}/${href}` : href;
}

function linkOrPending(label: string, href: Href, text: string) {
  const url = resolveHref(href);
  return url ? `- [${label}](${url}): ${text}` : `- ${label} (${PENDING}): ${text}`;
}

const teamLines = team.members.map((m) => `- ${m.name} ([@${m.github}](${githubUrl(m.github)}))`);

export function buildLlmsTxt() {
  return [
    `# ${siteName}`,
    '',
    `> ${siteDescription}`,
    '',
    `${siteLongDescription} ${communityFacts.noBarriers}`,
    '',
    `Números da comunidade: ${metricText}. Toda a participação é gratuita.`,
    '',
    'A página tem o Juno, um assistente virtual que responde dúvidas sobre a SouJunior por texto ou voz, direto no navegador.',
    '',
    '## Seções da página',
    '',
    `- [Nossa proposta](${anchor('sobre')}): por que a SouJunior existe e a ponte entre estudar e atuar (${proposalPoints.map((p) => p.title).join(', ')}).`,
    `- [O que você encontra](${anchor('pilares')}): ${pillars.map((p) => p.title.toLowerCase()).join('; ')}.`,
    `- [Áreas de atuação](${anchor('areas')}): ${areas.length} áreas (${areas.map((a) => a.name).join(', ')}).`,
    `- [Sua jornada](${anchor('jornada')}): como é a experiência de quem entra, em ${journeySteps.length} etapas (${journeySteps.map((s) => s.label.toLowerCase()).join(', ')}).`,
    `- [Descubra seu lugar](${anchor('descubra')}): ${discoveryQuestions.length} perguntas rápidas que sugerem áreas para conhecer, sem cadastro. ${discoveryIntro.note}`,
    `- [Depoimentos](${anchor('depoimentos')}): relatos de pessoas que participaram da comunidade.`,
    `- [Faça parte](${anchor('participe')}): caminhos de participação (${communityRoles.map((r) => r.title).join(', ')}).`,
    `- [Seja mentor](${anchor('mentores')}): como profissionais experientes podem ajudar.`,
    `- [Iniciativas](${anchor('iniciativas')}): ${initiatives.map((i) => `${i.name} (${i.category.toLowerCase()})`).join(' e ')}.`,
    `- [Apoie a SouJunior](${anchor('apoie')}): formas de apoio e apoio financeiro pelo Apoia.se.`,
    '',
    '## Como participar',
    '',
    ...communityRoles.map((r) => linkOrPending(r.title, r.href, `${r.audience.toLowerCase()}. ${r.text}`)),
    '',
    '## Links oficiais',
    '',
    `- [Site oficial da SouJunior](${organization.website}): página institucional da comunidade.`,
    `- [LinkedIn da SouJunior](${organization.linkedin}): novidades e oportunidades da comunidade.`,
    `- [Apoia.se da SouJunior](${links.apoiaSe}): apoio financeiro à comunidade.`,
    ...initiatives.map((i) => linkOrPending(i.name, i.href, i.text)),
    '',
    '## Optional',
    '',
    `- [Conteúdo completo da página](${SITE_URL}/llms-full.txt): todos os textos da landing em Markdown.`,
    `- [Código-fonte](${team.repository}): projeto open source (MIT) criado pela ${team.name} no ${team.event}.`,
    '',
  ].join('\n');
}

export function buildLlmsFullTxt() {
  return [
    `# ${siteName} — ${tagline}`,
    '',
    `> ${siteDescription}`,
    '',
    `Fonte: ${SITE_URL} (idioma: português do Brasil).`,
    '',
    '## Sobre a SouJunior',
    '',
    `${siteLongDescription} ${communityFacts.openAndFree}. ${communityFacts.noBarriers}`,
    '',
    `Números da comunidade: ${metricText}.`,
    '',
    '## Nossa proposta',
    '',
    'Cursos ensinam a teoria, mas a rotina do trabalho tem desafios que o slide da aula não explica. É nessa transição entre estudar e atuar que muita gente se perde.',
    '',
    'A SouJunior existe para preencher essa lacuna. É um ambiente aberto e seguro, construído para colocar profissionais em projetos reais, em constante evolução, onde você aprende fazendo.',
    '',
    ...proposalPoints.map((p) => `- **${p.title}**: ${p.text}`),
    '',
    '## O que você encontra',
    '',
    ...pillars.map((p) => `- **${p.title}** (${p.tag}): ${p.text}`),
    '',
    `## Áreas de atuação (${areas.length})`,
    '',
    ...areas.map((a) => `- **${a.name}**: ${a.description}`),
    '',
    '## Sua jornada na SouJunior',
    '',
    journeyIntro.lead.join(' '),
    '',
    ...journeySteps.map((s) => `${String(s.id).padStart(2, '0')}. **${s.title}** ${s.text.join(' ')}${s.highlight ? ` ${s.highlight}` : ''}`),
    '',
    `${journeyClosing.lines.join(' ')} ${journeyClosing.complement}`,
    '',
    '## Descubra seu lugar',
    '',
    `${discoveryIntro.lead} ${discoveryIntro.note} Não é teste vocacional: a página soma pontos localmente, sem cadastro e sem enviar respostas, e sugere até três áreas para conhecer.`,
    '',
    ...discoveryQuestions.map((q, i) => `${i + 1}. ${q.question} (${q.options.map((o) => o.label).join('; ')})`),
    '',
    '## Depoimentos',
    '',
    ...testimonials.map((t) => `- "${t.quote}" — ${t.name}, ${t.role}`),
    '',
    '## Faça parte da comunidade',
    '',
    ...communityRoles.map((r) => `- **${r.title}** (${r.audience.toLowerCase()}): ${r.text}${resolveHref(r.href) ? ` Link: ${resolveHref(r.href)}` : ` (${PENDING}.)`}`),
    '',
    '## Iniciativas',
    '',
    ...initiatives.map((i) => `- **${i.name}** (${i.category}): ${i.text}${i.href ? ` Link: ${i.href}` : ` (${PENDING}.)`}`),
    '',
    '## Apoie a SouJunior',
    '',
    ...supportOptions.map((s) => `- **${s.title}**: ${s.text}`),
    '',
    `Apoio financeiro: pelo Apoia.se (${links.apoiaSe}). A contribuição ajuda a custear ${fundedItems.join(', ').toLowerCase()}.`,
    '',
    '## Juno, o assistente virtual',
    '',
    'O Juno é o guia da SouJunior na página. Responde dúvidas com a base de conhecimento da própria landing, sem inventar datas, links ou processos: quando não sabe, indica os canais oficiais. Aceita perguntas por voz (pt-BR) e lê as respostas em voz alta a pedido; não grava áudio e guarda a conversa só na sessão do navegador.',
    '',
    '## Créditos',
    '',
    `Landing criada pela ${team.name} no ${team.event}. Código aberto (licença MIT): ${team.repository}`,
    '',
    ...teamLines,
    '',
  ].join('\n');
}

export function buildHumansTxt() {
  return [
    '/* TEAM */',
    ...team.members.flatMap((m) => [`  Nome: ${m.name}`, `  GitHub: ${githubUrl(m.github)}`, '']),
    '/* THANKS */',
    `  ${team.event} e toda a comunidade SouJunior`,
    '',
    '/* SITE */',
    `  Equipe: ${team.name}`,
    `  Código: ${team.repository}`,
    '  Idioma: português do Brasil',
    '  Stack: Next.js, React, TypeScript, Tailwind CSS, GSAP, Motion, Radix UI',
    '',
  ].join('\n');
}
