import { getTranslations } from 'next-intl/server'
import WishlistContent from './WishlistContent'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('wishlist')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <WishlistContent locale={locale} />
}