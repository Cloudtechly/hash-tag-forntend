import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import { Link } from 'react-router-dom';

export default function InterestsProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchData<any[]>(localStorage.getItem('token') ? 'customer/me/suggestions' : 'customer/guest-products') as any;
        setProducts(res.data as any[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Based on your interests</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link to={`/product/${product.id}`} key={product.id || index} className="rounded-2xl overflow-hidden bg-white">
              <img src={product.img || product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="font-medium text-gray-900 text-base mb-1">{product.name}</div>
                <div className="text-[#E46A4B] font-semibold text-sm">LYD {product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
