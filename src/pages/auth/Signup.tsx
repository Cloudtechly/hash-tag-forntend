import React from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'

export default function Signup() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-xl bg-gray-100 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="email"
            placeholder="Email / Phone Number"
            className="w-full rounded-xl bg-gray-100 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-gray-100 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="mt-2 flex justify-end">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
              Already have an account? <span className="text-orange-500">→</span>
            </Link>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          >
            Sign up
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8 flex flex-col items-center">
          <p className="mb-6 text-sm text-gray-500">Or sign up with social account</p>
          <div className="flex gap-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50">
              <FcGoogle size={24} />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 text-[#1877F2]">
              <FaFacebookF size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
