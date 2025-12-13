import React from 'react'
import { IoNotificationsOutline, IoMenu } from 'react-icons/io5'
import { FaHashtag } from 'react-icons/fa'
import DealsCarousel from '../components/offers/DealsCarousel'
import SaleItemsGrid from '../components/offers/SaleItemsGrid'
import BottomNav from '../components/home/BottomNav'
import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/home/Header'
import { useTranslation } from 'react-i18next';
import '../config/i18n';


const OffersHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="bg-[#E46A4B] px-4 py-3 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button className="text-2xl">
          <IoNotificationsOutline />
        </button>
        <div className="flex items-center gap-2">
          <FaHashtag className="text-3xl" />
          <span className="text-2xl font-bold tracking-tighter">{t('sidebar_hashtag', 'HASHTAG')}</span>
        </div>
        <button className="text-3xl">
          <IoMenu />
        </button>
      </div>
    </header>
  )
}

export default function OffersPage() {
  const toggleSidebar = () => {
  setSidebarOpen(!isSidebarOpen);
};
const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  return (

    <div className="relative  pb-24 max-w-7xl mx-auto min-h-screen">
     
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`flex flex-col min-h-screen pb-24 transition-transform duration-300 ${isSidebarOpen ? 'transform translate-x-20' : ''}`}>
        {/* Show user info at the top */}
      <div className="bg-[#E46A4B]">
        <Header onMenuClick={toggleSidebar} />
        <DealsCarousel />
      </div>
      <div className="bg-white">
        <SaleItemsGrid />
      </div>
      <BottomNav />
    </div>
    </div>
   
  )
}
