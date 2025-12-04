import React, { useState, useEffect } from 'react';
import fetchData from '../../Api/FetchApi';
import Header from '../../components/home/Header'
import SearchBar from '../../components/home/SearchBar'
import CategoryIcons from '../../components/home/CategoryIcons'
import ImageCarousel from '../../components/home/ImageCarousel'
import SpecialOffers from '../../components/home/SpecialOffers'
import InterestsProducts from '../../components/home/InterestsProducts'
import BottomNav from '../../components/home/BottomNav'
import Sidebar from '../../components/sidebar/Sidebar';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchData<any>('customer/auth/me');
        setUser(res);
      } catch (err: any) {
        setUserError(err.message || 'Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative max-w-7xl mx-auto min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`flex flex-col min-h-screen pb-24 transition-transform duration-300 ${isSidebarOpen ? 'transform translate-x-20' : ''}`}>
        {/* Show user info at the top */}
      
        <Header onMenuClick={toggleSidebar} />
        <SearchBar />
        <CategoryIcons />
        <ImageCarousel />
        <SpecialOffers />
        <InterestsProducts />
        <BottomNav />
      </div>
    </div>
  )
}
