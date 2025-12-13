import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fetchData from '../Api/FetchApi';

const MyProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchData('customer/my-products');
        setProducts(res.data || res);
      } catch (err) {
        setError('Failed to load your products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Products</h1>
      {products.length === 0 ? (
        <div className="text-gray-500 text-center">You have not listed any products yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col group border border-gray-100"
            >
              <Link to={`/customer/my-products/${product.id}`}
                className="block">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-1 truncate">{product.title}</h2>
                <p className="text-sm text-gray-500 mb-2 truncate">{product.category?.name}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[#E46A4B] font-bold text-lg">LYD {product.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'approved' ? 'bg-green-100 text-green-800' :
                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </div>
              </Link>
              {/* Promote to Special Button */}
              <button
                className={`mt-3 py-2 px-4 rounded-xl font-bold text-sm transition-colors w-full ${product.is_special ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-[#E46A4B] text-white hover:bg-orange-600'}`}
                disabled={product.is_special}
                onClick={async () => {
                  try {
                    await fetchData(`customer/products/${product.id}`, 'PUT', { is_special: '1' }, {
                      headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                      }
                    });
                    // Update UI
                    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_special: true } : p));
                    alert('Product promoted to special!');
                  } catch (err) {
                    alert('Failed to promote product.');
                  }
                }}
              >
                {product.is_special ? 'Special Product' : 'Promote to Special'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
