import React from 'react';
import { FaHashtag } from 'react-icons/fa';

const AuctionLoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-400 to-orange-600 text-white">
      <div className="text-yellow-300">
        <FaHashtag size={120} style={{ transform: 'scaleY(0.8) scaleX(1.2)' }}/>
      </div>
      <h1 className="text-6xl font-extrabold tracking-wider mt-4">HASHTAG</h1>
      <p className="text-2xl font-light tracking-widest text-yellow-300">AUCTIONS</p>
    </div>
  );
};

export default AuctionLoadingPage;
