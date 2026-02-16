'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'
import USFlagIcon from '@/components/ui/USFlagIcon'
import SaudiFlagIcon from '@/components/ui/SaudiFlagIcon'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import type { Category } from '@/types/category'
import { useAuthStore, useUIStore, useWishlistStore } from '@/store'
import { useLogout } from '@/hooks/useAuth'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  locale: string
  categories: Category[]
}

export default function MobileMenu({ isOpen, onClose, locale, categories }: MobileMenuProps) {
  const t = useTranslations('header')
  const menuRef = useRef<HTMLDivElement>(null)
  const isRTL = locale === 'ar'

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [openSubCategoryId, setOpenSubCategoryId] = useState<string | null>(null)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const wishlistCount = useWishlistStore((state) => state.getCount())
  const logout = useLogout()
  const isSignedIn = Boolean(accessToken)
  const visibleWishlistCount = isSignedIn ? wishlistCount : 0

  const formatCount = (count: number) => (count > 99 ? '99+' : `${count}`)

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
    onClose()
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector('button, a') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen && accountOpen) {
      setAccountOpen(false)
    }
    if (!isOpen) {
      setActiveCategoryId(null)
      setOpenSubCategoryId(null)
    }
  }, [isOpen, accountOpen])

  const handleAccountToggle = () => {
    if (!isSignedIn) {
      openSignIn()
      onClose()
      return
    }
    setAccountOpen(!accountOpen)
  }

  const handleLogout = () => {
    setAccountOpen(false)
    onClose()
    logout()
  }

  const handleCategoryToggle = (categoryId: string) => {
    setActiveCategoryId((prev) => (prev === categoryId ? null : categoryId))
    setOpenSubCategoryId(null)
  }

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setOpenSubCategoryId((prev) => (prev === subCategoryId ? null : subCategoryId))
  }

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const formQuery = event
      ? String(new FormData(event.currentTarget).get('q') ?? '')
      : ''
    const query = (formQuery || searchQuery).trim()
    if (!query) return
    setSearchQuery(query)
    onClose()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? null
  const activeCategorySlug = activeCategory
    ? getLocalized(activeCategory, 'name', locale as Locale).toLowerCase()
    : ''

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-modal-backdrop transition-opacity duration-base',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className={cn(
          'fixed top-0 bottom-0 w-[375px] max-w-[90%] bg-white z-modal transition-transform duration-slow overflow-y-auto shadow-lg',
          'rounded-r-lg',
          isRTL ? 'right-0' : 'left-0',
          isOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full' 
              : '-translate-x-full'
        )}
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t('menu')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-6">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Logo  />
          </Link>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-50"
            aria-label={t('closeMenu')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 pb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-between h-[45px] px-4 border border-neutral-100 rounded-lg bg-white"
          >
            <input
              name="q"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-base text-neutral-500 placeholder:text-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center text-neutral-500 hover:text-primary transition-colors"
              aria-label={t('search')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-4 px-5 pb-6">
          {activeCategory ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryId(null)
                  setOpenSubCategoryId(null)
                }}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium text-neutral-500 py-2',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn('transition-transform', !isRTL && 'rotate-180')}
                >
                  <path d="M10.1331 6.99328L8.81979 5.67995L6.67979 3.53995C6.22646 3.09328 5.45312 3.41328 5.45312 4.05328V8.20662V11.9466C5.45312 12.5866 6.22646 12.9066 6.67979 12.4533L10.1331 8.99995C10.6865 8.45328 10.6865 7.54662 10.1331 6.99328Z" fill="#1A1A1A"/>
                </svg>
                <span>{t('back')}</span>
              </button>

              <div className="h-px bg-neutral-100" />

              <div className="flex flex-col gap-2 pt-2">
                {(activeCategory.subCategories ?? []).map((subCategory) => {
                  const subCategoryName = getLocalized(subCategory, 'name', locale as Locale)
                  const subCategorySlug = subCategoryName.toLowerCase()
                  const hasProductLists = (subCategory.productLists?.length ?? 0) > 0
                  const isSubOpen = openSubCategoryId === subCategory.id

                  return (
                    <div key={subCategory.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between py-2">
                        <Link
                          href={`/${activeCategorySlug}?filters=${subCategorySlug}`}
                          className="flex-1 text-base font-semibold text-primary uppercase tracking-wide"
                          onClick={onClose}
                        >
                          {subCategoryName}
                        </Link>
                        {hasProductLists && (
                          <button
                            type="button"
                            onClick={() => handleSubCategoryToggle(subCategory.id)}
                            aria-label={`${subCategoryName} product lists`}
                            aria-expanded={isSubOpen}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 text-primary hover:bg-neutral-200 transition-colors shrink-0"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={cn('transition-transform', isSubOpen ? 'rotate-90' : isRTL && 'rotate-180')}
                            >
                              <path d="M10.1331 6.99328L8.81979 5.67995L6.67979 3.53995C6.22646 3.09328 5.45312 3.41328 5.45312 4.05328V8.20662V11.9466C5.45312 12.5866 6.22646 12.9066 6.67979 12.4533L10.1331 8.99995C10.6865 8.45328 10.6865 7.54662 10.1331 6.99328Z" fill="#1A1A1A"/>
                            </svg>
                          </button>
                        )}
                      </div>
                      {hasProductLists && isSubOpen && (
                        <div className={cn('flex flex-col gap-2 pb-2 text-sm text-neutral-600', isRTL ? 'pr-4' : 'pl-4')}>
                          {subCategory.productLists?.map((productList) => {
                            const productListName = getLocalized(productList, 'name', locale as Locale)
                            const productListSlug = productListName.toLowerCase()

                            return (
                              <Link
                                key={productList.id}
                                href={`/${activeCategorySlug}?filters=${subCategorySlug}.${productListSlug}`}
                                className="uppercase tracking-wide hover:text-secondary transition-colors"
                                onClick={onClose}
                              >
                                {productListName}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            categories.map((category) => {
              const categoryName = getLocalized(category, 'name', locale as Locale)
              const categorySlug = categoryName.toLowerCase()
              const hasSubCategories = (category.subCategories?.length ?? 0) > 0

              return (
                <div key={category.id} className="flex items-center justify-between py-2">
                  <Link
                    href={`/${categorySlug}`}
                    className="flex-1 text-base font-medium text-primary uppercase tracking-wide"
                    onClick={onClose}
                  >
                    {categoryName}
                  </Link>
                  {hasSubCategories && (
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(category.id)}
                      aria-label={`${categoryName} subcategories`}
                      aria-expanded={activeCategoryId === category.id}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 text-primary hover:bg-neutral-200 transition-colors shrink-0"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn('transition-transform', isRTL && 'rotate-180')}
                      >
                        <path d="M10.1331 6.99328L8.81979 5.67995L6.67979 3.53995C6.22646 3.09328 5.45312 3.41328 5.45312 4.05328V8.20662V11.9466C5.45312 12.5866 6.22646 12.9066 6.67979 12.4533L10.1331 8.99995C10.6865 8.45328 10.6865 7.54662 10.1331 6.99328Z" fill="#1A1A1A"/>
                      </svg>
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-neutral-100 mx-5" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 px-5 py-6">
          {/* My Account */}
          <button
            onClick={handleAccountToggle}
            className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#888787" strokeWidth="1.66667"/>
                <path d="M17.0001 14H17.3521C18.0831 14.0002 18.789 14.2674 19.337 14.7513C19.885 15.2352 20.2374 15.9026 20.3281 16.628L20.7191 19.752C20.7542 20.0334 20.7291 20.3191 20.6455 20.5901C20.5618 20.8611 20.4214 21.1112 20.2337 21.3238C20.046 21.5364 19.8152 21.7066 19.5566 21.8232C19.2981 21.9398 19.0177 22.0001 18.7341 22H5.26606C4.98244 22.0001 4.70206 21.9398 4.44351 21.8232C4.18496 21.7066 3.95416 21.5364 3.76644 21.3238C3.57871 21.1112 3.43835 20.8611 3.35467 20.5901C3.27098 20.3191 3.24589 20.0334 3.28106 19.752L3.67106 16.628C3.76176 15.9022 4.11448 15.2346 4.66289 14.7506C5.21131 14.2667 5.91764 13.9997 6.64906 14H7.00006" stroke="#888787" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-base font-medium text-primary">
                {t('myAccount')}
              </span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.9465 5.45337H7.79316H4.05317C3.41317 5.45337 3.09317 6.2267 3.5465 6.68004L6.99983 10.1334C7.55317 10.6867 8.45317 10.6867 9.0065 10.1334L10.3198 8.82004L12.4598 6.68004C12.9065 6.2267 12.5865 5.45337 11.9465 5.45337Z" fill="#1A1A1A"/>
            </svg>
          </button>
          {isSignedIn && accountOpen && (
            <div className="ms-7 flex flex-col gap-2 pb-2">
              <div className="text-xs text-neutral-500">
                {user?.fullName ?? user?.email ?? 'Account'}
              </div>
              <Link
                href="/profile"
                className="text-sm text-primary hover:text-secondary transition-colors"
                onClick={onClose}
              >
                {t('myAccount')}
              </Link>
              <Link
                href="/orders"
                className="text-sm text-primary hover:text-secondary transition-colors"
                onClick={onClose}
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 text-left hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex items-center py-3 hover:opacity-80 transition-opacity"
            onClick={onClose}
          >
            <div className="relative mr-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3C4.239 3 2 5.216 2 7.95C2 10.157 2.875 15.395 11.488 20.69C11.6423 20.7839 11.8194 20.8335 12 20.8335C12.1806 20.8335 12.3577 20.7839 12.512 20.69C21.125 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3C14.239 3 12 6 12 6C12 6 9.761 3 7 3Z" stroke="#888787" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {visibleWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[11px] h-[11px] px-1 bg-[#00A3FF] border border-neutral-100 text-white text-[8px] font-normal rounded-full flex items-center justify-center">
                  {formatCount(visibleWishlistCount)}
                </span>
              )}
            </div>
            <span className="text-base font-medium text-primary">
              {t('wishlist')}
            </span>
          </Link>

          {/* Language Selector */}
          <div className="flex items-start">
            <button
              onClick={handleLanguageSwitch}
              disabled={isPending}
              className="flex items-center gap-1 py-1 disabled:opacity-50 hover:opacity-80 transition-opacity"
            >
              {locale === 'en' ? <USFlagIcon /> : <SaudiFlagIcon />}
              <span className="text-xs font-normal text-primary">
                {isPending ? '...' : locale.toUpperCase()}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-20">
                <path d="M11.9465 5.45337H7.79316H4.05317C3.41317 5.45337 3.09317 6.2267 3.5465 6.68004L6.99983 10.1334C7.55317 10.6867 8.45317 10.6867 9.0065 10.1334L10.3198 8.82004L12.4598 6.68004C12.9065 6.2267 12.5865 5.45337 11.9465 5.45337Z" fill="#1A1A1A"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
