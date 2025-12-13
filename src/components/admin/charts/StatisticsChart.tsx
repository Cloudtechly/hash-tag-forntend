import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const salesData = [
  { name: 'Jan', sales: 50, revenue: 40 },
  { name: 'Feb', sales: 60, revenue: 45 },
  { name: 'Mar', sales: 45, revenue: 35 },
  { name: 'Apr', sales: 70, revenue: 55 },
  { name: 'May', sales: 65, revenue: 50 },
  { name: 'Jun', sales: 40, revenue: 30 },
  { name: 'Jul', sales: 80, revenue: 65 },
  { name: 'Aug', sales: 110, revenue: 90 },
  { name: 'Sep', sales: 230, revenue: 110 },
  { name: 'Oct', sales: 210, revenue: 100 },
  { name: 'Nov', sales: 220, revenue: 105 },
  { name: 'Dec', sales: 215, revenue: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-sm bg-white p-4 shadow-lg border border-gray-200">
        <p className="label text-sm font-bold">{`${label}`}</p>
        <p className="text-blue-500">{`Sales: ${payload[0].value}`}</p>
        <p className="text-gray-500">{`Revenue: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};


const StatisticsChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default  sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <h5 className="text-xl font-bold text-black ">
            Statistics
          </h5>
          <p className="text-sm text-gray-500">Target you've set for each month</p>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 ">
            <button
              onClick={() => setTimeframe('Monthly')}
              className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card   ${timeframe === 'Monthly' && 'bg-white shadow-card'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('Quarterly')}
              className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card   ${timeframe === 'Quarterly' && 'bg-white shadow-card'}`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeframe('Annually')}
              className={`rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card   ${timeframe === 'Annually' && 'bg-white shadow-card'}`}
            >
              Annually
            </button>
          </div>
        </div>
      </div>

      <div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={salesData}
            margin={{
              top: 50,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#BFD7FE" strokeWidth={2} />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#A7B5C4" fill="#E0E7FF" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsChart;
