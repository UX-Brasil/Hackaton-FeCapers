import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/content/links';

/**
 * Buscadores e assistentes de IA são bem-vindos: quem tem regra própria
 * ignora o grupo `*`, por isso os robôs de IA ganham um `allow` explícito,
 * junto com os resumos em /llms.txt e /llms-full.txt.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {userAgent: '*', allow: '/'},
      {userAgent: AI_CRAWLERS, allow: ['/', '/llms.txt', '/llms-full.txt']},
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
