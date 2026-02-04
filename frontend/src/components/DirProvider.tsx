'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

export default function DirProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = locale
  }, [locale])

  return <>{children}</>
}