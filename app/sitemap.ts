import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/content/links';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${SITE_URL}/opengraph-image`, `${SITE_URL}/images/soujunior-logo.png`],
    },
  ];
}
