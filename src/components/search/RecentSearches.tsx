import React from 'react';
import { FiX } from 'react-icons/fi';

const RecentSearches = () => {
  const searches = [
    'Nike shoes',
    'Iphone 13 Pro',
    'PS4 Slim',
    'Leather Wallet',
    'Sonata',
    'Used Sofa',
    'Night stand',
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Recent search</h2>
      <ul className="space-y-4">
        {searches.map((search, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{search}</span>
            <button className="text-gray-400">
              <FiX />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
