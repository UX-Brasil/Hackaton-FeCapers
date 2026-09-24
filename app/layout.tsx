import type {Metadata, Viewport} from 'next';
import type {ReactNode} from 'react';
import {SITE_URL} from '@/content/links';
import './globals.css';

const title = 'SouJunior — Sua primeira experiência real em tecnologia';
const description =
  'Participe da SouJunior, uma comunidade gratuita onde profissionais iniciantes ganham experiência prática em tecnologia trabalhando em projetos reais com mentoria e equipes multidisciplinares.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {canonical: '/'},
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'SouJunior',
    title,
    description,
    images: [{url: '/og.png', width: 1200, height: 630, alt: 'SouJunior — Sua primeira experiência real em tecnologia'}],
  },
  twitter: {card: 'summary_large_image', title, description, images: ['/og.png']},
  robots: {index: true, follow: true},
  icons: {icon: '/favicon.svg', apple: '/apple-touch-icon.png'},
};

export const viewport: Viewport = {
  themeColor: '#eef3fe',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'SouJunior',
      url: SITE_URL,
      logo: `${SITE_URL}/images/soujunior-logo.png`,
      description,
    },
    {'@type': 'WebSite', name: 'SouJunior', url: SITE_URL, inLanguage: 'pt-BR'},
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
