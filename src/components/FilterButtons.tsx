import { useEffect, useState } from 'react';
import { FilterState, TopLevelFilter, SecondLevelFilter } from '@/lib/googleSheets';

interface FilterButtonsProps {
  currentFilter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  sheetName?: string; // optional, defaults to 'Reps'
}

export default function FilterButtons({ currentFilter, onFilterChange, sheetName = 'Reps' }: FilterButtonsProps) {
  const topLevelFilters: TopLevelFilter[] = ['SUBMITTED', 'VERIFIED', 'INSTALLED'];
  const [yesterdayHeaderLabel, setYesterdayHeaderLabel] = useState<string | null>(null);
  
  const getSecondLevelFilters = (topLevel: TopLevelFilter): SecondLevelFilter[] => {
    switch (topLevel) {
      case 'SUBMITTED':
        return ['YESTERDAY', 'WTD', 'MTD', 'YTD'];
      case 'VERIFIED':
        return ['WTD', 'MTD', 'YTD'];
      case 'INSTALLED':
        return ['MTD', 'YTD'];
      default:
        return [];
    }
  };

  const getYesterdayLabel = () => {
    // Only use the header-provided label. If not available, show literal 'YESTERDAY'.
    return (yesterdayHeaderLabel && yesterdayHeaderLabel.trim() !== '')
      ? yesterdayHeaderLabel
      : 'YESTERDAY';
  };

  const getSecondLevelLabel = (filter: SecondLevelFilter) => {
    return filter === 'YESTERDAY' ? getYesterdayLabel() : filter;
  };

  const handleTopLevelChange = (topLevel: TopLevelFilter) => {
    const availableSecondLevel = getSecondLevelFilters(topLevel);
    // Preserve the current second-level when valid; otherwise default to leftmost
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

  // Fetch the header 'Yesterday' label when using SUBMITTED
  useEffect(() => {
    let isMounted = true;
    async function fetchHeaderLabel() {
      try {
        if (currentFilter.topLevel !== 'SUBMITTED') {
          if (isMounted) setYesterdayHeaderLabel(null);
          return;
        }
        const res = await fetch(`/api/header?topLevel=SUBMITTED&sheetName=${encodeURIComponent(sheetName)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          // data.label is the trimmed date like "Sep 18"
          setYesterdayHeaderLabel(typeof data.label === 'string' ? data.label : null);
        }
      } catch (e) {
        // Silently ignore and fallback to computed date
        if (isMounted) setYesterdayHeaderLabel(null);
      }
    }
    fetchHeaderLabel();
    return () => {
      isMounted = false;
    };
  }, [currentFilter.topLevel, sheetName]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      {/* Top Level Filters */}
      <div className="bg-[#1c1c1c] content-stretch flex gap-[4px] items-start justify-start rounded-[120px]">
        {topLevelFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleTopLevelChange(filter)}
            className={`content-stretch flex gap-[10px] items-center justify-center px-[24px] py-[20px] md:px-[30px] md:py-[25px] rounded-[120px] shrink-0 transition-all duration-200 ${
              currentFilter.topLevel === filter
                ? 'bg-[#4361ee] text-white'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <div className="font-sans leading-[0] text-[14px] md:text-[14px] text-nowrap font-normal">
              {filter}
            </div>
          </button>
        ))}
      </div>

      {/* Second Level Filters */}
      <div className="bg-[#1c1c1c] content-stretch flex gap-[4px] items-start justify-start rounded-[120px]">
        {getSecondLevelFilters(currentFilter.topLevel).map((filter) => (
          <button
            key={filter}
            onClick={() => handleSecondLevelChange(filter)}
            className={`content-stretch flex gap-[10px] items-center justify-center px-[24px] py-[20px] md:px-[30px] md:py-[25px] rounded-[120px] shrink-0 transition-all duration-200 ${
              currentFilter.secondLevel === filter
                ? 'bg-[#4361ee] text-white'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <div className="font-sans leading-[0] text-[14px] md:text-[14px] text-nowrap font-normal">
              {getSecondLevelLabel(filter)}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
