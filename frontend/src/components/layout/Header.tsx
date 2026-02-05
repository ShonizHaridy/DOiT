'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { SearchNormal1, Heart, ShoppingCart, User, ArrowDown2, HamburgerMenu } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import MobileMenu from './MobileMenu'
import Logo from '../ui/Logo'
import { Category } from '@/types/category'

interface HeaderProps {
  locale: string,
  categories: Category[]
}

// Data structure to match the design image
const megaMenuData = {
  men: [
    {
      title: 'FOOTWEAR',
      links: ['RUNNING', 'TRAINING', 'LIFESTYLE', 'SLIDES & FLIP FLOPS', 'FOOTBALL', 'BASKETBALL', 'INDOOR'],
    },
    {
      title: 'ACCESSORIES',
      links: ['BAGS', 'BOTTLES', 'SOCKS', 'HEAD WEAR'],
    },
    {
      title: 'CLOTHING',
      links: ['JACKETS', 'PANTS', 'SWIMWEAR', 'T.SHIRTS', 'TIGHTS', 'TRACKSUIT', 'TRACKTOP', 'SHORTS', 'HOODIE'],
    },
    {
      title: 'BRANDS',
      links: ['ADIDAS', 'NIKE', 'REEBOK', 'PUMA', 'BODY SCULPTURE', 'WILSON', 'JAN SPORT', 'LIVEUP', 'BABOLAT', 'TECHNOFIBRE', 'ASICS'],
    },
    {
      title: 'SPORTS',
      links: ['FOOTBALL', 'BASKETBALL', 'TENNIS', 'RUNNING', 'TRAINING', 'SQUASH', 'PADLE', 'SWIMMING', 'FITNESS', 'MOTOR SPORT'],
    },
  ],
  // You can replicate this structure for women, kids, etc.
}

const navItems = [
  { key: 'men', href: '/men' },
  { key: 'women', href: '/women' },
  { key: 'kids', href: '/kids' },
  { key: 'accessories', href: '/accessories' },
  { key: 'sport', href: '/sport' },
]

export default function Header({ locale, categories }: HeaderProps) {
  const t = useTranslations('header')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (key: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpenDropdown(key)
  }

  const handleMouseLeave = () => {
    // Delay closing to allow mouse to move to mega menu
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const handleMegaMenuEnter = () => {
    // Clear the close timeout when entering mega menu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleMegaMenuLeave = () => {
    setOpenDropdown(null)
  }

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 inset-x-0 z-[1000] bg-graphite transition-shadow duration-200',
          isScrolled && 'shadow-lg'
        )}
      >
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2"
              aria-label={t('openMenu')}
            >
              <HamburgerMenu size={24} color="#fff" />
            </button>
            <Logo size="md" href="/" />
            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10">
              <ShoppingCart size={24} color="#FFFFFF" variant="Outline" />
              <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 bg-secondary border-2 border-primary text-white text-[8px] font-normal rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex px-6 lg:px-5 lg:py-4 items-center justify-between">
          <div className="flex items-center justify-between max-w-[1440px] mx-auto gap-31">
            {/* Logo & Left Navigation */}
            <div className="flex items-center gap-15 py-3">
              <Logo size="lg" href="/" />
              <nav className="flex items-center gap-6 lg:gap-6 py-3">
                {navItems.map((item) => (
                  <div 
                    key={item.key}
                    onMouseEnter={() => handleMouseEnter(item.key)}
                    onMouseLeave={handleMouseLeave}
                    className="h-full flex items-center"
                  >
                    <button
                      className={cn(
                        "relative flex items-center gap-1 text-white font-outfit font-bold text-xl hover:text-secondary transition-colors py-2",
                        openDropdown === item.key && "text-secondary"
                      )}
                    >
                      <span>{t(`nav.${item.key}`)}</span>
                      <ArrowDown2 size={16} color="currentColor" className={cn("transition-transform", openDropdown === item.key && "rotate-180")} />
                      
                      {/* Active underline indicator from design */}
                      {openDropdown === item.key && (
                        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary" />
                      )}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-6 px-6 py-5">
              <div className="flex items-center px-3 py-2 bg-transparent border border-neutral-600 rounded-md">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 bg-transparent text-sm text-white font-outfit placeholder:text-white/30 outline-none"
                />
                <SearchNormal1 size={20} color="#FFFFFF" />
              </div>

              <div className="flex items-center gap-4">
                <Link href="/account" className="flex items-center justify-center">
                  <User size={24} color="#FFFFFF" />
                </Link>
                <Link href="/wishlist" className="relative flex items-center justify-center">
                  <Heart size={24} color="#fff" variant="Outline" />
                  <span className="absolute -top-1 -end-1 min-w-[16px] h-[16px] px-0.5 bg-[#00A3FF] text-white text-[8px] font-normal rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link href="/cart" className="relative flex items-center justify-center">
                  <ShoppingCart size={24} color="#FFFFFF" variant="Outline" />
                  <span className="absolute -top-1 -end-1 min-w-[16px] h-[16px] px-0.5 bg-secondary text-white text-[8px] font-normal rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
                <button
                  onClick={handleLanguageSwitch}
                  disabled={isPending}
                  className="flex items-center gap-1 disabled:opacity-50"
                >
                  {locale === 'en' ? (
                    <Image src="/flags/en.svg" alt="English" width={24} height={24} className="rounded-full" />
                  ) : (
                    <Image src="/flags/ar.svg" alt="Arabic" width={24} height={24} className="rounded-full" />
                  )}
                  <span className="text-white text-xs font-medium">
                    {isPending ? '...' : locale.toUpperCase()}
                  </span>
                  <ArrowDown2 size={14} color="#FFFFFF" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <div 
          className={cn(
            "absolute top-full inset-x-0 bg-white shadow-2xl transition-all duration-300 ease-in-out z-(--z-dropdown) overflow-hidden",
            openDropdown ? "max-h-[800px] opacity-100 border-t border-neutral-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="max-w-[1440px] mx-auto px-10 py-12">
            <div className="grid grid-cols-5 gap-8">
              {openDropdown && megaMenuData[openDropdown as keyof typeof megaMenuData]?.map((section) => (
                <div key={section.title} className="flex flex-col gap-6">
                  <h3 className="font-outfit font-bold text-lg text-black tracking-tight">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link 
                          href="#" 
                          className="font-outfit text-sm text-[#424242] hover:text-secondary transition-colors block"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* <div className="h-20" /> */} {/* WE USED STICKY INSTEAD, IT IS THE MODERN CLASS INSTEAD OF FIXED */}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
      />
    </>
  )
}