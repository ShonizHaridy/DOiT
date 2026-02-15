import { useTranslations } from 'next-intl'
import PageTitleBanner from '@/components/layout/PageTitleBanner'

export default function ShippingPage() {
  const t = useTranslations('shipping')

  return (
    <div className="min-h-screen bg-white">
      <PageTitleBanner title={t('title')} />

      {/* Content */}
      <div className="container-doit py-8 md:py-12 lg:py-16">
        <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100">
          <h2 className="text-neutral-900 text-xl md:text-2xl lg:text-3xl font-semibold">
            {t('title')}
          </h2>

          {/* Order Processing Times */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
              {t('orderProcessing.title')}
            </h3>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
              {t('orderProcessing.content')}
            </p>
          </div>

          {/* Tracking Your Order */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
              {t('tracking.title')}
            </h3>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
              {t('tracking.content')}
            </p>
          </div>

          {/* Delivery */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
              {t('delivery.title')}
            </h3>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
              {t('delivery.content')}
            </p>
          </div>

          {/* Damages and Lost Packages */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
              {t('damages.title')}
            </h3>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
              {t('damages.content')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
