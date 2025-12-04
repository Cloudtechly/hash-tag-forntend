import React from 'react';
import { FiBox, FiFileText, FiCheckCircle } from 'react-icons/fi';

const MyListings = () => {
  const listings = [
    { icon: <FiBox className="text-orange-500" />, title: 'Active', count: '10 listings' },
    { icon: <FiFileText className="text-orange-500" />, title: 'Drafts', count: '10 listings' },
    { icon: <FiCheckCircle className="text-orange-500" />, title: 'Closed', count: '15 listings' },
  ];

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">My listings</h3>
      <div className="space-y-3">
        {listings.map((item, index) => (
          <div key={index} className="flex items-center bg-orange-50 rounded-lg p-3">
            <div className="bg-orange-100 p-2 rounded-lg mr-4">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
