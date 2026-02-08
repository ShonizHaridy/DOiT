'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight2, Sms, User } from 'iconsax-reactjs'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
import { useCustomerProfile, useAddresses } from '@/hooks/useCustomer'
import { useAuthStore, useUIStore } from '@/store'
// import RedBlockText from '@/components/layout/RedBlockText'

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tAuth = useTranslations('auth')
  const accessToken = useAuthStore((state) => state.accessToken)
  const openSignIn = useUIStore((state) => state.openSignIn)
  const isSignedIn = Boolean(accessToken)

  const { data: profile, isLoading: isProfileLoading } = useCustomerProfile({ enabled: isSignedIn })
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses({ enabled: isSignedIn })

  const displayName = profile?.fullName ?? profile?.email ?? ''

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Page Title */}
      <PageTitleBanner title={t('title')} />

      {/* Content */}
      <div className="container-doit py-6 lg:py-8 space-y-4 lg:space-y-6">
      {!isSignedIn ? (
        <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
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
        <>
          {/* Name & Email Card */}
          <div className="bg-white rounded-lg p-4 lg:p-6">
            {/* Name Section */}
            <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-rubik font-medium text-base lg:text-xl text-primary mb-3">
                {t('name')}
              </h2>
              <div className="flex items-center gap-2 text-text-placeholder">
                <User size={20} variant="Outline" />
                <span className="font-roboto text-sm lg:text-base">
                  {isProfileLoading ? 'Loading...' : displayName}
                </span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="font-rubik font-medium text-base lg:text-lg text-primary underline hover:text-secondary transition-colors"
            >
              {t('edit')}
            </Link>
          </div>

          {/* Email Section */}
          <div>
            <h2 className="font-rubik font-medium text-base lg:text-xl text-primary mb-3">
              {t('email')}
            </h2>
            <div className="flex items-center gap-2 text-text-placeholder">
              <Sms size={20} variant="Outline" />
              <span className="font-roboto text-sm lg:text-base">
                {isProfileLoading ? 'Loading...' : (profile?.email ?? '')}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-lg p-4 lg:p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="font-rubik font-medium text-base lg:text-xl text-primary">
              {t('addresses')}
            </h2>
            <Link
              href="/profile/address/add"
              className="font-rubik font-medium text-base lg:text-lg text-primary underline hover:text-secondary transition-colors"
            >
              {t('add')}
            </Link>
          </div>

          {/* Address List */}
          <div className="space-y-4">
            {isAddressesLoading ? (
              <p className="font-roboto text-sm text-text-placeholder">Loading...</p>
            ) : addresses.length === 0 ? (
              <p className="font-roboto text-sm text-text-placeholder">{t('emptyAddresses')}</p>
            ) : (
              addresses.map((address) => (
                <Link
                  key={address.id}
                  href={`/profile/address/${address.id}/edit`}
                  className="flex items-start justify-between gap-4 p-3 lg:p-4 rounded-lg hover:bg-bg-search transition-colors group"
                >
                  <div className="flex-1">
                    <h3 className="font-rubik font-medium text-sm lg:text-base text-primary mb-1">
                      {address.label}
                    </h3>
                    <p className="font-roboto text-xs lg:text-sm text-text-placeholder leading-relaxed">
                      {address.fullAddress}
                    </p>
                  </div>
                  <ArrowRight2
                    size={20}
                    className="text-text-placeholder group-hover:text-primary transition-colors shrink-0 mt-1"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  )
}
