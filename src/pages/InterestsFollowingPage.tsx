import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const mockFollowing = [
  { id: 1, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { id: 3, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { id: 4, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
  { id: 5, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 6, name: 'Liam Carter', joined: '2021', avatar: 'https://randomuser.me/api/portraits/men/37.jpg' },
];

const mockInterests = [
  'Retail', 'Clothes', 'Watches', 'Electronics', 'Gaming', 'Cars', 'Furniture', 'Gifts'
];

const InterestsFollowingPage = () => {
  const [tab, setTab] = useState<'following' | 'interests'>('following');

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center p-4 border-b">
        <button onClick={() => window.history.back()} className="mr-4">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">
            Interests & Following
        </h1>
      </header>
      <main className="max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex border-b mt-2">
          <button
            className={`flex-1 py-2 text-center font-medium ${tab === 'following' ? 'text-[#E46A4B] border-b-2 border-[#E46A4B]' : 'text-gray-400'}`}
            onClick={() => setTab('following')}
          >
            Following
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${tab === 'interests' ? 'text-[#E46A4B] border-b-2 border-[#E46A4B]' : 'text-gray-400'}`}
            onClick={() => setTab('interests')}
          >
            Interests
          </button>
        </div>

        {/* Content */}
        {tab === 'following' ? (
          <ul className="divide-y">
            {mockFollowing.map((user) => (
              <li key={user.id} className="flex items-center gap-4 p-4">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">Joined {user.joined}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-2 p-4">
            {Array(3).fill(0).map((_, i) => (
              mockInterests.map((interest, j) => (
                <span
                  key={i + '-' + j}
                  className="bg-[#E46A4B]/10 text-[#E46A4B] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <span className="opacity-60">×</span> {interest}
                </span>
              ))
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterestsFollowingPage;
