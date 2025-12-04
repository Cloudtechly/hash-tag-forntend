import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AuctionHeader from '../../components/auction/AuctionHeader';

const AuctionAllSetPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <AuctionHeader />
      <main className="p-6 flex flex-col items-center justify-center text-center flex-grow pt-20">
        <div className="w-32 h-32 rounded-full border-4 border-orange-500 flex items-center justify-center mb-6">
          <FiCheck className="text-orange-500" size={80} />
        </div>
        <h2 className="text-3xl font-bold mb-2">All set</h2>
        <p className="text-gray-600 mb-8">
          You can enjoy all the auctions offers now
        </p>
        <button
          onClick={() => navigate('/')} // Navigate to home or a dedicated auctions page
          className="w-full max-w-xs bg-[#E46A4B] text-white font-bold py-4 rounded-xl"
        >
          Go to Auctions
        </button>
      </main>
    </div>
  );
};

export default AuctionAllSetPage;
