import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  status: string;
  is_special: boolean;
  special_starts_at: string | null;
  special_ends_at: string | null;
  category: Category;
  created_at: string;
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return <div>No products to display</div>;
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-4">Products</h2>
      <Swiper spaceBetween={16} slidesPerView={'auto'} className="pl-4">
        {products.map((product) => (
          <SwiperSlide key={product.id} style={{ width: '60%', maxWidth: '250px' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
              <img src={`https://via.placeholder.com/250x150.png?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-orange-500 text-md font-semibold">LYD {product.price}</p>
                <p className="text-gray-600 text-sm">{product.category.name}</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
                }`}>
                    {product.status}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
