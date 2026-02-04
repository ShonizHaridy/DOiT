import { getTranslations } from 'next-intl/server'
import CartContent from './CartContent'

interface CartPageProps {
  params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  const t = await getTranslations('cart')

  return (
    <div className="min-h-screen bg-white">
      {/* Red Banner */}
      <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
        <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
          MY SHOPPING CART
        </h1>
      </div>

      <CartContent locale={locale} />
    </div>
  )
}