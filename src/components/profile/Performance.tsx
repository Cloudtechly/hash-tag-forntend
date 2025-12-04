import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Performance = () => {
    const data = [
        { name: 'Week 1', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Week 2', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Week 3', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Week 4', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Week 5', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Week 6', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Week 7', uv: 3490, pv: 4300, amt: 2100 },
      ];

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold mb-2">Performance</h3>
      <p className="text-sm text-gray-500">Views Over Time</p>
      <p className="text-3xl font-bold">12,345</p>
      <p className="text-sm text-orange-500 mb-4">Last 30 Days</p>
      
      <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FDBA74" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#FDBA74" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#FB923C" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-sm text-orange-500 mt-2 px-4">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </div>
  );
};

export default Performance;
