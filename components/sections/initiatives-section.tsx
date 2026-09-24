import {initiatives} from '@/content/site';
import {Button} from '@/components/ui/button';

/** Duas falas em idiomas diferentes: a conversa da SouJunior Talk. */
function TalkArt() {
  return (
    <svg className="initiative__art" viewBox="0 0 120 100" aria-hidden="true" focusable="false" data-art>
      <g data-art-piece>
        <rect x="0" y="0" width="74" height="44" rx="12" fill="#0a1662" />
        <path d="M14 43 L14 58 L30 43 Z" fill="#0a1662" />
        <text x="37" y="28" textAnchor="middle" fill="#fff" fontFamily="Funnel Display Variable, sans-serif" fontSize="17" fontWeight="700">
          Hi!
        </text>
      </g>
      <g data-art-piece>
        <rect x="44" y="40" width="76" height="44" rx="12" fill="#22d3ee" />
        <path d="M106 83 L106 98 L90 83 Z" fill="#22d3ee" />
        <text x="82" y="68" textAnchor="middle" fill="#0a1662" fontFamily="Funnel Display Variable, sans-serif" fontSize="17" fontWeight="700">
          Olá!
        </text>
      </g>
    </svg>
  );
}

/** Blocos sendo montados: a bancada de projetos da SouJunior Labs. */
function LabsArt() {
  const tiles = [
    {x: 0, y: 0, fill: '#0a1662'},
    {x: 37, y: 0, fill: '#6366f1'},
    {x: 74, y: 0, fill: 'none'},
    {x: 0, y: 37, fill: '#c7c8fb'},
    {x: 37, y: 37, fill: '#0a1662', code: true},
    {x: 74, y: 37, fill: '#facc15'},
    {x: 0, y: 74, fill: 'none'},
    {x: 37, y: 74, fill: '#6366f1'},
    {x: 74, y: 74, fill: '#0a1662'},
  ];

  return (
    <svg className="initiative__art" viewBox="0 0 106 106" aria-hidden="true" focusable="false" data-art>
      {tiles.map((tile) => (
        <g key={`${tile.x}-${tile.y}`} data-art-piece>
          <rect
            x={tile.x + 0.75}
            y={tile.y + 0.75}
            width="30.5"
            height="30.5"
            rx="7"
            fill={tile.fill}
            stroke={tile.fill === 'none' ? '#6366f1' : 'none'}
            strokeWidth="1.5"
            strokeDasharray={tile.fill === 'none' ? '4 3' : undefined}
          />
          {tile.code && (
            <text x={tile.x + 16} y={tile.y + 21} textAnchor="middle" fill="#fff" fontFamily="Funnel Display Variable, sans-serif" fontSize="12" fontWeight="700">
              {'</>'}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const art = {Talk: TalkArt, Labs: LabsArt} as const;

export function InitiativesSection() {
  return (
    <section id="iniciativas" className="section initiatives" aria-labelledby="iniciativas-title" data-nav="iniciativas">
      <div className="wrap">
        <header className="section-header section-header--split" data-reveal>
          <div>
            <p className="eyebrow">Iniciativas</p>
            <h2 id="iniciativas-title" className="section-title">
              Vá além com nossas iniciativas
            </h2>
          </div>
          <p className="lead">
            Programas complementares criados para ampliar sua experiência prática e seu desenvolvimento profissional.
          </p>
        </header>

        <div className="initiatives__grid" data-stagger>
          {initiatives.map((initiative) => {
            const Art = art[initiative.highlight as keyof typeof art];
            return (
              <article className="initiative" data-accent={initiative.accent} key={initiative.name}>
                <div className="initiative__top">
                  <p className="initiative__category">{initiative.category}</p>
                  {Art && <Art />}
                </div>
                <h3 className="initiative__name">
                  <span>SouJunior</span> {initiative.highlight}
                </h3>
                <p className="initiative__text">{initiative.text}</p>
                <Button href={initiative.href} variant="secondary" pendingMessage={initiative.pendingMessage}>
                  Conhecer a {initiative.name}
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
