import { LeaderboardEntry, FilterType } from '@/lib/googleSheets';

interface TopThreeCardsProps {
  topThree: LeaderboardEntry[];
  currentFilter: FilterType;
}

export default function TopThreeCards({ topThree, currentFilter }: TopThreeCardsProps) {
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

  const getCardStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400';
      case 2:
        return 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400';
      case 3:
        return 'bg-gradient-to-br from-orange-200 to-orange-300 border-orange-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const formatSales = (value: number): string => {
    return `${value} SALES`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {topThree.map((entry) => (
        <div
          key={entry.rank}
          className={`relative p-6 rounded-2xl border-2 shadow-lg transform transition-all duration-200 hover:scale-105 ${getCardStyles(
            entry.rank
          )}`}
        >
          {/* Rank Badge */}
          <div className="absolute -top-3 left-4">
            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
              #{entry.rank}
            </div>
          </div>

          {/* Content */}
          <div className="pt-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.name}</h3>
            <div className="flex items-center justify-center text-gray-700">
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
