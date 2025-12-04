import React, { useState } from 'react';
import Header from '../components/home/Header';
import SearchBarWithFilter from '../components/search/SearchBarWithFilter';
import RecentSearches from '../components/search/RecentSearches';
import FilterOptions from '../components/search/FilterOptions';
import { FiX } from 'react-icons/fi';

const SearchPage = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={() => {}} />
      <div className="p-4">
        <SearchBarWithFilter onFilterClick={toggleFilter} />
        <RecentSearches />
        
      </div>
      {isFilterVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleFilter}>
            <div className="fixed bottom-0 left-0 right-0 z-50" onClick={(e) => e.stopPropagation()}>
                <FilterOptions onClose={toggleFilter} />
                 
            </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
