'use client'

import SignInForm from '@/components/auth/SignInForm'
import { useRouter } from '@/i18n/navigation'

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <SignInForm onSuccess={() => router.push('/profile')} />
    </div>
  )
}