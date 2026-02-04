import OrdersContent from './OrdersContent'

interface OrdersPageProps {
  params: Promise<{ locale: string }>
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-white">
      {/* Red Banner */}
      <div className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
        <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider">
          MY ORDERS
        </h1>
      </div>

      <OrdersContent locale={locale} />
    </div>
  )
}