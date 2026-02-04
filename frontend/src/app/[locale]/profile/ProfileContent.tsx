'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight2, Sms, User } from 'iconsax-reactjs'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
// import RedBlockText from '@/components/layout/RedBlockText'

// Mock user data - replace with actual user data from your auth system
const mockUser = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Myname@gmail.com',
  addresses: [
    {
      id: '1',
      label: 'Home',
      address: '421 Gamal Abdelnasser St. Panorama Tower, Cairo, Egypt',
    },
    {
      id: '2',
      label: 'Work',
      address: '331 Al horiya Road NewPalace Tower, Cairo, Egypt',
    },
  ],
}

export default function ProfileContent() {
  const t = useTranslations('profile')

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Page Title */}
      <PageTitleBanner title={t('title')} />

      {/* Content */}
      <div className="container-doit py-6 lg:py-8 space-y-4 lg:space-y-6">
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
                  {mockUser.firstName} {mockUser.lastName}
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
              <span className="font-roboto text-sm lg:text-base">{mockUser.email}</span>
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
            {mockUser.addresses.map((address) => (
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
                    {address.address}
                  </p>
                </div>
                <ArrowRight2
                  size={20}
                  className="text-text-placeholder group-hover:text-primary transition-colors shrink-0 mt-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}