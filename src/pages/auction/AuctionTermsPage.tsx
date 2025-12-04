import React from 'react';
import AuctionHeader from '../../components/auction/AuctionHeader';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const Step = ({ number, title, done }: { number: number, title: string, done: boolean }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${done ? 'bg-orange-100 border border-orange-500' : 'bg-gray-100'}`}>
        <div>
            <p className="text-xs text-gray-500">Step {number}</p>
            <p className="font-bold">{title}</p>
        </div>
        {done ? <FiCheckCircle className="text-orange-500" size={24} /> : <FiCircle className="text-gray-300" size={24} />}
    </div>
)

const AuctionTermsPage = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="min-h-screen bg-white">
      <AuctionHeader />
      <main className="p-6">
        <h2 className="text-xl font-bold mb-2">Submit Documents</h2>
        <p className="text-sm text-gray-600 mb-6">
          Before you can enjoy Bidding in our Auction room we need some documents from you.
        </p>
        <div className="space-y-4">
            <Step number={1} title="Personal verification" done={true} />
            <Step number={2} title="Trading license" done={false} />
            <Step number={3} title="Wallet amount" done={false} />
        </div>
        <button onClick={onNext} className="w-full bg-[#E46A4B] text-white font-bold py-4 rounded-xl mt-8">
          Continue
        </button>
      </main>
    </div>
  );
};

export default AuctionTermsPage;
