import { FilterState, TopLevelFilter, SecondLevelFilter } from '@/lib/googleSheets';

interface FilterButtonsProps {
  currentFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  const topLevelFilters: TopLevelFilter[] = ['SUBMITTED', 'VERIFIED', 'INSTALLED'];
  
  const getSecondLevelFilters = (topLevel: TopLevelFilter): SecondLevelFilter[] => {
    switch (topLevel) {
      case 'SUBMITTED':
        return ['YTD', 'MTD', 'WTD', 'YESTERDAY'];
      case 'VERIFIED':
        return ['YTD', 'MTD', 'WTD'];
      case 'INSTALLED':
        return ['YTD', 'MTD'];
      default:
        return [];
    }
  };

  const getYesterdayLabel = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSecondLevelLabel = (filter: SecondLevelFilter) => {
    return filter === 'YESTERDAY' ? getYesterdayLabel() : filter;
  };

  const handleTopLevelChange = (topLevel: TopLevelFilter) => {
    const availableSecondLevel = getSecondLevelFilters(topLevel);
    const newSecondLevel = availableSecondLevel.includes(currentFilter.secondLevel) 
      ? currentFilter.secondLevel 
      : availableSecondLevel[0];
    
    onFilterChange({
      topLevel,
      secondLevel: newSecondLevel
    });
  };

  const handleSecondLevelChange = (secondLevel: SecondLevelFilter) => {
    onFilterChange({
      ...currentFilter,
      secondLevel
    });
  };

  return (
    <div className="flex flex-col items-center mb-8 gap-4">
      {/* Top Level Filters */}
      <div className="bg-[#f1f1f1] content-stretch flex gap-[4px] items-start justify-start rounded-[120px]">
        {topLevelFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleTopLevelChange(filter)}
            className={`content-stretch flex gap-[10px] items-center justify-center px-[30px] py-[25px] rounded-[120px] shrink-0 transition-all duration-200 ${
              currentFilter.topLevel === filter
                ? 'bg-[#4361ee] text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            <div className="font-sans leading-[0] text-[14px] text-nowrap font-normal">
              {filter}
            </div>
          </button>
        ))}
      </div>

      {/* Second Level Filters */}
      <div className="bg-[#f1f1f1] content-stretch flex gap-[4px] items-start justify-start rounded-[120px]">
        {getSecondLevelFilters(currentFilter.topLevel).map((filter) => (
          <button
            key={filter}
            onClick={() => handleSecondLevelChange(filter)}
            className={`content-stretch flex gap-[10px] items-center justify-center px-[30px] py-[25px] rounded-[120px] shrink-0 transition-all duration-200 ${
              currentFilter.secondLevel === filter
                ? 'bg-[#4361ee] text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            <div className="font-sans leading-[0] text-[14px] text-nowrap font-normal">
              {getSecondLevelLabel(filter)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
