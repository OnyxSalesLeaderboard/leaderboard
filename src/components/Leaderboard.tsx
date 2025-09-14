'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry, FilterType } from '@/lib/googleSheets';
import FilterButtons from '@/components/FilterButtons';
import TopThreeCards from '@/components/TopThreeCards';
import LeaderboardList from '@/components/LeaderboardList';
import SearchBar from '@/components/SearchBar';

interface LeaderboardData {
  data: LeaderboardEntry[];
  filter: FilterType;
  timestamp: string;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('YTD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaderboardData = async (filter: FilterType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/leaderboard?filter=${filter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data: LeaderboardData = await response.json();
      setLeaderboardData(data.data);
      setCurrentFilter(data.filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(currentFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    fetchLeaderboardData(filter);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Filter data based on search term
  const filteredData = leaderboardData.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    );
  }

  const topThree = filteredData.slice(0, 3);
  const remaining = filteredData.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ONYX Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wider">ONYX</h1>
        </div>

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
      </div>
    </div>
  );
}
