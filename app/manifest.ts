import type {MetadataRoute} from 'next';
import {siteDescription, siteName} from '@/content/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — Comunidade de tecnologia`,
    short_name: siteName,
    description: siteDescription,
    lang: 'pt-BR',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#eef3fe',
    theme_color: '#eef3fe',
    categories: ['education', 'social'],
    icons: [
      {src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml'},
      {src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
    ],
  };
}
