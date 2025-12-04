import React, { useEffect, useState } from 'react'
import fetchData from '../../Api/FetchApi'

export default function SpecialOffers() {
  const [offers, setOffers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetchData<any[]>('customer/products/special-offers', 'GET') as any;
        setOffers(res.data as any[])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch special offers')
      }
    }
    fetchOffers()
  }, [])

  return (
    <div className="px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Offers</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <div key={offer.id || index} className="rounded-2xl overflow-hidden">
              <img src={offer.img || offer.image} alt={`Offer ${index}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
