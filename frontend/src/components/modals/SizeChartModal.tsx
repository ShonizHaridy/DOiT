'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { CloseCircle } from 'iconsax-reactjs'
import { useTranslations } from 'next-intl'
import { useUIStore } from '@/store'

export default function SizeChartModal() {
  const { sizeChart, closeSizeChart } = useUIStore()
  const t = useTranslations('product')
  const { isOpen } = sizeChart
  const tips = [
    {
      key: 'chest',
      label: t('sizeChartTips.chest.label'),
      text: t('sizeChartTips.chest.text'),
    },
    {
      key: 'waist',
      label: t('sizeChartTips.waist.label'),
      text: t('sizeChartTips.waist.text'),
    },
    {
      key: 'hips',
      label: t('sizeChartTips.hips.label'),
      text: t('sizeChartTips.hips.text'),
    },
    {
      key: 'footLength',
      label: t('sizeChartTips.footLength.label'),
      text: t('sizeChartTips.footLength.text'),
    },
  ]

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSizeChart()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeSizeChart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-(--z-modal-backdrop)"
        onClick={closeSizeChart}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h2 className="font-rubik font-semibold text-xl text-primary">{t('sizeChart')}</h2>
            <button
              onClick={closeSizeChart}
              className="text-text-body hover:text-primary transition-colors"
              aria-label={t('close')}
            >
              <CloseCircle size={28} variant="Bold" />
            </button>
          </div>

          {/* Content - Image */}
          <div className="p-6">
            <div className="relative w-full">
              <Image
                src="/images/size-chart.svg"
                alt={t('sizeChart')}
                width={1000}
                height={800}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>

            {/* Optional: Keep the tips section */}
            <div className="mt-6 p-4 bg-bg-card rounded-lg">
              <h4 className="font-rubik font-medium text-sm mb-2">{t('sizeChartTips.title')}</h4>
              <ul className="text-sm text-text-body space-y-1">
                {tips.map((tip) => (
                  <li key={tip.key}>
                    &bull; <strong>{tip.label}:</strong> {tip.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
