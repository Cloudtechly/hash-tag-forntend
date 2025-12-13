import React, { useEffect, useState } from 'react';
import { FiSettings, FiCreditCard, FiUsers, FiPhone, FiHelpCircle, FiX } from 'react-icons/fi';
import { FaHashtag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import fetchData from '../../Api/FetchApi';
import { useTranslation } from 'react-i18next';
import '../../config/i18n';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// SidebarUserView fetches and displays the current user's info
const SidebarUserView: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchData('customer/auth/me');
        setUser(res.data || res);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  if (loading) return (
    <div className="flex flex-col items-start mt-8 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
      <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  );
  if (!user) return (
    <div className="flex flex-col items-start mt-8">
      <img className="w-20 h-20 rounded-full object-cover mb-3" src="https://i.pravatar.cc/150?u=default" alt="User" />
      <h2 className="text-2xl font-bold">User</h2>
      <p className="text-lg">---</p>
    </div>
  );
  return (
    <div className="flex flex-col items-start mt-8">
      <img
        className="w-20 h-20 rounded-full object-cover mb-3 border border-white"
        src={user.avatar_url || user.image_url || `https://i.pravatar.cc/150?u=${user.id || 'user'}`}
        alt={user.name || user.full_name || 'User'}
      />
      <h2 className="text-2xl font-bold">{user.name || user.full_name || 'User'}</h2>
      <p className="text-lg">{user.email || user.phone_number || '---'}</p>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#E46A4B] text-white p-6 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white">
          <FiX size={28} />
        </button>

        <SidebarUserView />

        <div className="flex flex-col justify-between h-[calc(100%-12rem)]">
            <nav className="mt-10 space-y-6">
                <Link to="/settings" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiSettings />
                <span>{t('sidebar_settings', 'Settings')}</span>
                </Link>
                <Link to="/wallet" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiCreditCard />
                <span>{t('sidebar_wallet', 'Wallet')}</span>
                </Link>
                <button 
                onClick={() => {
                    navigate('/auction/loading');
                    onClose();
                }}
                />
                <Link to="/auction" onClick={onClose} className="w-full">
                    <button className="w-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg">
                        <FaHashtag className="text-white text-2xl" />
                        <div>
                            <span className="font-extrabold">{t('sidebar_hashtag', 'HASHTAG')}</span>
                            <span className="block text-xs font-normal -mt-1">{t('sidebar_auctions', 'AUCTIONS')}</span>
                        </div>
                    </button>
                </Link>
            </nav>

            <nav className="space-y-6">
                <Link to="/about" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiUsers />
                <span>{t('sidebar_about', 'About us')}</span>
                </Link>
                <Link to="/contact" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiPhone />
                <span>{t('sidebar_contact', 'Contact us')}</span>
                </Link>
                <Link to="/guide" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiHelpCircle />
                <span>{t('sidebar_guide', 'Guide book')}</span>
                </Link>
            </nav>
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
              }}
              className="w-full my-8 bg-white text-[#E46A4B] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg border border-[#E46A4B] hover:bg-orange-50 transition"
            >
              {t('sidebar_logout', 'Logout')}
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
