import React from 'react';
import { FiBell, FiMenu } from 'react-icons/fi';
import { FaHashtag } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Mock Data
const liveAuctions = [
  {
    id: 1,
    name: 'Modern Sofa',
    startingPrice: 400,
    currentBid: 650,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    endTime: '3:50 PM',
    progress: 70,
  },
  {
    id: 2,
    name: 'Modern Sofa',
    startingPrice: 400,
    currentBid: 650,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    endTime: '3:50 PM',
    progress: 70,
  },
];

const upcomingAuctions = [
  {
    id: 1,
    name: 'Vintage Leather Wallet',
    startingBid: 200,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    startTime: '11:03:29',
  },
  {
    id: 2,
    name: 'Vintage Leather Wallet',
    startingBid: 200,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    startTime: '11:03:29',
  },
  {
    id: 3,
    name: 'Vintage Leather Wallet',
    startingBid: 200,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    startTime: '11:03:29',
  },
  {
    id: 4,
    name: 'Vintage Leather Wallet',
    startingBid: 200,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    startTime: '11:03:29',
  },
];

const AuctionHomePage = () => {
  return (
    <div className="pb-24 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="bg-[#E46A4B] text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <button>
          <FiBell size={24} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
             <FaHashtag className="text-yellow-300 text-2xl" />
             <span className="font-bold text-lg">HASHTAG</span>
          </div>
          <span className="text-xs text-yellow-300 tracking-widest -mt-1">AUCTIONS</span>
        </div>
        <button>
          <FiMenu size={24} />
        </button>
      </header>

      <main className="p-4">
        {/* Live Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Actions</h2>
          <Swiper spaceBetween={16} slidesPerView={1.1} className="w-full">
            {liveAuctions.map((auction) => (
              <SwiperSlide key={auction.id}>
                <div className="bg-[#E46A4B] rounded-2xl overflow-hidden shadow-lg text-white">
                  <div className="relative h-48">
                    <img src={auction.image} alt={auction.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Live Now
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{auction.name}</h3>
                        <p className="text-sm opacity-90">Starting Price {auction.startingPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Current Bid</p>
                        <p className="text-xl font-bold text-yellow-300">{auction.currentBid}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1 opacity-90">
                        <span>Auction Ending time</span>
                        <div className="flex items-center gap-1">
                            <span>⏱</span>
                            <span>{auction.endTime}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div 
                            className="bg-yellow-300 h-2 rounded-full" 
                            style={{ width: `${auction.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Upcoming Auctions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Auctions</h2>
          <div className="grid grid-cols-2 gap-4">
            {upcomingAuctions.map((auction) => (
              <div key={auction.id} className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gray-200 relative">
                    <img src={auction.image} alt={auction.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{auction.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">Starting Bid <span className="font-bold text-gray-900">{auction.startingBid}</span></p>
                  <div className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                    <span>⏱</span>
                    <span>{auction.startTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuctionHomePage;
