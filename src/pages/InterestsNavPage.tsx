import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import TabNav from '../components/interests/TabNav'
import ImageCarousel from '../components/home/ImageCarousel'
import ProductGrid from '../components/interests/ProductGrid'
import BottomNav from '../components/home/BottomNav'
import { useNavigate } from 'react-router-dom'
import fetchData from '../Api/FetchApi'

const tabs = [
  { name: "What's new", endpoint: "customer/products/whats-new" },
  { name: "Sellers", endpoint: "customer/products/popular" },
  { name: "Favorite products", endpoint: "customer/favorites" }
]

export default function InterestsNavPage() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const toggleSidebar = () => {
    // Implement sidebar toggle functionality if needed
  };
    const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchData<any[]>(selectedTab.endpoint, 'GET') as any;
        setProducts(res.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products')
      }
    }
    fetchProducts()
  }, [
    selectedTab
  ])


  return (
    <div className=" pb-24 max-w-7xl mx-auto min-h-screen">
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
  )
}
