import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import { getSalesValue } from '@/lib/filterUtils';
import { getTeamColor } from '@/lib/teamColors';
import TopCard from '@/components/TopCard';

interface TopThreeCardsProps {
  topThree: LeaderboardEntry[];
  currentFilter: FilterState;
  sheetName?: string;
}

export default function TopThreeCards({ topThree, currentFilter, sheetName = 'Reps' }: TopThreeCardsProps) {


  return (
    <div className="flex flex-col md:flex-row items-end gap-4 mb-8">
      {topThree.map((entry) => (
        <div key={entry.rank} className="size-full">
          {entry.rank === 1 ? (
            <TopCard entry={entry} currentFilter={currentFilter} sheetName={sheetName} />
          ) : entry.rank === 2 ? (
            <TopCard entry={entry} currentFilter={currentFilter} variant="secondary" sheetName={sheetName} />
          ) : entry.rank === 3 ? (
            <TopCard entry={entry} currentFilter={currentFilter} variant="tertiary" sheetName={sheetName} />
          ) : (
            <TopCard entry={entry} currentFilter={currentFilter} variant="standard" sheetName={sheetName} />
          )}
        </div>
      ))}
    </div>
  );
}
