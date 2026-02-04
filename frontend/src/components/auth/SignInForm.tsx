'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sms } from 'iconsax-reactjs'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface SignInFormProps {
  onSuccess?: () => void
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const t = useTranslations('auth')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call to NestJS
    setTimeout(() => {
      setIsLoading(false)
      setStep('code')
    }, 1000)
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate Verification call to NestJS
    setTimeout(() => {
      setIsLoading(false)
      onSuccess?.()
    }, 1000)
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
            />
          </div>
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
        />
        <Button type="submit" isLoading={isLoading} fullWidth className="py-4 font-medium text-xl">
          {t('submit')}
        </Button>
        <button
          type="button"
          onClick={() => setStep('email')}
          className="w-full text-center text-link-alt hover:underline"
        >
          {t('backToEmail')}
        </button>
      </form>
    </div>
  )
}