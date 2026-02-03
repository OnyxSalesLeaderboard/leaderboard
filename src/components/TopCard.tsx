import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import { getSalesValue, getMetricLabel } from '@/lib/filterUtils';
import { getTeamColor } from '@/lib/teamColors';

// First variation card used for rank #1 in the TopThreeCards section.
// Dark-theme friendly, with a taller body, gradient background, and subtle stroke.
// Future: add variations for ranks #2 and #3.

interface TopCardProps {
  entry: LeaderboardEntry;
  currentFilter: FilterState;
  // Variants: 'primary' for 1st, 'secondary' for 2nd, 'tertiary' for 3rd, 'standard' for others
  variant?: 'primary' | 'secondary' | 'tertiary' | 'standard';
  /** When 'Reps' (home), show TSS instead of Sales. For Products/Teams, show Sales. */
  sheetName?: string;
}

export default function TopCard({ entry, currentFilter, variant = 'primary', sheetName = 'Reps' }: TopCardProps) {
  // Style tokens per variant (from Figma)
  const tokens = {
    primary: {
      gradient:
        'linear-gradient(311deg, rgba(255, 255, 255, 0.00) 75.71%, rgba(255, 255, 255, 0.06) 75.72%, rgba(255, 255, 255, 0.06) 98.97%, rgba(255, 255, 255, 0.00) 98.98%), radial-gradient(139.86% 191.29% at 50% -91.29%, #7C7346 0%, #151515 100%)',
      height: '250px',
    },
    secondary: {
      gradient:
        'linear-gradient(311deg, rgba(255, 255, 255, 0.00) 75.71%, rgba(255, 255, 255, 0.06) 75.72%, rgba(255, 255, 255, 0.06) 98.97%, rgba(255, 255, 255, 0.00) 98.98%), radial-gradient(139.86% 191.29% at 50% -91.29%, #AFAFAF 0%, #151515 100%)',
      height: '200px',
    },
    tertiary: {
      gradient:
        'linear-gradient(311deg, rgba(255, 255, 255, 0.00) 75.71%, rgba(255, 255, 255, 0.06) 75.72%, rgba(255, 255, 255, 0.06) 98.97%, rgba(255, 255, 255, 0.00) 98.98%), radial-gradient(139.86% 191.29% at 50% -91.29%, #826459 0%, #151515 100%)',
      height: '180px',
    },
    standard: {
      gradient: 'linear-gradient(180deg, #1B1B1B 0%, #131313 100%)',
      height: '150px',
    },
  } as const;

  const stroke = '#2B2B2B';
  const { gradient, height } = tokens[variant];

  // Typography sizes by variant
  const rankTextSize =
    variant === 'primary' ? 'text-[41px]' :
    variant === 'secondary' || variant === 'tertiary' ? 'text-[30px]' :
    'text-[15px]';
  const rankSupSize =
    variant === 'primary' ? 'text-[20px]' :
    variant === 'secondary' || variant === 'tertiary' ? 'text-[17px]' :
    'text-[10px]';
  const nameTextSize =
    variant === 'primary' ? 'text-[28px]' :
    variant === 'secondary' || variant === 'tertiary' ? 'text-[24px]' :
    'text-[16px]';

  return (
    <div
      className="flex flex-col justify-center items-center overflow-hidden relative rounded-[24px] size-full border"
      style={{ background: gradient, borderColor: stroke, height }}
    >
      {/* Header with rank */}
      <div className={`font-sans font-bold leading-none text-white/90 ${rankTextSize}`}>
        {entry.rank <= 3 ? (
          <>
            <sup className={`${rankSupSize}`}>#</sup>
            {entry.rank}
          </>
        ) : (
          <>#{entry.rank}</>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-2 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`font-sans font-bold leading-none text-white ${nameTextSize} tracking-tight`}>
            {entry.name}
          </div>
          <div className="bg-black/80 border border-white/10 flex items-center gap-2 px-3 py-1.5 rounded-full">
            <div
              className="size-[6px] rounded-full"
              style={{ backgroundColor: getTeamColor(entry.teamName) }}
            />
            <div className="font-sans font-semibold leading-none text-[10px] text-white/90 tracking-wide">
              {entry.teamName.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="font-sans font-bold text-white text-[17px] leading-none">
            {getSalesValue(entry, currentFilter)}
          </div>
          <div className="font-sans uppercase text-gray-400 text-[17px] leading-none">
            {getMetricLabel(currentFilter.topLevel, sheetName)}
          </div>
        </div>
      </div>
    </div>
  );
}
