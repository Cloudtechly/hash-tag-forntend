import React, { useEffect, useState } from 'react';
import AuctionHeader from '../../components/auction/AuctionHeader';
import fetchData from '../../Api/FetchApi';

const AuctionInfoPage = ({ onNext }: { onNext: () => void }) => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetchData<any>('customer/system-settings?filter[key]=auction_terms_and_condition', 'GET');
        setTerms(res.value || res.data[0].value || '');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch terms');
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AuctionHeader />
      <main className="p-6">
        <h2 className="text-lg font-bold mb-2">Hi Ahmed</h2>
        <p className="text-sm text-gray-600 mb-4">
          Before you can start Bidding, please read and accept our Terms & Conditions
        </p>
        <h3 className="text-xl font-bold mb-2">Terms and Conditions</h3>
        <p className="text-xs text-gray-400 mb-4">Last updated 17 Aug, 2023</p>
        <div className="text-sm text-gray-700 space-y-3 h-96 overflow-y-auto pr-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: terms }} />
          )}
        </div>
        <button onClick={onNext} className="w-full bg-[#E46A4B] text-white font-bold py-4 rounded-xl mt-6">
          Accept
        </button>
      </main>
    </div>
  );
};

export default AuctionInfoPage;
