import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import { getSalesValue } from '@/lib/filterUtils';
import { getTeamColor } from '@/lib/teamColors';

const imgUnionGold = "/fe7ce6be7dd20659cf2422a5dda6635725af8b57.svg"; // Gold trophy for #1
const imgUnionSilver = "/02cb8e04cb30466bc045fda161dc3497e606a72d.svg"; // Silver trophy for #2
const imgUnionBronze = "/3a350fc98a1573882d7a0516b185c7d3a51786a5.svg"; // Bronze trophy for #3

interface TopThreeCardsProps {
  topThree: LeaderboardEntry[];
  currentFilter: FilterState;
}

export default function TopThreeCards({ topThree, currentFilter }: TopThreeCardsProps) {

  const getTrophyIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return imgUnionGold;
      case 2:
        return imgUnionSilver;
      case 3:
        return imgUnionBronze;
      default:
        return imgUnionGold;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {topThree.map((entry) => (
        <div
          key={entry.rank}
          className="bg-gradient-to-b flex flex-col h-[150px] from-[#f4f4f4] items-start justify-between overflow-clip relative rounded-[20px] size-full to-[#e4e4e4]"
        >
          {/* Header with rank and trophy */}
          <div className="bg-black box-border content-stretch flex items-center justify-between px-[30px] py-[10px] relative shrink-0 w-full">
            <div className="font-sans font-bold leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
              <p className="leading-[normal] whitespace-pre">#{entry.rank}</p>
            </div>
            <div className="flex items-center justify-center relative shrink-0">
              <div className={`flex-none rotate-[180deg]`}>
                <div className="h-[25.783px] relative w-[20px]">
                  {(entry.rank === 1 || entry.rank === 2 || entry.rank === 3) && (
                    <img alt="" className={`block max-w-none size-full`} src={getTrophyIcon(entry.rank)} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="basis-0 content-stretch flex flex-col gap-[15px] grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full">
            <div className="content-stretch flex gap-[15px] items-center justify-center relative shrink-0">
              <div className="font-sans font-bold leading-[0] not-italic relative shrink-0 text-[20px] text-black text-nowrap">
                <p className="leading-[normal] whitespace-pre">{entry.name}</p>
              </div>
              <div className="bg-black box-border content-stretch flex gap-[3.527px] items-center justify-center px-[8px] py-[6px] relative rounded-[42.319px] shrink-0">
                <div 
                  className="relative shrink-0 size-[6.01px] rounded-full"
                  style={{ backgroundColor: getTeamColor(entry.teamName) }}
                />
                <div className="font-sans font-bold leading-[0] not-italic relative shrink-0 text-[8px] text-nowrap text-white">
                  <p className="leading-[normal] whitespace-pre">{entry.teamName.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[15px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-nowrap">
              <div className="font-sans font-bold relative shrink-0 text-black">
                <p className="leading-[normal] text-nowrap whitespace-pre">{getSalesValue(entry, currentFilter)}</p>
              </div>
              <div className="font-sans font-normal relative shrink-0 text-[rgba(0,0,0,0.6)] uppercase">
                <p className="leading-[normal] text-nowrap whitespace-pre">Sales</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
