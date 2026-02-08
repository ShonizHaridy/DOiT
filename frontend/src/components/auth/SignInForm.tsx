'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sms } from 'iconsax-reactjs'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useSendOtp, useVerifyOtp } from '@/hooks/useAuth'

interface SignInFormProps {
  onSuccess?: () => void
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const t = useTranslations('auth')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()

  const isLoading = step === 'email' ? sendOtp.isPending : verifyOtp.isPending

  const getErrorMessage = (error: unknown) => {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? (error instanceof Error ? error.message : '')
    return message || 'Something went wrong. Please try again.'
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      await sendOtp.mutateAsync({ email })
      setStep('code')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    if (!email) {
      setErrorMessage('Please enter your email.')
      setStep('email')
      return
    }
    try {
      await verifyOtp.mutateAsync({ email, code })
      onSuccess?.()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  if (step === 'email') {
    return (
      <div className="w-full max-w-[565px] bg-white rounded-2xl p-8 lg:p-12 shadow-form">
        <div className="flex justify-center mb-8">
          <Logo size="xl" href="/" />
        </div>
        <h1 className="font-rubik font-semibold text-2xl lg:text-[32px] text-sign-title text-center mb-8">
          {t('signIn')}
        </h1>
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label className="block font-rubik font-normal text-base text-primary mb-3">
              {t('email')}
            </label>
            <Input
              type="email"
              leftIcon={<Sms size={20} />}
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          <Button type="submit" isLoading={isLoading} fullWidth className="py-4 font-medium text-xl">
            {t('continue')}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[565px] bg-white rounded-2xl p-8 lg:p-12 shadow-form">
      <div className="flex justify-center mb-8">
        <Logo size="xl" href="/" />
      </div>
      <h1 className="font-rubik font-semibold text-2xl lg:text-[32px] text-sign-title text-center mb-4">
        {t('enterCode')}
      </h1>
      <p className="font-rubik font-normal text-base text-primary text-center mb-8">
        {t('codeSubtitle')}
      </p>
      <form onSubmit={handleCodeSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder={t('codePlaceholder')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
          className="text-center text-2xl tracking-widest"
          disabled={isLoading}
        />
        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
        <Button type="submit" isLoading={isLoading} fullWidth className="py-4 font-medium text-xl">
          {t('submit')}
        </Button>
        <button
          type="button"
          onClick={() => setStep('email')}
          className="w-full text-center text-link-alt hover:underline"
          disabled={isLoading}
        >
          {t('backToEmail')}
        </button>
      </form>
    </div>
  )
}
