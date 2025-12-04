import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

interface FilterOptionsProps {
  onClose: () => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onClose }) => {
  const [condition, setCondition] = useState('New');
  const [size, setSize] = useState('L');
  const colors = ['#FFFFFF', '#000000', '#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'];

  return (
    <div className="p-4 bg-white rounded-t-3xl -mt-10 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
        <FiX size={24} />
      </button>
      <div className="flex justify-between items-center bg-pink-50 p-4 rounded-lg mb-6">
        <span className="text-gray-500">Category</span>
        <div>
            <FiChevronDown className="inline text-orange-500" />
            <FiChevronUp className="inline text-orange-500" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Price Range</h3>
        <input type="range" min="500" max="1500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>500 LYD</span>
          <span>1.5K LYD</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Condition</h3>
        <div className="flex bg-pink-50 rounded-full p-1">
          <button
            onClick={() => setCondition('New')}
            className={`w-1/2 py-2 rounded-full ${condition === 'New' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
          >
            New
          </button>
          <button
            onClick={() => setCondition('Used')}
            className={`w-1/2 py-2 rounded-full ${condition === 'Used' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
          >
            Used
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Size</h3>
        <div className="flex space-x-2">
          {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-full ${size === s ? 'bg-orange-500 text-white' : 'bg-pink-50 text-gray-500'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-2">Color</h3>
        <div className="flex space-x-2">
          {colors.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color }}
              className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ))}
        </div>
      </div>

      <button className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl">
        Apply
      </button>
    </div>
  );
};

export default FilterOptions;
