import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiSend, FiHeart } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import fetchData from '../Api/FetchApi';

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetchData(`customer/products/${id}`);
        setProduct(res.data || res);
        setFavorited((res.data || res).is_favorited || false);
      } catch (err: any) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    try {
      if (favorited) {
        await fetchData(`customer/products/${id}/favorite`, 'DELETE');
        setFavorited(false);
      } else {
        await fetchData(`customer/products/${id}/favorite`, 'POST');
        setFavorited(true);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleShare = async () => {
    if (!id) return;
    try {
      await fetchData(`customer/products/${id}/share`, 'POST');
      setShareSuccess(true);
      // Copy product URL to clipboard
      const url = window.location.origin + `/products/${id}`;
      let copied = false;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch (err) {
          copied = false;
        }
      }
      if (!copied) {
        // Fallback for browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          copied = document.execCommand('copy');
        } catch (err) {
          copied = false;
        }
        document.body.removeChild(textArea);
      }
      if (!copied) {
        setCopyError(true);
        setTimeout(() => setCopyError(false), 2000);
      }
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const phoneNumber = product?.customer?.phone_number || '0917667647';
  const maskedNumber = phoneNumber.replace(/(\d{2})\d{6}(\d{1})/, '$1******$2');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white sticky top-0 z-10 border-b">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{product.name || 'Product'}</h1>
        <button onClick={handleShare}>
          <FiSend size={24} />
        </button>
      </header>

      <main className="p-4 pb-28">
        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {product.category && (
            <span className="bg-[#E46A4B] text-white text-sm font-medium px-4 py-1.5 rounded-full">
              {product.category.name}
            </span>
          )}
          {product.condition && (
            <span className="bg-[#F4D03F] text-black text-sm font-medium px-4 py-1.5 rounded-full">
              {product.condition}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{product.title}</h2>

        {/* Image Gallery */}
        {product.images && product.images.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden">
              {product.images.map((img: any, idx: number) => (
                <div key={img.id || idx} className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                  <img
                    src={img.url || `https://via.placeholder.com/400x300?text=Image+${idx+1}`}
                    alt={`Product image ${idx+1}`}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                  {/* Optionally, add a badge for main image */}
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#E46A4B] text-white text-xs font-bold px-2 py-0.5 rounded shadow">Main</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white mb-6 flex justify-center">
            <img
              src={'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.title}
              className="w-full h-auto max-h-[400px] object-contain"
            />
          </div>
        )}

        {/* Price & Short Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Price</h3>
          <p className="text-3xl font-bold text-[#E46A4B] mb-4">{product.price ? `LYD ${product.price}` : '-'}</p>
          <p className="text-gray-600 leading-relaxed">{product.short_description || product.description}</p>
        </div>

        {/* Seller Info */}
        {product.seller && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center gap-4">
              <img
                src={product.seller.avatar || 'https://i.pravatar.cc/150?u=seller'}
                alt={product.seller.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-100"
              />
              <div>
                <p className="font-bold text-gray-900 text-lg">{product.seller.name}</p>
                {product.seller.joined && <p className="text-sm text-[#E46A4B]">Joined {product.seller.joined}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Customer Info */}
        {product.customer && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
            <Link  to={`/customer/${product.customer.id}`} className="flex items-center gap-4">
              <img
                src={product.customer.avatar || 'https://i.pravatar.cc/150?u=customer'}
                alt={product.customer.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-100"
              />
              <div>
                <p className="font-bold text-gray-900 text-lg">{product.customer.name}</p>
                {product.customer.email && <p className="text-sm text-gray-500">{product.customer.email}</p>}
                {product.customer.phone_number && <p className="text-sm text-gray-500">{product.customer.phone_number}</p>}
              </div>
            </Link>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec: any) => (
                <div key={spec.id} className="flex flex-col pb-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 capitalize mb-1">{spec.specification_key?.name}</span>
                  <span className="font-medium text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-between items-center gap-4">
        <button
          className={`bg-pink-50 text-orange-600 font-bold py-4 w-full rounded-xl ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!token}
          onClick={() => {
            if (token) window.open(`tel:${phoneNumber}`);
          }}
        >
          {token ? `Call ${phoneNumber}` : maskedNumber}
        </button>
        <button
          className={`bg-orange-500 text-white p-4 rounded-xl ${favorited ? 'opacity-50' : ''}`}
          onClick={handleFavorite}
        >
          <FiHeart size={24} fill={favorited ? '#fff' : 'none'} />
        </button>
      </footer>

      {shareSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-xl shadow-lg z-50">
          Product shared successfully!
        </div>
      )}
      {copyError && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-xl shadow-lg z-50">
          Could not copy link. Please copy manually.
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
