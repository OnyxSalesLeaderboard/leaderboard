import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import { getSalesValue } from '@/lib/filterUtils';
import { getTeamColor } from '@/lib/teamColors';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentFilter: FilterState;
}

export default function LeaderboardList({ entries, currentFilter }: LeaderboardListProps) {

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.name}`}
          className="bg-gradient-to-b content-stretch flex from-[#f4f4f4] items-start justify-start overflow-clip relative rounded-[20px] size-full to-[#e4e4e4]"
        >
          {/* Rank section */}
          <div className="content-stretch flex flex-col gap-[6px] items-center justify-center relative self-stretch shrink-0 w-[59px]">
            <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
            <div className="font-sans font-bold leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center text-nowrap">
              <p className="leading-[normal] whitespace-pre">#{entry.rank}</p>
            </div>
          </div>

          {/* Content section */}
          <div className="basis-0 box-border content-stretch flex grow h-[74px] items-center justify-between min-h-px min-w-px px-5 md:px-[20px] py-[10px] relative shrink-0">
            <div className="content-stretch flex flex-col md:flex-row gap-[5px] md:gap-[15px] items-start md:items-center justify-start relative shrink-0">
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
