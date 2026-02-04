import { QueryProvider } from '@/providers/QueryProvider'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DOiT',
  description: 'to-be-added-later',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale?: string }
}) {
  const locale = params?.locale || 'en'
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={direction}>
      <QueryProvider >
      <body>{children}</body>
      </QueryProvider>
    </html>
  )
}
