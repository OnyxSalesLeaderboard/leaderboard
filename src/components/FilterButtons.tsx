import { FilterType } from '@/lib/googleSheets';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  const filters: FilterType[] = ['YTD', 'MTD', 'WTD', 'YESTERDAY'];

  const getYesterdayLabel = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFilterLabel = (filter: FilterType) => {
    return filter === 'YESTERDAY' ? getYesterdayLabel() : filter;
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-[#f1f1f1] content-stretch flex gap-[4px] items-start justify-start rounded-[120px]">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`content-stretch flex gap-[10px] items-center justify-center px-[30px] py-[25px] rounded-[120px] shrink-0 transition-all duration-200 ${
              currentFilter === filter
                ? 'bg-[#4361ee] text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            <div className="font-sans leading-[0] text-[14px] text-nowrap font-normal">
              {getFilterLabel(filter)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
