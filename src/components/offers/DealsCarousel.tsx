import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const deals = [
  {
    name: 'Modern Sofa',
    price: 'LYD 400',
    originalPrice: 'LYD 450',
    image: 'https://images.unsplash.com/photo-1558088458-b65c1b2d0593?q=80&w=800&auto=format&fit=crop',
    expDate: 'Exp. on Aug 17',
    discount: '20% off',
  },
  {
    name: 'Modern Sofa',
    price: 'LYD 400',
    originalPrice: 'LYD 450',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
    expDate: 'Exp. on Aug 18',
    discount: '20% off',
  },
  {
    name: 'Modern Sofa',
    price: 'LYD 400',
    originalPrice: 'LYD 450',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    expDate: 'Exp. on Aug 19',
    discount: '20% off',
  },
]

export default function DealsCarousel() {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">Deals for you</h2>
      <Swiper spaceBetween={16} slidesPerView={'auto'} className="pl-4">
        {deals.map((deal, index) => (
          <SwiperSlide key={index} style={{ width: '60%', maxWidth: '250px' }}>
            <div className="relative rounded-2xl overflow-hidden">
              <img src={deal.image} alt={deal.name} className="w-full h-40 object-cover" />
              <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                {deal.discount}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <div className="absolute -top-3 right-4 bg-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {deal.expDate}
                </div>
                <h3 className="font-bold text-lg text-white">{deal.name}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-orange-400 text-md">{deal.price}</p>
                  <p className="text-gray-300 text-sm line-through">{deal.originalPrice}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
