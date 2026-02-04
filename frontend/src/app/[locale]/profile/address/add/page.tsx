import { getTranslations } from 'next-intl/server'
import AddAddressContent from './AddAddressContent'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('profile')
  return {
    title: t('addAddress'),
  }
}

export default async function AddAddressPage() {
  return <AddAddressContent />
}