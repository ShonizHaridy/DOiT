'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft2, Sms } from 'iconsax-reactjs'
// import RedBlockText from '@/components/layout/RedBlockText'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PageTitleBanner from '@/components/layout/PageTitleBanner'

// Mock user data
const mockUser = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Myname@gmail.com',
}

export default function EditProfileContent() {
  const t = useTranslations('profile')
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Updating profile:', formData)
    router.push('/profile')
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
                />
                <Input
                  placeholder={t('lastNamePlaceholder')}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="font-roboto text-sm lg:text-base"
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="font-roboto text-sm lg:text-base"
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
                className="flex-1 py-3 rounded font-rubik font-medium text-base lg:text-xl"
              >
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}