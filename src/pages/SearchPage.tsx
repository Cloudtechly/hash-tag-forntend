import React, { useState, useEffect } from 'react';
import Header from '../components/home/Header';
import SearchBarWithFilter from '../components/search/SearchBarWithFilter';
import RecentSearches from '../components/search/RecentSearches';
import FilterOptions from '../components/search/FilterOptions';
import fetchData from '../Api/FetchApi';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router';

const SearchPage = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const fetchRecents = async () => {
    try {
      const res = await fetchData('customer/me/recents');
      const items = res.data ? res.data : (res || []);
      setRecentSearches(items.map((item: any) => item.search_term));
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchRecents();
  }, []);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData(`customer/search?q=${encodeURIComponent(searchQuery)}`);
      const data = res.results ? res.results : (res.data || res || []);
      setResults(data);
      // Save search term to recents
      if (searchQuery.trim()) {
        try {
          await fetchData('customer/me/recents', 'POST', { search_term: searchQuery.trim() });
          // Refresh recent searches after successful POST
          fetchRecents();
        } catch (err) {
          // Optionally handle error silently
        }
      }
    } catch (err) {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" pb-24 max-w-7xl mx-auto min-h-screen ">
     
      <div className="p-4">
  <SearchBarWithFilter onFilterClick={toggleFilter} onSearch={handleSearch} />
        <RecentSearches
          searches={recentSearches.slice(0, 5)}
          onSelect={handleSearch}
          onDelete={async (search, idx) => {
            try {
              // You may want to use the real ID if available, here we use index+1 for demo
              await fetchData(`customer/me/recents/${idx+1}`, 'DELETE');
              fetchRecents();
            } catch {}
          }}
        />
        {/* Search Results */}
        {loading && <div className="mt-6 text-gray-400">Loading...</div>}
        {error && <div className="mt-6 text-red-500">{error}</div>}
        {!loading && !error && results && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Search Results for "{query}"</h2>
            {/* If results is an object with sections */}
            {typeof results === 'object' && !Array.isArray(results) && results.products && (
              <div className="mb-8">
                <h3 className="text-md font-bold mb-2">products</h3>
                <ul className="space-y-4">
                  {results.products.map((cat: any) => (
                    <Link to={"product/"+cat.id

                    } key={cat.id} className="p-4 border rounded-xl flex items-center gap-4">
                      <img src={cat.image_url} alt={cat.name} className="w-16 h-16 object-cover rounded-lg border" />
                      <div>
                        <span className="font-bold text-gray-900">{cat.name_display || cat.name}</span>
                        <div className="text-gray-600 text-sm">{cat.description_display || cat.description}</div>
                      </div>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
            {/* If results is an array (default, products, etc.) */}
            {Array.isArray(results) && results.length > 0 && (
              <ul className="space-y-4">
                {results.map((item: any) => (
                  <li key={item.id} className="p-4 border rounded-xl flex flex-col gap-2">
                    <span className="font-bold text-gray-900">{item.title || item.name}</span>
                    <span className="text-gray-600">{item.short_description || item.description}</span>
                    {item.price && <span className="text-orange-600 font-bold">LYD {item.price}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!loading && !error && query && Array.isArray(results) && results.length === 0 && (
          <div className="mt-6 text-gray-400">No results found.</div>
        )}
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
