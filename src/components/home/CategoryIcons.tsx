import React, { useEffect, useState } from 'react'
import {
  IoCarSportOutline,
  IoGameControllerOutline,
  IoWatchOutline,
  IoDesktopOutline,
} from 'react-icons/io5'
import { PiLamp, PiTShirt } from 'react-icons/pi'
import fetchData from '../../Api/FetchApi'

export default function CategoryIcons() {
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchData<any[]>('customer/categories') as any;
        setCategories(res.data as any[])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories')
      }
    }
    fetchCategories()
  }, [])

  // Optionally map category names to icons
  const iconMap: Record<string, React.ReactNode> = {
    Cars: <IoCarSportOutline />,
    Electronics: <IoDesktopOutline />,
    Gaming: <IoGameControllerOutline />,
    Watches: <IoWatchOutline />,
    Furniture: <PiLamp />,
    Shoes: <PiTShirt />,
  }

  return (
    <div className="px-4 mt-6">
      <div className="max-w-7xl mx-auto flex justify-around overflow-x-auto">
        {error && <div className="text-red-500">{error}</div>}
        {categories.map((cat) => (
          <div key={cat.id || cat.name} className="flex flex-col items-center gap-2 mx-2">
            <div className="w-16 h-16 bg-[#E46A4B] rounded-2xl flex items-center justify-center text-white text-3xl">
              {iconMap[cat.name] || <IoCarSportOutline />}
            </div>
            <span className="text-sm text-gray-600">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
