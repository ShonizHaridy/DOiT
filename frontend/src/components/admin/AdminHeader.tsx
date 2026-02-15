'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '../ui'
import { Notification, ProfileCircle } from 'iconsax-reactjs'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'
import { cn } from '@/lib/utils'

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get('search') ?? ''
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationPanelRef = useRef<HTMLDivElement | null>(null)
  const { items, unread, markAllAsRead, markAsRead } = useAdminNotifications()

  const unreadTotal = unread.total

  useEffect(() => {
    if (pathname !== '/admin/products') return
    setSearchQuery(searchFromUrl)
  }, [pathname, searchFromUrl])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!notificationPanelRef.current || notificationPanelRef.current.contains(target)) return
      setNotificationsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notificationItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        createdAtLabel: new Date(item.createdAt).toLocaleString(),
      })),
    [items]
  )

  const handleSearch = (event?: React.FormEvent) => {
    event?.preventDefault()
    const value = searchQuery.trim()
    if (!value) {
      router.push('/admin/products')
      return
    }
    router.push(`/admin/products?search=${encodeURIComponent(value)}`)
  }

  return (
    <header className="h-[72px] bg-neutral-900 flex items-center justify-between px-6">
      {/* Logo */}
      <Link href="/admin/dashboard" className="flex items-center gap-2">
        <Logo size='md' />
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-[400px] mx-8">
        <form className="relative" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search with product name or SKU"
            className="w-full h-10 pl-4 pr-10 bg-white rounded-lg text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationPanelRef}>
          <button
            type="button"
            className="relative w-10 h-10 flex items-center justify-center text-white hover:text-white/50 transition-colors cursor-pointer"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((prev) => !prev)}
          >
            <Notification size={24} variant='Bold' />
            {unreadTotal > 0 && (
              <span className="absolute top-1 right-1 min-w-5 h-5 px-1 rounded-full bg-secondary text-white text-[10px] font-semibold flex items-center justify-center">
                {unreadTotal > 99 ? '99+' : unreadTotal}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-[360px] bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900">Notifications</p>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline cursor-pointer"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[360px] overflow-auto">
                {notificationItems.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-neutral-500">No notifications</p>
                ) : (
                  notificationItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                      onClick={() => {
                        markAsRead(item.createdAt)
                        setNotificationsOpen(false)
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                        <span
                          className={cn(
                            'text-[11px] font-medium px-2 py-0.5 rounded-full',
                            item.type === 'order' && 'bg-blue-100 text-blue-700',
                            item.type === 'customer' && 'bg-emerald-100 text-emerald-700',
                            item.type === 'offer' && 'bg-amber-100 text-amber-700',
                          )}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{item.description}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">{item.createdAtLabel}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          href="/admin/profile"
          className="w-10 h-10 flex items-center justify-center text-white hover:text-white/50 transition-colors"
          aria-label="Profile"
        >
          <ProfileCircle size={24} />
        </Link>
      </div>
    </header>
  )
}
