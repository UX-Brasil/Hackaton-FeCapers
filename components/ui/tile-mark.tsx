import {cn} from '@/lib/utils';

interface TileMarkProps {
  className?: string;
  /** `brand` usa as cores do símbolo; `mono` herda `currentColor`. */
  tone?: 'brand' | 'mono';
}

/**
 * Motivo gráfico decorativo baseado no símbolo do logo SouJunior:
 * quatro blocos em grade 2×2 e o ponto no bloco superior direito.
 */
export function TileMark({className, tone = 'mono'}: TileMarkProps) {
  const brand = tone === 'brand';
  const base = brand ? '#0a1662' : 'currentColor';
  const accent = brand ? '#3c7ef9' : 'currentColor';
  const dot = brand ? '#22d3ee' : 'transparent';

  return (
    <svg className={cn('tilemark', className)} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="16" height="16" rx="3" fill={base} />
      <rect x="18" y="0" width="16" height="16" rx="3" fill={base} />
      <rect x="0" y="18" width="16" height="16" rx="3" fill={base} />
      <rect x="18" y="18" width="16" height="16" rx="3" fill={accent} opacity={brand ? 1 : 0.55} />
      <circle cx="26" cy="8" r="3" fill={dot} />
    </svg>
  );
}
