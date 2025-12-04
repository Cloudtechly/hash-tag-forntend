import React from 'react';

const Overview = () => {
  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-sm text-green-500">+10%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Offers</p>
          <p className="text-2xl font-bold">567</p>
          <p className="text-sm text-green-500">+5%</p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-500">Average offers Closed Value</p>
        <p className="text-2xl font-bold">$45.67</p>
        <p className="text-sm text-red-500">-2%</p>
      </div>
    </div>
  );
};

export default Overview;
