import React from 'react';
import { FiX } from 'react-icons/fi';

interface RecentSearchesProps {
  searches: string[];
  onSelect?: (search: string) => void;
  onDelete?: (search: string, idx: number) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelect, onDelete }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Recent search</h2>
      <ul className="space-y-4">
        {searches.length === 0 ? (
          <li className="text-gray-400">No recent searches</li>
        ) : (
          searches.map((search, index) => (
            <li key={index} className="flex justify-between items-center">
              <button
                className="text-gray-600 hover:text-[#E46A4B] text-left flex-1 truncate font-medium"
                style={{outline: 'none'}}
                onClick={() => onSelect && onSelect(search)}
              >
                {search}
              </button>
              <button
                className="text-gray-400 ml-2"
                tabIndex={-1}
                onClick={() => onDelete && onDelete(search, index)}
                title="Delete"
              >
                <FiX />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentSearches;
