import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const markers = [
  { markerOffset: -15, name: 'USA', coordinates: [-100.0, 40.0] },
  { markerOffset: -15, name: 'Brazil', coordinates: [-55.0, -10.0] },
  { markerOffset: 25, name: 'Russia', coordinates: [105.0, 60.0] },
  { markerOffset: 25, name: 'Australia', coordinates: [135.0, -25.0] },
];

const CustomersDemographicChart: React.FC = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-bold text-black dark:text-white">
        Customers Demographic
      </h4>
      <span className="text-sm font-medium">Number of customer based on country</span>

      <div className="mt-4">
        <ComposableMap
          projectionConfig={{
            scale: 150,
            center: [0, 20],
          }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E9E9E9"
                  stroke="#FFF"
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates as [number, number]}>
              <circle r={8} fill="#3B82F6" stroke="#fff" strokeWidth={2} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src="https://flagcdn.com/us.svg" width="24" alt="USA flag" />
                <span className="font-medium">USA</span>
            </div>
            <span className="font-medium">2,379 Customers</span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "79%"}}></div>
            </div>
            <span className="font-medium">79%</span>
        </div>
      </div>
    </div>
  );
};

export default CustomersDemographicChart;
