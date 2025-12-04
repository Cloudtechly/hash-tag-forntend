import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import fetchData from '../../Api/FetchApi'

interface Ad {
  id: number;
  name: string;
  image_url: string;
  target_url: string | null;
  is_clickable: boolean;
}

interface AdsResponse {
  data: Ad[];
}

export default function ImageCarousel() {
  const [ads, setAds] = useState<Ad[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetchData<AdsResponse>('customer/ads', 'GET');
        if (res && res.data) {
          setAds(res.data)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch ads')
      }
    }
    fetchAds()
  }, [])

  return (
    <div className="px-4 mt-6">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        className="max-w-7xl mx-auto"
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad.id} style={{ width: '85%', maxWidth: '400px' }}>
            {ad.is_clickable && ad.target_url ? (
              <a href={ad.target_url} target="_blank" rel="noopener noreferrer">
                <img 
                  src={ad.image_url} 
                  alt={ad.name} 
                  className="rounded-2xl object-cover h-full w-full" 
                />
              </a>
            ) : (
              <img 
                src={ad.image_url} 
                alt={ad.name} 
                className="rounded-2xl object-cover h-full w-full" 
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
