'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { clearAdminAuthStorage, getAdminAuthSnapshot } from '@/lib/auth-storage'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginRoute = pathname === '/admin/login'

  const authState = (() => {
    if (typeof window === 'undefined') {
      return {
        hydrated: false,
        hasAdminSession: false,
        hasInvalidStoredToken: false,
      }
    }

    const snapshot = getAdminAuthSnapshot()
    const hasAdminSession = Boolean(snapshot.token && snapshot.role === 'admin')
    const hasInvalidStoredToken = Boolean(snapshot.token && !hasAdminSession)

    return {
      hydrated: true,
      hasAdminSession,
      hasInvalidStoredToken,
    }
  })()

  useEffect(() => {
    if (!authState.hydrated) return

    if (authState.hasInvalidStoredToken) {
      clearAdminAuthStorage()
    }

    if (!authState.hasAdminSession && !isLoginRoute) {
      router.replace('/admin/login')
      return
    }

    if (authState.hasAdminSession && isLoginRoute) {
      router.replace('/admin/dashboard')
    }
  }, [authState.hasAdminSession, authState.hasInvalidStoredToken, authState.hydrated, isLoginRoute, router])

  if (!authState.hydrated) {
    return null
  }

  if (!authState.hasAdminSession && !isLoginRoute) {
    return null
  }

  if (authState.hasAdminSession && isLoginRoute) {
    return null
  }

  return <>{children}</>
}
