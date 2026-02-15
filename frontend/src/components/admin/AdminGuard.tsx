'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import type { AuthResponse } from '@/types/auth'

type AuthUser = AuthResponse['user']

const getStoredToken = () => {
  if (typeof window === 'undefined') return null

  const directToken = localStorage.getItem('access_token')
  if (directToken) return directToken

  const persistedAuth = localStorage.getItem('doit-auth')
  if (!persistedAuth) return null

  try {
    const parsed = JSON.parse(persistedAuth)
    const persistedToken = parsed?.state?.accessToken
    return typeof persistedToken === 'string' ? persistedToken : null
  } catch {
    return null
  }
}

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

const buildUserFromToken = (token: string | null): AuthUser | null => {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const role = payload.role === 'admin' || payload.role === 'customer' ? payload.role : null
  const id = typeof payload.sub === 'string' ? payload.sub : null
  const email = typeof payload.email === 'string' ? payload.email : null

  if (!role || !id || !email) return null

  return {
    id,
    email,
    role,
  }
}

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

    const storedToken = getStoredToken()

    if (storedToken) {
      const recoveredUser = buildUserFromToken(storedToken)
      if (recoveredUser) {
        setAuth({ accessToken: storedToken, user: recoveredUser })
      } else {
        setAccessToken(storedToken)
      }
    }

    setHydrated(true)
  }, [accessToken, user, setAuth, setAccessToken])

  useEffect(() => {
    if (!hydrated) return
    const effectiveToken = accessToken ?? getStoredToken()
    const effectiveUser = user ?? buildUserFromToken(effectiveToken)

    if (!effectiveToken) {
      if (!isLoginRoute) {
        router.replace('/admin/login')
      }
      return
    }

    if (effectiveUser && effectiveUser.role !== 'admin') {
      clearAuth()
      router.replace('/admin/login')
      return
    }

    if (effectiveUser?.role === 'admin' && isLoginRoute) {
      router.replace('/admin/dashboard')
    }
  }, [hydrated, accessToken, user, clearAuth, router, isLoginRoute])

  if (!hydrated) {
    return null
  }

  const effectiveToken = accessToken ?? getStoredToken()
  const effectiveUser = user ?? buildUserFromToken(effectiveToken)

  if (!effectiveToken && !isLoginRoute) {
    return null
  }

  if (effectiveToken && effectiveUser?.role === 'admin' && isLoginRoute) {
    return null
  }

  if (effectiveToken && effectiveUser && effectiveUser.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
