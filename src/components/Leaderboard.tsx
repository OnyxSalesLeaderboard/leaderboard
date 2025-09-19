'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry, FilterState } from '@/lib/googleSheets';
import FilterButtons from '@/components/FilterButtons';
import TopThreeCards from '@/components/TopThreeCards';
import LeaderboardList from '@/components/LeaderboardList';
import SearchBar from '@/components/SearchBar';
import Hero from '@/components/Hero';

interface LeaderboardData {
  data: LeaderboardEntry[];
  filter: FilterState;
  timestamp: string;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [leaderboardDataWithZeros, setLeaderboardDataWithZeros] = useState<LeaderboardEntry[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterState>({ topLevel: 'SUBMITTED', secondLevel: 'YESTERDAY' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaderboardData = async (filterState: FilterState) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both datasets in parallel
      const [normalResponse, zeroResponse] = await Promise.all([
        fetch(`/api/leaderboard?topLevel=${filterState.topLevel}&secondLevel=${filterState.secondLevel}&includeZeroSales=false`),
        fetch(`/api/leaderboard?topLevel=${filterState.topLevel}&secondLevel=${filterState.secondLevel}&includeZeroSales=true`)
      ]);
      
      if (!normalResponse.ok || !zeroResponse.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const [normalResult, zeroResult]: [LeaderboardData, LeaderboardData] = await Promise.all([
        normalResponse.json(),
        zeroResponse.json()
      ]);
      
      setLeaderboardData(normalResult.data);
      setLeaderboardDataWithZeros(zeroResult.data);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(currentFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (filterState: FilterState) => {
    setCurrentFilter(filterState);
    fetchLeaderboardData(filterState);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Filter data based on search term - use appropriate dataset
  const filteredData = searchTerm.trim() !== '' 
    ? leaderboardDataWithZeros.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leaderboardData;

  const topThree = filteredData.slice(0, 3);
  const remaining = filteredData.slice(3);

  return (
    <div className="min-h-screen bg-black text-white p-[10px]">
      {/* Hero Section - Always visible */}
      <Hero />
      
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={() => fetchLeaderboardData(currentFilter)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className='flex flex-col md:flex-row items-center justify-center w-[100%] md:gap-[15px] gap-4 mb-12'>
              {/* Filter Buttons */}
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
              />

              {/* Search Bar */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </div>
            {/* Top Three Cards */}
            {topThree.length > 0 && (
              <TopThreeCards
                topThree={topThree}
                currentFilter={currentFilter}
              />
            )}

            {/* Remaining Leaderboard */}
            {remaining.length > 0 && (
              <LeaderboardList
                entries={remaining}
                currentFilter={currentFilter}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
