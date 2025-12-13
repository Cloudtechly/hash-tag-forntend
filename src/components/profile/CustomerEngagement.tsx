import React from 'react';

const CustomerEngagement = ({stats}: {stats: any}) => {

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-4">Customer Engagement</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Followers</p>
          <p className="text-2xl font-bold">{stats?.followers_count}</p>
          <p className="text-sm text-green-500">+20%</p>
        </div>
        
      </div>
    </div>
  );
};

export default CustomerEngagement;
