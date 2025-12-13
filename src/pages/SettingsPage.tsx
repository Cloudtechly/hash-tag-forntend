import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiShield, 
  FiBell, 
  FiStar, 
  FiCreditCard, 
  FiSmartphone, 
  FiGlobe, 
  FiTrash2, 
  FiLogOut, 
  FiChevronRight, 
  FiChevronDown,
  FiMoreHorizontal
} from 'react-icons/fi';
import fetchData from '../Api/FetchApi';
import LanguageSelect from '../components/LanguageSelect';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('profile');
  const [selectedLang, setSelectedLang] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchData('customer/auth/me');
        setUser(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  const MenuItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    isDestructive = false,
    hasArrow = true 
  }: { 
    icon: any, 
    label: string, 
    onClick?: () => void, 
    isDestructive?: boolean,
    hasArrow?: boolean
  }) => (
    <button 
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm mb-3"
    >
      <div className="flex items-center gap-4">
        <Icon size={24} className={isDestructive ? "text-red-500" : "text-gray-800"} />
        <span className={`text-lg font-medium ${isDestructive ? "text-red-500" : "text-gray-800"}`}>
          {label}
        </span>
      </div>
      {hasArrow && <FiChevronRight size={24} className="text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-8">Settings</h1>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {/* Profile Details Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-3 overflow-hidden">
          <button 
            onClick={() => toggleSection('profile')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <FiUser size={24} className="text-gray-800" />
              <span className="text-lg font-medium text-gray-800">Profile Details</span>
            </div>
            {expandedSection === 'profile' ? (
              <FiChevronDown size={24} className="text-gray-400" />
            ) : (
              <FiChevronRight size={24} className="text-gray-400" />
            )}
          </button>

          {expandedSection === 'profile' && (
            <div className="px-4 pb-6 pt-2">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ) : user ? (
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="relative">
                      <img 
                        src={user.avatar_url || user.image_url || `https://i.pravatar.cc/150?u=${user.id}`} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <button className="text-xs text-gray-500 font-medium">
                      Change image
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{user.name || user.full_name}</h3>
                      <FiMoreHorizontal className="text-gray-400" />
                    </div>
                    
                    <div className="flex items-center justify-between text-gray-600">
                      <span>@{user.username || user.name?.toLowerCase().replace(/\s/g, '') || 'username'}</span>
                      <FiMoreHorizontal className="text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>{user.phone || user.mobile || '+218 -- --- -- --'}</span>
                      <FiMoreHorizontal className="text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>{user.email || 'email@example.com'}</span>
                      <FiMoreHorizontal className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Failed to load profile</div>
              )}
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        <MenuItem icon={FiShield} label="Security" onClick={() => {}} />
        <MenuItem icon={FiBell} label="Notification" onClick={() => {}} />
        <MenuItem icon={FiStar} label="Interests and following list" onClick={() => navigate('/interests-following')} />
        <MenuItem icon={FiCreditCard} label="Payment methods" onClick={() => navigate('/wallet')} />
        <MenuItem icon={FiSmartphone} label="Manage membership" onClick={() => navigate('/membership')} />
        <div className="mb-3">
          <MenuItem icon={FiGlobe} label="Language" hasArrow={false} onClick={() => {}} />
          <div className="pl-12 pr-2">
            <LanguageSelect value={selectedLang} onChange={setSelectedLang} />
          </div>
        </div>
        
        <div className="mt-8">
          <MenuItem 
            icon={FiTrash2} 
            label="Deactivate account" 
            onClick={() => {}} 
            isDestructive 
          />
          <MenuItem 
            icon={FiLogOut} 
            label="Logout" 
            onClick={handleLogout} 
            isDestructive 
          />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
