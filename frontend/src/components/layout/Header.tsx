'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { SearchNormal1, Heart, ShoppingCart, User, ArrowDown2, HamburgerMenu } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import MobileMenu from './MobileMenu'
import Logo from '../ui/Logo'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import type { Category } from '@/types/category'

interface HeaderProps {
  locale: string,
  categories: Category[]
}

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

  const handleMouseEnter = (category: Category) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (!category.subCategories || category.subCategories.length === 0) {
      setOpenDropdown(null)
      return
    }
    setOpenDropdown(category.id)
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

  // Get active category for mega menu
  const activeCategory = categories.find(cat => cat.id === openDropdown)
  const activeCategorySlug = activeCategory
    ? getLocalized(activeCategory, 'name', locale as Locale).toLowerCase()
    : ''

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
                {categories.map((category) => {
                  const categoryName = getLocalized(category, 'name', locale as Locale)
                  const categorySlug = categoryName.toLowerCase()
                  const hasSubCategories = (category.subCategories?.length ?? 0) > 0

                  return (
                  <div 
                    key={category.id}
                    onMouseEnter={() => handleMouseEnter(category)}
                    onMouseLeave={handleMouseLeave}
                    className="h-full flex items-center"
                  >
                    <Link
                      href={`/${categorySlug}`}
                      className={cn(
                        "relative flex items-center gap-1 text-white font-outfit font-bold text-xl hover:text-secondary transition-colors py-2",
                        hasSubCategories && openDropdown === category.id && "text-secondary"
                      )}
                    >
                      <span>{categoryName}</span>
                      {hasSubCategories && (
                        <ArrowDown2
                          size={16}
                          color="currentColor"
                          className={cn("transition-transform", openDropdown === category.id && "rotate-180")}
                        />
                      )}
                      
                      {/* Active underline indicator from design */}
                      {hasSubCategories && openDropdown === category.id && (
                        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary" />
                      )}
                    </Link>
                  </div>
                  )
                })}
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
              {activeCategory?.subCategories?.map((subCategory) => {
                const subCategoryName = getLocalized(subCategory, 'name', locale as Locale)
                const subCategorySlug = subCategoryName.toLowerCase()

                return (
                  <div key={subCategory.id} className="flex flex-col gap-6">
                    <h3 className="font-outfit font-bold text-lg text-black tracking-tight">
                      <Link
                        href={`/${activeCategorySlug}?filters=${subCategorySlug}`}
                        className="hover:text-secondary transition-colors"
                      >
                        {subCategoryName.toUpperCase()}
                      </Link>
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {subCategory.productLists?.map((productList) => {
                        const productListName = getLocalized(productList, 'name', locale as Locale)
                        const productListSlug = productListName.toLowerCase()

                        return (
                          <li key={productList.id}>
                            <Link 
                              href={`/${activeCategorySlug}?filters=${subCategorySlug}.${productListSlug}`}
                              className="font-outfit text-sm text-[#424242] hover:text-secondary transition-colors block"
                            >
                              {productListName.toUpperCase()}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* <div className="h-20" /> */} {/* WE USED STICKY INSTEAD, IT IS THE MODERN CLASS INSTEAD OF FIXED */}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        locale={locale}
        categories={categories}
      />
    </>
  )
}
