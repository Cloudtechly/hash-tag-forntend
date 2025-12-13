import React from 'react'
import { IoNotificationsOutline, IoMenu } from 'react-icons/io5'
import { FaHashtag } from 'react-icons/fa'
import { useTranslation } from 'react-i18next';
import '../../config/i18n';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();
  return (
    <header className="bg-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button className="text-2xl text-gray-600">
          <IoNotificationsOutline />
        </button>
        <div className="flex items-center gap-2">
          <FaHashtag className="text-3xl text-[#E46A4B]" />
          <span className="text-2xl font-bold text-gray-800 tracking-tighter">{t('sidebar_hashtag', 'HASHTAG')}</span>
        </div>
        <button onClick={onMenuClick} className="text-3xl text-gray-600">
          <IoMenu />
        </button>
      </div>
    </header>
  )
}

export default Header;
