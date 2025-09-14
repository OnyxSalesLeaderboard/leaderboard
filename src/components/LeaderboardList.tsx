import { LeaderboardEntry, FilterType } from '@/lib/googleSheets';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentFilter: FilterType;
}

export default function LeaderboardList({ entries, currentFilter }: LeaderboardListProps) {
  const getSalesValue = (entry: LeaderboardEntry, filter: FilterType): number => {
    switch (filter) {
      case 'YTD':
        return entry.ytdSales;
      case 'MTD':
        return entry.mtdSales;
      case 'WTD':
        return entry.wtdSales;
      default:
        return 0;
    }
  };

  const formatSales = (value: number): string => {
    return `${value} SALES`;
  };

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.name}`}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Rank and Name */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-bold min-w-[3rem] text-center">
                #{entry.rank}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{entry.name}</h3>
              </div>
            </div>

            {/* Right side - Sales info */}
            <div className="flex items-center text-gray-600">
              <span className="text-sm font-medium">
                {formatSales(getSalesValue(entry, currentFilter))}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
