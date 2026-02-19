import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { QueryProvider } from '@/providers/QueryProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DirProvider from '@/components/DirProvider'
import GlobalProviders from '@/components/providers/GlobalProviders'
import OfferPopupModal from '@/components/offers/OfferPopupModal'
import { serverFetch } from '@/lib/server-fetch'
import type { Category } from '@/types/category'
import '../globals.css'

const locales = ['en', 'ar']

async function getCategories(): Promise<Category[]> {
  try {
    return await serverFetch<Category[]>('/categories?includeChildren=true', {
      revalidate: 0,
      tags: ['categories'],
    })
  } catch {
    return []
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()
  const categories = await getCategories()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <DirProvider>
              <GlobalProviders>
                <Header locale={locale} categories={categories} />
                <OfferPopupModal />
                <main>{children}</main>
                <Footer locale={locale} categories={categories} />
              </GlobalProviders>
            </DirProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
