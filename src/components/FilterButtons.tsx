import { FilterType } from '@/lib/googleSheets';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  const filters: FilterType[] = ['YTD', 'MTD', 'WTD'];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-gray-200 rounded-full p-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              currentFilter === filter
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
