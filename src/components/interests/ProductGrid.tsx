import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fetchData from '../../Api/FetchApi'

export default function ProductGrid(
  {products = [], endpoint}: 
  {products?: any[], endpoint: string}
) {
  const navigator = useNavigate();

  return (
    <div className="px-4 mt-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id || product.name}
              onClick={() => navigator(`/product/${product.id || product.name}`)}
              className="cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden mb-2">
                <img src={product.image || product.img} alt={product.name} className="w-full h-48 object-cover" />
              </div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-red-500">LYD {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
