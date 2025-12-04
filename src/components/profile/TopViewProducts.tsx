import React from 'react';

const TopViewProducts = () => {
  const products = [
    { name: 'Product A', height: 'h-32' },
    { name: 'Product B', height: 'h-24' },
    { name: 'Product C', height: 'h-28' },
  ];

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold">Top View Products</h3>
      <p className="text-sm text-orange-500 mb-4">Last 30 Days</p>
      <div className="flex justify-around items-end h-40">
        {products.map((product, index) => (
          <div key={index} className="text-center">
            <div className={`bg-orange-100 rounded-t-lg w-16 mx-auto ${product.height}`}>
                <div className="bg-orange-400 h-1 rounded-t-lg"></div>
            </div>
            <p className="text-sm mt-2 text-orange-500">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopViewProducts;
