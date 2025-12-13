import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AuctionHeader from '../../components/auction/AuctionHeader';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const Step = (
    { number, title, done, onclick }: { number: number; title: string; done: boolean; onclick?: () => void }
) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${done ? 'bg-orange-100 border border-orange-500' : 'bg-gray-100'}`}>
        <div>
            <p className="text-xs text-gray-500">Step {number}</p>
            <p className="font-bold">{title}</p>
        </div>
        <div onClick={onclick} className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${done ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-400 text-gray-400'} cursor-pointer`}>
            {done ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
              </div>
        </div>
)

interface AuctionTermsPageProps {
  onNext: (selected: string) => void;
}

const AuctionTermsPage: React.FC<AuctionTermsPageProps> = ({ onNext }) => {
  const [select, setSelect] = useState<string>('Personal verification');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData('customer/auction-verification');
        setVerificationData(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch verification data');
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, []);

  // You can use verificationData, loading, and error in your UI as needed
  return (
    <div className="min-h-screen bg-white">
      <AuctionHeader />
      <main className="p-6">
        <h2 className="text-xl font-bold mb-2">Submit Documents</h2>
        <p className="text-sm text-gray-600 mb-6">
          Before you can enjoy Bidding in our Auction room we need some documents from you.
        </p>
        <div className="space-y-4">
            <Step number={1} title="Personal verification" done={select === 'Personal verification'} onclick={() => setSelect('Personal verification')} />
            <Step number={2} title="Trading license" done={select === 'Trading license'} onclick={() => setSelect('Trading license')} />
        
        </div>
        <button
          onClick={() => onNext(select)}
          className="w-full bg-[#E46A4B] text-white font-bold py-4 rounded-xl mt-8"
        >
          Continue
        </button>
      </main>
    </div>
  );
};

export default AuctionTermsPage;
