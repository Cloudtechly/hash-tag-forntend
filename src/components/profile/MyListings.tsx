import React from 'react';
import { FiBox, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface MyListingsProps {
  stats: {
    approved_products_count: number;
    draft_products_count: number;
    closed_products_count: number;
  } | null;
}

const MyListings: React.FC<MyListingsProps> = ({ stats }) => {
  const listings = [
    { 
      icon: <FiBox className="text-orange-500" />, 
      title: 'Active', 
      count: `${stats?.approved_products_count || 0} listings` 
    },
    { 
      icon: <FiFileText className="text-orange-500" />, 
      title: 'Drafts', 
      count: `${stats?.draft_products_count || 0} listings` 
    },
    { 
      icon: <FiCheckCircle className="text-orange-500" />, 
      title: 'Closed', 
      count: `${stats?.closed_products_count || 0} listings` 
    },
  ];

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">My listings</h3>
      <div className="space-y-3">
        {listings.map((item, index) => (
          <Link key={index} to="/customer/my-products" className="flex items-center bg-orange-50 rounded-lg p-3">
            <div className="bg-orange-100 p-2 rounded-lg mr-4">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
