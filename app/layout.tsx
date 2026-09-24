import type {Metadata, Viewport} from 'next';
import type {ReactNode} from 'react';
import {links, SITE_URL} from '@/content/links';
import {areas} from '@/content/site';
import {
  githubUrl,
  keywords,
  organization,
  siteDescription,
  siteLongDescription,
  siteName,
  siteTitle,
  tagline,
  team,
} from '@/content/seo';
import './globals.css';

// A imagem de compartilhamento vem de app/opengraph-image.tsx e app/twitter-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {default: siteTitle, template: `%s | ${siteName}`},
  description: siteDescription,
  applicationName: siteName,
  keywords,
  authors: team.members.map((member) => ({name: member.name, url: githubUrl(member.github)})),
  creator: team.name,
  publisher: siteName,
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: {'pt-BR': '/'},
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {telephone: false, email: false, address: false},
  icons: {icon: '/favicon.svg', apple: '/apple-touch-icon.png'},
};

export const viewport: Viewport = {
  themeColor: '#eef3fe',
  colorScheme: 'light',
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteName,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/soujunior-logo.png`,
        width: 240,
        height: 56,
      },
      description: siteLongDescription,
      slogan: tagline,
      foundingDate: organization.foundingDate,
      knowsAbout: areas.map((area) => area.name),
      sameAs: [organization.website, organization.linkedin, links.apoiaSe],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteName,
      url: SITE_URL,
      description: siteDescription,
      inLanguage: 'pt-BR',
      publisher: {'@id': organizationId},
      creator: team.members.map((member) => ({
        '@type': 'Person',
        name: member.name,
        url: githubUrl(member.github),
      })),
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: siteTitle,
      description: siteDescription,
      inLanguage: 'pt-BR',
      isPartOf: {'@id': websiteId},
      about: {'@id': organizationId},
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
      keywords: keywords.join(', '),
    },
  ],
};

// Marca que há JS antes da pintura, para o hero poder começar oculto e animar sem piscar.
const enableJsClass = "document.documentElement.classList.add('js')";

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: enableJsClass}} />
        <link
          rel="preload"
          href="/fonts/funnel-display-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link rel="preload" href="/fonts/funnel-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} />
      </body>
    </html>
  );
}
