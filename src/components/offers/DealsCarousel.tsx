import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import fetchData from '../../Api/FetchApi';

interface Deal {
  id?: string | number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  expDate?: string;
  discount?: string;
}

const DealsCarousel: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData('customer/me/deals-for-you');
        // Try to support both array and object response
        let items = Array.isArray(res) ? res : (res.data || res.results || []);
        setDeals(items);
      } catch (err) {
        setError('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">Deals for you</h2>
      {loading && <div className="text-white px-4">Loading...</div>}
      {error && <div className="text-red-400 px-4">{error}</div>}
      {!loading && !error && deals.length === 0 && (
        <div className="text-gray-300 px-4">No deals available.</div>
      )}
      {!loading && !error && deals.length > 0 && (
        <Swiper spaceBetween={16} slidesPerView={'auto'} className="pl-4">
          {deals.map((deal, index) => (
            <SwiperSlide key={deal.id || index} style={{ width: '60%', maxWidth: '250px' }}>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={deal.image} alt={deal.name} className="w-full h-40 object-cover" />
                {deal.discount && (
                  <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {deal.discount}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                  {deal.expDate && (
                    <div className="absolute -top-3 right-4 bg-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {deal.expDate}
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-white">{deal.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-orange-400 text-md">{deal.price}</p>
                    {deal.originalPrice && (
                      <p className="text-gray-300 text-sm line-through">{deal.originalPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default DealsCarousel;
