import React from 'react'

type LayoutProps = {
  title: string
  children: React.ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow space-y-4 min-w-[320px]">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="border-t pt-4 border-gray-200">{children}</div>
      </div>
    </div>
  )
}
