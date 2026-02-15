'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CardEdit, ElementPlus, Profile2User, ShopAdd, ShoppingCart, StatusUp, TicketDiscount } from 'iconsax-reactjs'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badgeKey?: 'orders' | 'customers' | 'offers'
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin/dashboard',
    icon: (
      // <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      //   <path d="M9.02 2.84004L3.63 7.04004C2.73 7.74004 2 9.23004 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29004 21.19 7.74004 20.2 7.05004L14.02 2.72004C12.62 1.74004 10.37 1.79004 9.02 2.84004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      //   <path d="M12 17.99V14.99" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      // </svg>
      <StatusUp size={24} />
    ),
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: (
      <ShopAdd size={24} />
    ),
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: (
      <ElementPlus size={24} />
    ),
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: (
      <ShoppingCart size={24} />
    ),
    badgeKey: 'orders',
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: (
      <Profile2User size={24} variant='Outline' />
    ),
    badgeKey: 'customers',
  },
  {
    label: 'Offers',
    href: '/admin/offers',
    icon: (
      <TicketDiscount size={24} />
    ),
    badgeKey: 'offers',
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: (
      <CardEdit size={24} variant='Outline' />
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { unread } = useAdminNotifications()

  return (
    <aside className="w-55 min-h-screen bg-white border-r border-neutral-200 py-6">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`))
          const badgeValue = item.badgeKey ? unread[item.badgeKey] : 0
          const badgeLabel = badgeValue > 99 ? '99+' : String(badgeValue)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-6 py-3 transition-colors group',
                isActive
                  ? 'bg-neutral-50 border-l-4 border-primary text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'transition-colors',
                  isActive ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-700'
                )}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {badgeValue > 0 && (
                <span className="min-w-5 h-5 px-1.5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                  {badgeLabel}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
