'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '../ui'
import { Notification, ProfileCircle } from 'iconsax-reactjs'

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-[72px] bg-neutral-900 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/admin/dashboard" className="flex items-center gap-2">
        <Logo size='md' />
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-[400px] mx-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search with product name or SKU"
            className="w-full h-10 pl-4 pr-10 bg-white rounded-lg text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors"
          aria-label="Notifications"
        >
          <Notification size={24} variant='Bold' />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* Profile */}
        <Link
          href="/admin/profile"
          className="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors"
          aria-label="Profile"
        >
          <ProfileCircle size={24} />
        </Link>
      </div>
    </header>
  )
}
