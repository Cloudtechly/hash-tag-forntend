import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoHomeOutline, IoPricetagOutline, IoAdd, IoPersonOutline } from 'react-icons/io5'
import { MdOutlineInterests } from 'react-icons/md'

const navItems = [
  { to: '/', icon: <IoHomeOutline />, label: 'Home' },
  { to: '/interests-nav', icon: <MdOutlineInterests />, label: 'Interest' },
  { to: '/add', icon: <IoAdd />, label: 'Add' },
  { to: '/offers', icon: <IoPricetagOutline />, label: 'Offers' },
  { to: '/profile', icon: <IoPersonOutline />, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 max-w-7xl w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex justify-around h-20">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full text-gray-500 ${
                isActive ? 'text-[#E46A4B]' : ''
              }`
            }
          >
            {item.label === 'Add' ? (
              <div className="w-14 h-14 rounded-2xl bg-[#E46A4B] text-white text-4xl flex items-center justify-center -mt-4 shadow-lg">
                {item.icon}
              </div>
            ) : (
              <>
                <div className="text-2xl">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
