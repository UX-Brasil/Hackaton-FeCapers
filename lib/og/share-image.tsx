import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {ImageResponse} from 'next/og';
import {communityFacts, metrics} from '@/content/site';
import {siteName, taglineHighlight, taglineLead} from '@/content/seo';

/**
 * Imagem de compartilhamento (Open Graph e Twitter), gerada no build com
 * `next/og`. O `next/og` só lê fontes TTF/OTF/WOFF, por isso assets/og/ guarda
 * instâncias estáticas (e só com os caracteres latinos) das fontes do site.
 */

export const shareImageSize = {width: 1200, height: 630};
export const shareImageAlt = `${siteName}: ${taglineLead} ${taglineHighlight}`;

// Caminhos literais: com um caminho montado em variável, o Turbopack
// empacotaria o projeto inteiro junto do código de servidor.
const [displayBold, sansRegular, sansSemiBold, junoPng] = await Promise.all([
  readFile(join(process.cwd(), 'assets/og/FunnelDisplay-Bold.ttf')),
  readFile(join(process.cwd(), 'assets/og/FunnelSans-Regular.ttf')),
  readFile(join(process.cwd(), 'assets/og/FunnelSans-SemiBold.ttf')),
  readFile(join(process.cwd(), 'public/images/juno-oficial.png')),
]);
const junoSrc = `data:image/png;base64,${junoPng.toString('base64')}`;

const color = {
  navy: '#0A1662',
  navySoft: '#17237A',
  blue: '#3C7EF9',
  blueLight: '#7FA8FF',
  cyan: '#22D3EE',
  white: '#FFFFFF',
  muted: 'rgba(255, 255, 255, 0.72)',
};

const formatMetric = (value: number, suffix = '') => `${value.toLocaleString('pt-BR')}${suffix}`;

function TileMark({size}: {size: number}) {
  const tile = size * 0.47;
  const radius = size * 0.09;
  const square = (background: string, dot = false) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        width: tile,
        height: tile,
        borderRadius: radius,
        background,
      }}
    >
      {dot && (
        <div
          style={{
            width: tile * 0.38,
            height: tile * 0.38,
            margin: tile * 0.12,
            borderRadius: '50%',
            background: color.cyan,
          }}
        />
      )}
    </div>
  );
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', width: size, height: size, gap: size * 0.06}}>
      {square(color.white)}
      {square(color.white, true)}
      {square(color.white)}
      {square(color.blue)}
    </div>
  );
}

function StageTile({background, dot = false}: {background: string; dot?: boolean}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        borderRadius: 30,
        background,
      }}
    >
      {dot && <div style={{width: 56, height: 56, borderRadius: '50%', background: color.cyan}} />}
    </div>
  );
}

export function renderShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '60px 72px',
          background: color.navy,
          color: color.white,
          fontFamily: 'Funnel Sans',
        }}
      >
        {/* Texto */}
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <TileMark size={42} />
            <div style={{display: 'flex', fontFamily: 'Funnel Display', fontSize: 34, letterSpacing: -0.5}}>
              <span>Sou</span>
              <span style={{color: color.blueLight}}>Junior</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 12,
                padding: '10px 22px',
                border: '1.5px solid rgba(255, 255, 255, 0.28)',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.06)',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              <div style={{width: 12, height: 12, borderRadius: '50%', background: color.cyan}} />
              {communityFacts.openAndFree}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 640,
                fontFamily: 'Funnel Display',
                fontSize: 62,
                lineHeight: 1.04,
                letterSpacing: -2,
              }}
            >
              <span>{taglineLead}</span>
              <span style={{color: color.cyan}}>{taglineHighlight}</span>
            </div>
          </div>

          <div style={{display: 'flex', gap: 48}}>
            {metrics.map((metric) => (
              <div key={metric.label} style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <span style={{fontFamily: 'Funnel Display', fontSize: 38, letterSpacing: -1}}>
                  {formatMetric(metric.value, metric.suffix)}
                </span>
                <span style={{color: color.muted, fontSize: 20}}>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Palco do Juno */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', width: 340}}>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8, marginBottom: 6}}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 78,
                padding: '14px 18px',
                borderRadius: '18px 18px 4px 18px',
                background: color.white,
                color: color.navy,
                fontSize: 19,
                lineHeight: 1.25,
              }}
            >
              <span style={{fontWeight: 600}}>Oi, eu sou o Juno!</span>
              <span>Seu guia na SouJunior.</span>
            </div>
            <img src={junoSrc} width={104} height={137} alt="" />
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', width: 318, gap: 18}}>
            <StageTile background={color.navySoft} />
            <StageTile background={color.navySoft} dot />
            <StageTile background={color.navySoft} />
            <StageTile background={color.blue} />
          </div>
        </div>
      </div>
    ),
    {
      ...shareImageSize,
      fonts: [
        {name: 'Funnel Display', data: displayBold, weight: 700, style: 'normal'},
        {name: 'Funnel Sans', data: sansRegular, weight: 400, style: 'normal'},
        {name: 'Funnel Sans', data: sansSemiBold, weight: 600, style: 'normal'},
      ],
    },
  );
}
