import React from 'react'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

export default function ForgotPassword() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forget password</h1>
        </div>

        <p className="mb-8 text-gray-600 leading-relaxed text-center">
          Please, enter your email address. You will receive a link to create a new password via email.
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email / Phone Number"
            className="w-full rounded-xl bg-gray-100 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
