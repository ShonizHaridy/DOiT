import { getTranslations } from 'next-intl/server'
import EditProfileContent from './EditProfileContent'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('profile')
  return {
    title: t('editProfile'),
  }
}

export default async function EditProfilePage() {
  return <EditProfileContent />
}