

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchData from '../Api/FetchApi';
import { useTranslation } from 'react-i18next';
import '../config/i18n';


const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center justify-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ))}
  </div>
);



interface CustomerProfile {
  name: string;
  joined: string;
  sales: number;
  rating: number;
  products: number;
  coverImage: string;
  avatar: string | null;
  items: { name: string; image: string; price: string }[];
}

const CustomerPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchProfile = async () => {
      try {
        const res = await fetchData(`customer/${id}/profile`);
        const d = res.data || res;
        // Map API response to UI fields
        setCustomer({
          name: d.name,
          joined: d.created_at ? new Date(d.created_at).getFullYear().toString() : '',
          sales: d.approved_products_count ?? 0,
          rating: 5, // Placeholder, adjust if rating is available
          products: d.approved_products_count ?? 0,
          coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          avatar: d.avatar || `https://i.pravatar.cc/150?u=${d.id}`,
          items: (d.top_view_products || []).map((p: any) => ({
            name: p.title,
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            price: '',
          })),
        });
      } catch (err) {
        setError('Failed to load customer profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="text-center py-10">{t('loading', 'Loading...')}</div>;
  if (error) return <div className="text-center text-red-500 py-10">{t('customer_error', error)}</div>;
  if (!customer) return null;

  const c = customer;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button className="text-2xl">←</button>
        <div className="flex gap-4">
          <button className="text-2xl">&#x21bb;</button>
          <button className="text-2xl">&#9825;</button>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-2 mb-2">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-2 overflow-hidden">
          <img src={c.avatar || `https://i.pravatar.cc/150?u=${c.name}`}
            alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-lg font-semibold">{c.name}</div>
  <div className="text-sm text-rose-400">{t('customer_joined', { year: c.joined, defaultValue: 'Joined {{year}}' })}</div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center border rounded-xl mx-4 py-3 px-2 mb-4">
        <div className="flex flex-col items-center flex-1">
          <div className="font-semibold">{c.sales}</div>
          <div className="text-xs text-gray-500">{t('customer_sales', 'Sales')}</div>
        </div>
        <div className="flex flex-col items-center flex-1 border-l border-r">
          <StarRating rating={c.rating} />
          <div className="text-xs text-gray-500">{t('customer_rating', 'Rating')}</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="font-semibold">{c.products}</div>
          <div className="text-xs text-gray-500">{t('customer_products', 'Products')}</div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="mx-4 mb-4 rounded-xl overflow-hidden">
        <img src={c.coverImage} alt="cover" className="w-full h-40 object-cover" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {c.items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-base font-medium text-gray-800 text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerPage;
