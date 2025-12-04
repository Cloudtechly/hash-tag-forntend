import React from 'react';
import { FiSettings, FiCreditCard, FiUsers, FiPhone, FiHelpCircle, FiX } from 'react-icons/fi';
import { FaHashtag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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

        <div className="flex flex-col items-start mt-8">
          <img
            className="w-20 h-20 rounded-full object-cover mb-3"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="Ahmed Mohamed"
          />
          <h2 className="text-2xl font-bold">Ahmed Mohamed</h2>
          <p className="text-lg">+218 92 343 45 65</p>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-12rem)]">
            <nav className="mt-10 space-y-6">
                <Link to="/settings" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiSettings />
                <span>Settings</span>
                </Link>
                <Link to="/wallet" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiCreditCard />
                <span>Wallet</span>
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
                            <span className="font-extrabold">HASHTAG</span>
                            <span className="block text-xs font-normal -mt-1">AUCTIONS</span>
                        </div>
                    </button>
                </Link>
            </nav>

            <nav className="space-y-6">
                <Link to="/about" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiUsers />
                <span>About us</span>
                </Link>
                <Link to="/contact" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiPhone />
                <span>Contact us</span>
                </Link>
                <Link to="/guide" onClick={onClose} className="flex items-center gap-4 text-xl">
                <FiHelpCircle />
                <span>Guide book</span>
                </Link>
            </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
