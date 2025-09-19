import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import { getSalesValue } from '@/lib/filterUtils';
import { getTeamColor } from '@/lib/teamColors';
import TopCard from '@/components/TopCard';

interface TopThreeCardsProps {
  topThree: LeaderboardEntry[];
  currentFilter: FilterState;
}

export default function TopThreeCards({ topThree, currentFilter }: TopThreeCardsProps) {


  return (
    <div className="flex flex-col md:flex-row items-end gap-4 mb-8">
      {topThree.map((entry) => (
        <div key={entry.rank} className="size-full">
          {entry.rank === 1 ? (
            <TopCard entry={entry} currentFilter={currentFilter} />
          ) : entry.rank === 2 ? (
            <TopCard entry={entry} currentFilter={currentFilter} variant="secondary" />
          ) : entry.rank === 3 ? (
            <TopCard entry={entry} currentFilter={currentFilter} variant="tertiary" />
          ) : (
            <TopCard entry={entry} currentFilter={currentFilter} variant="standard" />
          )}
        </div>
      ))}
    </div>
  );
}
