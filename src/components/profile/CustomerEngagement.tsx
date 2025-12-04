import React from 'react';

const CustomerEngagement = () => {
  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">Customer Engagement</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Followers</p>
          <p className="text-2xl font-bold">345</p>
          <p className="text-sm text-green-500">+20%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm text-green-500">+1%</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerEngagement;
