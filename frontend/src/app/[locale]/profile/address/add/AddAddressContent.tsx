'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft2 } from 'iconsax-reactjs'
// import RedBlockText from '@/components/layout/RedBlockText'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import SaudiFlagIcon from '@/components/ui/SaudiFlagIcon'
import PageTitleBanner from '@/components/layout/PageTitleBanner'

const countries = [
  { value: 'eg', label: 'Egypt' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'ae', label: 'United Arab Emirates' },
]

const egyptGovernorates = [
  { value: 'cairo', label: 'Cairo' },
  { value: 'giza', label: 'Giza' },
  { value: 'alexandria', label: 'Alexandria' },
]

export default function AddAddressContent() {
  const t = useTranslations('profile')
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    address: '',
    apartment: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Adding address:', formData)
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
              {t('addAddress')}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t('addressNamePlaceholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              placeholder={t('countryPlaceholder')}
              options={countries}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />

            <Input
              placeholder={t('addressPlaceholder')}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <Input
              placeholder={t('apartmentPlaceholder')}
              value={formData.apartment}
              onChange={(e) =>
                setFormData({ ...formData, apartment: e.target.value })
              }
            />

            <Input
              placeholder={t('cityPlaceholder')}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />

            <Select
              placeholder={t('governoratePlaceholder')}
              options={egyptGovernorates}
              value={formData.governorate}
              onChange={(e) =>
                setFormData({ ...formData, governorate: e.target.value })
              }
            />

            <Input
              placeholder={t('postalCodePlaceholder')}
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />

            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1"
              />
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-3 border border-border-light rounded hover:bg-bg-search transition-colors"
              >
                <SaudiFlagIcon className="w-6 h-6" />
                <span className="font-roboto text-sm">+20</span>
              </button>
            </div>

            {/* Save as Default Checkbox */}
            <label className="flex items-center gap-2 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-5 h-5 rounded border-border-light text-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="font-roboto text-sm lg:text-base text-text-placeholder">
                {t('saveAsDefault')}
              </span>
            </label>

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