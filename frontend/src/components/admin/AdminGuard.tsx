'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { accessToken, user, setAuth, setAccessToken, clearAuth } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)
  const isLoginRoute = useMemo(() => pathname === '/admin/login', [pathname])

  useEffect(() => {
    if (accessToken && user) {
      setHydrated(true)
      return
    }

    const storedAuth = typeof window !== 'undefined'
      ? localStorage.getItem('doit-auth')
      : null

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth)
        const storedUser = parsed?.state?.user ?? null
        const storedToken = parsed?.state?.accessToken ?? null
        if (storedToken && storedUser) {
          setAuth({ accessToken: storedToken, user: storedUser })
          setHydrated(true)
          return
        }
      } catch {
        // Ignore malformed persisted auth
      }
    }

    const storedToken = typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null

    if (storedToken) {
      setAccessToken(storedToken)
    }

    setHydrated(true)
  }, [accessToken, user, setAuth, setAccessToken])

  useEffect(() => {
    if (!hydrated) return

    if (!accessToken) {
      if (!isLoginRoute) {
        router.replace('/admin/login')
      }
      return
    }

    if (user && user.role !== 'admin') {
      clearAuth()
      router.replace('/admin/login')
      return
    }

    if (user?.role === 'admin' && isLoginRoute) {
      router.replace('/admin/dashboard')
    }
  }, [hydrated, accessToken, user, clearAuth, router, isLoginRoute])

  if (!hydrated) {
    return null
  }

  if (!accessToken && !isLoginRoute) {
    return null
  }

  if (accessToken && user?.role === 'admin' && isLoginRoute) {
    return null
  }

  if (accessToken && user && user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
