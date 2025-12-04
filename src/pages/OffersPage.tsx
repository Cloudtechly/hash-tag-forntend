import React from 'react'
import { IoNotificationsOutline, IoMenu } from 'react-icons/io5'
import { FaHashtag } from 'react-icons/fa'
import DealsCarousel from '../components/offers/DealsCarousel'
import SaleItemsGrid from '../components/offers/SaleItemsGrid'
import BottomNav from '../components/home/BottomNav'

const OffersHeader = () => (
  <header className="bg-[#E46A4B] px-4 py-3 text-white">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <button className="text-2xl">
        <IoNotificationsOutline />
      </button>
      <div className="flex items-center gap-2">
        <FaHashtag className="text-3xl" />
        <span className="text-2xl font-bold tracking-tighter">HASHTAG</span>
      </div>
      <button className="text-3xl">
        <IoMenu />
      </button>
    </div>
  </header>
)

export default function OffersPage() {
  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="bg-[#E46A4B]">
        <OffersHeader />
        <DealsCarousel />
      </div>
      <div className="bg-white">
        <SaleItemsGrid />
      </div>
      <BottomNav />
    </div>
  )
}
