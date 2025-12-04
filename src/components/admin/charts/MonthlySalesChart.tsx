import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 240 },
  { name: 'Feb', sales: 190 },
  { name: 'Mar', sales: 290 },
  { name: 'Apr', sales: 220 },
  { name: 'May', sales: 180 },
  { name: 'Jun', sales: 280 },
  { name: 'Jul', sales: 180 },
  { name: 'Aug', sales: 220 },
  { name: 'Sep', sales: 340 },
  { name: 'Oct', sales: 280 },
  { name: 'Nov', sales: 180 },
  { name: 'Dec', sales: 120 },
];

const MonthlySalesChart: React.FC = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">
            Monthly Sales
          </h4>
        </div>
        <div>
          {/* Options dropdown can be added here */}
        </div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip wrapperClassName="!bg-white !border-stroke !rounded-sm" />
            <Bar dataKey="sales" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
