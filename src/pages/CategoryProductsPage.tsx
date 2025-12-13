import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import fetchData from '../Api/FetchApi';

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(`customer/categoryproduct/${categoryId}`);
        setProducts(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-2">
            <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded" />
            <div className="mt-2 font-semibold">{product.name}</div>
            <div className="text-gray-600">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
