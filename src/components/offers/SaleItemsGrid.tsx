import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';

export default function SaleItemsGrid() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetchData('customer/discount-offers');
        setItems(res.data || res);
      } catch (err) {
        setError('Failed to load offers');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <div className="px-4 mt-8">Loading...</div>;
  if (error) return <div className="px-4 mt-8 text-red-500">{error}</div>;

  return (
    <div className="px-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Items on sale</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2 w-full px-2">
              <span className="bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {item.discount_percent ? `${item.discount_percent}% off` : ''}
              </span>
              <span className="bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {item.price ? `LYD ${item.price}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
