import { getTranslations } from 'next-intl/server'
import ProfileContent from './ProfileContent'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('profile')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ProfilePage() {
  return <ProfileContent />
}