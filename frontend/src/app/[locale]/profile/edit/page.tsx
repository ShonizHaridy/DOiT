'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft2, Sms } from 'iconsax-reactjs'
// import RedBlockText from '@/components/layout/RedBlockText'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
import { useCustomerProfile, useUpdateProfile } from '@/hooks/useCustomer'
import { useAuthStore, useUIStore } from '@/store'

export default function EditProfilePage() {
  const t = useTranslations('profile')
  const tAuth = useTranslations('auth')
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const isSignedIn = Boolean(accessToken)
  const { data: profile, isLoading } = useCustomerProfile({ enabled: isSignedIn })
  const updateProfile = useUpdateProfile()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    const nameParts = (profile.fullName || '').split(' ')
    const firstName = nameParts.shift() || ''
    const lastName = nameParts.join(' ')
    setFormData({
      firstName,
      lastName,
      email: profile.email,
    })
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!profile) return
    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim()
    if (!fullName) {
      setErrorMessage(t('nameRequired'))
      return
    }
    try {
      await updateProfile.mutateAsync({
        fullName,
        phoneNumber: profile.phoneNumber,
        avatarUrl: profile.avatarUrl,
      })
      router.push('/profile')
    } catch {
      setErrorMessage(t('saveError'))
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Page Title */}
      <PageTitleBanner title={t('title')} />

      {/* Content */}
      <div className="container-doit py-6 lg:py-8">
        {!isSignedIn ? (
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 max-w-2xl">
            <p className="font-rubik text-base lg:text-lg text-text-body text-center">
              {t('signInPrompt')}
            </p>
            <button
              onClick={openSignIn}
              className="px-6 py-2.5 bg-primary text-white font-rubik font-medium rounded hover:bg-primary/90 transition-colors"
            >
              {tAuth('signIn')}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 lg:p-6 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <button
              onClick={handleCancel}
              className="text-primary hover:text-secondary transition-colors"
              aria-label={t('back')}
            >
              <ArrowLeft2 size={24} />
            </button>
            <h1 className="font-rubik font-medium text-lg lg:text-xl text-primary">
              {t('editProfile')}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {/* Name Section */}
            <div>
              <h2 className="font-rubik font-medium text-base lg:text-xl text-primary mb-4">
                {t('name')}
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder={t('firstNamePlaceholder')}
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="font-roboto text-sm lg:text-base"
                  disabled={isLoading}
                />
                <Input
                  placeholder={t('lastNamePlaceholder')}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="font-roboto text-sm lg:text-base"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Section */}
            <div>
              <h2 className="font-rubik font-medium text-base lg:text-xl text-primary mb-2">
                {t('email')}
              </h2>
              <p className="font-roboto text-xs lg:text-sm text-text-placeholder mb-4">
                {t('emailHelper')}
              </p>
              <Input
                type="email"
                leftIcon={<Sms size={20} />}
                value={formData.email}
                onChange={() => {}}
                className="font-roboto text-sm lg:text-base"
                disabled
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 py-3 rounded font-rubik font-medium text-base lg:text-xl"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending || isLoading}
                className="flex-1 py-3 rounded font-rubik font-medium text-base lg:text-xl"
              >
                {updateProfile.isPending ? t('saving') : t('save')}
              </Button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  )
}
