import React from 'react';

interface OverviewProps {
  stats: {
    products_views_count: number;
    approved_products_count: number;
    closed_products_count: number;
    views_last_30_days: number;
  } | null;
}

const Overview: React.FC<OverviewProps> = ({ stats }) => {
  if (!stats) return <div className="bg-white p-4 mt-4 animate-pulse h-40"></div>;

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">{stats.products_views_count}</p>
          <p className="text-sm text-green-500">+{stats.views_last_30_days} last 30 days</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Active Products</p>
          <p className="text-2xl font-bold">{stats.approved_products_count}</p>
          <p className="text-sm text-gray-400">Live now</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-500">Closed Products</p>
        <p className="text-2xl font-bold">{stats.closed_products_count}</p>
        <p className="text-sm text-gray-400">Lifetime</p>
      </div>
    </div>
  );
};

export default Overview;
