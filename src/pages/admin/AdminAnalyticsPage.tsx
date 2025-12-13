import React from 'react';
import MonthlySalesChart from '../../components/admin/charts/MonthlySalesChart';
import StatisticsChart from '../../components/admin/charts/StatisticsChart';
import CustomersDemographicChart from '../../components/admin/charts/CustomersDemographicChart';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <main className="w-full flex-grow p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black ">
          Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
        {/* Summary Cards could go here */}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <StatisticsChart />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <CustomersDemographicChart />
        </div>
        <div className="col-span-12">
          <MonthlySalesChart />
        </div>
      </div>
    </main>
  );
};

export default AdminAnalyticsPage;
