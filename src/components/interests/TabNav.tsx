import React, { useState } from 'react'



export default function TabNav({ tabs, selectedTab, onTabChange }: {
  tabs: { name: string, endpoint: string }[],
  selectedTab: { name: string, endpoint: string },
  onTabChange: (tab: { name: string, endpoint: string }) => void
}) {
  return (
    <div className="px-4 mt-4 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab)}
            className={`py-3 text-sm font-medium
              ${
                selectedTab.name === tab.name
                  ? 'text-[#E46A4B] border-b-2 border-[#E46A4B]'
                  : 'text-gray-500'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
