import React from 'react';

interface Product {
  id: number;
  name: string;
  views_count?: number;
}

interface TopViewProductsProps {
  products: Product[];
}

const TopViewProducts: React.FC<TopViewProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white p-4 mt-4">
        <h3 className="text-lg font-bold">Top View Products</h3>
        <p className="text-sm text-gray-500 mt-2">No data available yet.</p>
      </div>
    );
  }

  // Find max views to scale the bars
  const maxViews = Math.max(...products.map(p => p.views_count || 0), 1);

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-bold">Top View Products</h3>
      <p className="text-sm text-orange-500 mb-4">Most popular items</p>
      <div className="flex justify-around items-end h-40">
        {products.slice(0, 5).map((product, index) => {
            const heightPercentage = ((product.views_count || 0) / maxViews) * 100;
            // Ensure at least some height for visibility
            const heightStyle = { height: `${Math.max(heightPercentage, 10)}%` };
            
            return (
            <div key={product.id || index} className="text-center flex flex-col items-center justify-end h-full w-1/5">
                <div className="bg-orange-100 rounded-t-lg w-8 mx-auto relative group" style={heightStyle}>
                    <div className="bg-orange-400 h-1 rounded-t-lg w-full absolute top-0"></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded transition-opacity">
                        {product.views_count}
                    </div>
                </div>
                <p className="text-xs mt-2 text-gray-600 truncate w-full px-1">{product.name}</p>
            </div>
            );
        })}
      </div>
    </div>
  );
};

export default TopViewProducts;
