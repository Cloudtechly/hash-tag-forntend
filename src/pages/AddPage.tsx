import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import Header from '../components/home/Header';

const SelectInput = ({ label }: { label: string }) => (
  <div className="relative">
    <select className="w-full appearance-none rounded-xl bg-pink-50 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400">
      <option>{label}</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center px-4 text-gray-500">
      <IoChevronUp />
      <IoChevronDown className="-mt-1" />
    </div>
  </div>
);

export default function AddPage() {
  const [listingType, setListingType] = useState('regular');

  return (
    <div className="bg-white min-h-screen">
      <Header onMenuClick={() => {}} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <IoClose className="text-3xl text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">List an item</h1>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        <div className="flex bg-pink-50 rounded-full p-1 mb-6">
          <button
            onClick={() => setListingType('regular')}
            className={`w-1/2 py-2 rounded-full text-center font-semibold ${
              listingType === 'regular' ? 'bg-orange-500 text-white shadow' : 'text-gray-500'
            }`}
          >
            Regular Product
          </button>
          <button
            onClick={() => setListingType('auction')}
            className={`w-1/2 py-2 rounded-full text-center font-semibold ${
              listingType === 'auction' ? 'bg-orange-500 text-white shadow' : 'text-gray-500'
            }`}
          >
            Auction Listing
          </button>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-xl bg-pink-50 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          />
          <SelectInput label="Category" />
          <textarea
            placeholder="Description"
            rows={5}
            className="w-full rounded-xl bg-pink-50 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>

          {listingType === 'regular' ? (
            <input
              type="text"
              placeholder="Price"
              className="w-full rounded-xl bg-pink-50 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Initial Bid"
                className="w-full rounded-xl bg-pink-50 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
              />
              <SelectInput label="Starting Date" />
            </>
          )}

          <SelectInput label="Condition" />

          <div>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Photos</h2>
            <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 flex flex-col items-center text-center">
              <p className="font-bold text-gray-800">Add photos</p>
              <p className="text-sm text-gray-500 mb-4">Add up to 10 photos</p>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg"
              >
                Add photos
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          >
            Explore more
          </button>
        </form>
      </div>
    </div>
  );
}
