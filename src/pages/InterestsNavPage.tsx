import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/home/Header'
import TabNav from '../components/interests/TabNav'
import ImageCarousel from '../components/home/ImageCarousel'
import ProductGrid from '../components/interests/ProductGrid'
import BottomNav from '../components/home/BottomNav'
import { useNavigate } from 'react-router-dom'
import fetchData from '../Api/FetchApi'
import Sidebar from '../components/sidebar/Sidebar'
import { useTranslation } from 'react-i18next'
import '../config/i18n'

export default function InterestsNavPage() {
  const { t } = useTranslation();
  const tabs = useMemo(() => ([
    { name: t('tabs_whats_new', "What's new"), endpoint: 'customer/products/whats-new' },
    { name: t('tabs_sellers', 'Sellers'), endpoint: 'customer/products/sellers-products' },
    { name: t('tabs_favorites', 'Favorite products'), endpoint: 'customer/favorites' }
  ]), [t]);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  useEffect(() => {
    setSelectedTab(tabs[0]);
  }, [tabs]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchData<any[]>(selectedTab.endpoint, 'GET') as any;
        setProducts(res.data)
      } catch (err: any) {
        setError(err.message || t('fetch_products_error', 'Failed to fetch products'))
      }
    }
    fetchProducts()
  }, [
    selectedTab,
    t
  ])


  return (
    <div className="relative max-w-7xl mx-auto min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`flex flex-col min-h-screen pb-24 transition-transform duration-300 ${isSidebarOpen ? 'transform translate-x-20' : ''}`}>
        {/* Show user info at the top */}
      
        <Header onMenuClick={toggleSidebar} />
      <TabNav 
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <ImageCarousel />
      <ProductGrid 
        products={products}
        endpoint={selectedTab.endpoint}
      />
      <BottomNav />
    </div>
        </div>
  )
}
