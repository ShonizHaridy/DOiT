'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { accessToken, user, setAccessToken, clearAuth } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (accessToken) {
      setHydrated(true)
      return
    }

    const storedToken = typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null

    if (storedToken) {
      setAccessToken(storedToken)
    }

    setHydrated(true)
  }, [accessToken, setAccessToken])

  useEffect(() => {
    if (!hydrated) return

    if (!accessToken) {
      router.replace('/admin/login')
      return
    }

    if (user && user.role !== 'admin') {
      clearAuth()
      router.replace('/admin/login')
    }
  }, [hydrated, accessToken, user, clearAuth, router])

  if (!hydrated) {
    return null
  }

  return <>{children}</>
}
