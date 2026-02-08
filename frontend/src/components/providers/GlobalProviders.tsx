'use client'

import { useEffect } from 'react'
import { QuickAddModal, SizeChartModal } from '@/components/modals'
import CartDrawer from '@/components/cart/CartDrawer'
import SignInModal from '@/components/modals/SignInModal'
import { useAuthStore, useUIStore } from '@/store'
import { useWishlist } from '@/hooks/useWishlist'
import { useRouter } from '@/i18n/navigation'

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  const { signIn, closeSignIn } = useUIStore()
  const { accessToken, setAccessToken } = useAuthStore()
  const router = useRouter()
  const isSignedIn = Boolean(accessToken)

  useWishlist({ enabled: isSignedIn })

  useEffect(() => {
    if (accessToken) return
    const legacyToken = typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null
    if (legacyToken) {
      setAccessToken(legacyToken)
    }
  }, [accessToken, setAccessToken])

  const handleSignInSuccess = () => {
    closeSignIn()
    router.push('/profile')
  }

  return (
    <>
      {children}
      <QuickAddModal />
      <SizeChartModal />
      <CartDrawer />
      <SignInModal
        isOpen={signIn.isOpen}
        onClose={closeSignIn}
        onSuccess={handleSignInSuccess}
      />
    </>
  )
}
