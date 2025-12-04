import React from 'react'
import { FiX } from 'react-icons/fi'
import { IoSearchOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export default function SearchBar() {
  return (
    <div className="px-4 mt-4">
      <Link to="/search" className="relative block max-w-7xl mx-auto">
        <div
          className="w-full bg-white rounded-xl px-12 py-4 text-gray-700 placeholder-gray-400 outline-none"
        >
          Search
        </div>
        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
       
      </Link>
    </div>
  )
}
