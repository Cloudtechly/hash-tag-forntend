import React from 'react';
import { FiCreditCard, FiSettings } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar: string | null;
    created_at: string;
  } | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  if (!user) return <div className="bg-white p-4 animate-pulse h-64"></div>;
  const navigator = useNavigate();

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/wallet" className="text-gray-600">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 9H7" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M22 10.9702V13.0302C22 13.5802 21.56 14.0302 21 14.0502H19.0399C17.9599 14.0502 16.97 13.2602 16.88 12.1802C16.82 11.5502 17.0599 10.9602 17.4799 10.5502C17.8499 10.1702 18.36 9.9502 18.92 9.9502H21C21.56 9.9702 22 10.4202 22 10.9702Z" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

        </Link>
        <h1 className="text-xl font-bold">Account</h1>
        <button className="text-gray-600" onClick={()=>navigator('/settings')
        }
        >
          <FiSettings size={24} />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full object-cover mb-4"
          src={user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
          alt={user.name}
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-sm text-red-400 mt-1">Joined {new Date(user.created_at).getFullYear()}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
