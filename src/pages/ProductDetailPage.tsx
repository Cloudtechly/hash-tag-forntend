import React from 'react';
import { FiArrowLeft, FiSend, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white sticky top-0 z-10 border-b">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Product Name</h1>
        <button>
          <FiSend size={24} />
        </button>
      </header>

      <main className="p-4 pb-28">
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <span className="bg-orange-200 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">
            Clothes
          </span>
          <span className="bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
            Fairly New
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4">Vintage Leather Jacket</h2>

        {/* Image */}
        <div className="bg-orange-50 rounded-2xl p-4 mb-6">
          <img
            src="https://img.freepik.com/free-photo/brown-leather-jacket_1203-8153.jpg?w=740&t=st=1686321453~exp=1686322053~hmac=a9e7b9a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5"
            alt="Vintage Leather Jacket"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>

        {/* Price & Short Description */}
        <div className="mb-6">
          <h3 className="text-xl font-bold">Price</h3>
          <p className="text-4xl font-bold text-orange-500 mb-2">LYD 150</p>
          <p className="text-gray-600">
            This vintage leather jacket is in excellent condition, with minimal wear and tear. It's a classic piece that adds a touch of rugged style to any outfit.
          </p>
        </div>

        {/* Seller Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Seller Information</h3>
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?u=liamcarter"
              alt="Liam Carter"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-bold">Liam Carter</p>
              <p className="text-sm text-red-400">Joined 2021</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-bold mb-2">Description</h3>
          <p className="text-gray-600">
            This jacket is made from genuine leather and features a classic design with a front zipper and multiple pockets. It's perfect for everyday wear or special occasions.
          </p>
        </div>
      </main>

      {/* Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-between items-center gap-4">
        <button className="bg-pink-50 text-orange-600 font-bold py-4 w-full rounded-xl">
          Make Offer
        </button>
        <button className="bg-orange-500 text-white p-4 rounded-xl">
          <FiHeart size={24} />
        </button>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
