import CheckoutContent from './CheckoutContent'

interface CheckoutPageProps {
  params: Promise<{ locale: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params

  return <CheckoutContent locale={locale} />
}