import React from 'react'

const items = [
  {
    name: 'Leather Wallet',
    price: 'LYD 300',
    discount: '55% off',
    image: 'https://images.unsplash.com/photo-1615395884848-a8554b25f663?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Artisan Soap Set',
    price: 'LYD 300',
    discount: '55% off',
    image: 'https://images.unsplash.com/photo-1542062700-9b613e5a7d27?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Leather Wallet',
    price: 'LYD 300',
    discount: '55% off',
    image: 'https://images.unsplash.com/photo-1615395884848-a8554b25f663?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Artisan Soap Set',
    price: 'LYD 300',
    discount: '55% off',
    image: 'https://images.unsplash.com/photo-1542062700-9b613e5a7d27?q=80&w=800&auto=format&fit=crop',
  },
]

export default function SaleItemsGrid() {
  return (
    <div className="px-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Items on sale</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2 w-full px-2">
              <span className="bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {item.discount}
              </span>
              <span className="bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
