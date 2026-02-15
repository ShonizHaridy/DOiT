import { getTranslations } from 'next-intl/server'
import PageTitleBanner from '@/components/layout/PageTitleBanner'

export default async function PrivacyPage() {
  const tFooter = await getTranslations('footer')
  const tShipping = await getTranslations('shipping')

  const title = tFooter('serviceItems.privacy')
  const sections = [
    {
      heading: tShipping('orderProcessing.title'),
      body: tShipping('orderProcessing.content'),
    },
    {
      heading: tShipping('tracking.title'),
      body: tShipping('tracking.content'),
    },
    {
      heading: tShipping('delivery.title'),
      body: tShipping('delivery.content'),
    },
    {
      heading: tShipping('damages.title'),
      body: tShipping('damages.content'),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <PageTitleBanner title={title} />

      <div className="container-doit py-8 md:py-12 lg:py-16">
        <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100">
          <h2 className="text-neutral-900 text-xl md:text-2xl lg:text-3xl font-semibold">
            {title}
          </h2>

          {sections.map((section) => (
            <div key={section.heading} className="space-y-3 md:space-y-4">
              <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
                {section.heading}
              </h3>
              <p className="text-neutral-700 text-base md:text-lg leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
