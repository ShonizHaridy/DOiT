import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '@/components/home/HeroSection'
import BrandLogos from '@/components/home/BrandLogos'
import CustomMadeForm from '@/components/home/CustomMadeForm'
import ProductCard from '@/components/products/ProductCard'
import { STYLE_CATEGORIES } from '@/data/products'
import RotatingBanner from '@/components/home/RotatingBanner'
import { RedBlockText } from '@/components/layout/RedBlockText'
import GrowingDotsBackground from '@/components/ui/GrowingDotsBackground'
import { getLocalized } from '@/lib/i18n-utils' 
import { serverFetch } from '@/lib/server-fetch'
import type { Product } from '@/types/product'
import { HomeContent } from '@/types/content'

interface HomePageProps {
  params: Promise<{ locale: 'en' | 'ar' }> 
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = await getTranslations('home')

  // This executes both requests in parallel
  const [homeContent, featuredProducts] = await Promise.all([
    // First Fetch
    serverFetch<HomeContent>('/content/home', {
      revalidate: 60,
      tags: ['content', 'home'],
    }),
    // Second Fetch (Example)
    serverFetch<Product[]>('/products/featured', {
      revalidate: 60,
      tags: ['products', 'featured'],
    })
  ])

  const joinTitle = (...parts: string[]) => parts.filter(Boolean).join(' ')
  const getHighlightRange = (text: string, highlight: string) => {
    const start = text.indexOf(highlight)
    if (start === -1) {
      return { start: 0, end: Math.max(0, text.length - 1) }
    }
    return { start, end: start + highlight.length - 1 }
  }

  const featuredTitle = joinTitle(t('featured'), t('products'))
  const featuredRange = getHighlightRange(featuredTitle, t('featured'))
  const selectTitle = joinTitle(t('selectYour'), t('style'), t('now'))
  const selectRange = getHighlightRange(selectTitle, t('style'))
  const customTitle = joinTitle(t('custom'), t('made'))
  const customRange = getHighlightRange(customTitle, t('custom'))
 

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <HeroSection locale={locale} heroSection={homeContent.heroSection} />

      {/* Brand Logos */}
      <BrandLogos />

      {/* Sale Banners - Using actual images in production */}
      <RotatingBanner locale={locale} banners={homeContent.banners} />


      {/* Featured Products */}
      <section className="relative px-4 lg:px-18 md:py-12 lg:py-16 mt-4 lg:mt-14">
        {/* Growing Dots Overlay */}
        <GrowingDotsBackground
          showText={false}
          noDotsZone={{ top: 0, bottom: 0 }}
          // dotsZone='corners'
        />
        {/* Section Title */}
        <div className="flex justify-center mb-6 md:mb-8 z-(--z-content)">
          <h2 className="font-roboto-condensed font-bold text-2xl md:text-[40px] uppercase text-primary">
            {/* <span className="relative inline-block">
              <span className="relative z-10 bg-secondary text-white px-2">{t('featured')}</span>
            </span>
            {' '}{t('products')} */}
            <RedBlockText
              blocks={[{
                startChar: featuredRange.start,
                top: "40%",
                endChar: featuredRange.end,
                paddingStart: 10,
                height: "85%",
              }]}
              lgBlocks={[{
                startChar: featuredRange.start,
                top: "40%",
                endChar: featuredRange.end,
                paddingStart: 20,
                paddingEnd: -2,
                height: "80%",
              }
              ]}
              className="text-2xl font-bold"
            >
              {featuredTitle}
            </RedBlockText>
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-18 md:gap-5 z-(--z-content)">
          {featuredProducts.map((product) => {
            const hasDiscount = product.discountPercentage > 0 && product.finalPrice < product.basePrice

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={getLocalized(product, 'name', locale)}
                image={product.images[0]?.url ?? '/placeholder-product.png'}
                price={hasDiscount ? product.finalPrice : product.basePrice}
                originalPrice={hasDiscount ? product.basePrice : undefined}
                discountPercentage={hasDiscount ? product.discountPercentage : undefined}
                currency="EGP"
                href={`/${locale}/products/${product.id}`}
                colors={product.colors}
                sizes={product.sizes}
                gender={product.gender}
                quickAddProduct={product}
              />
            )
          })}
          </div>
      </section>

      {/* Select Your Style */}
      {/* Select Your Style */}
      <section className="py-8 md:py-12 lg:py-10">
        {/* Section Title */}
        <div className="flex justify-center mb-6 md:mb-8">
          <h2 className="font-roboto-condensed font-bold text-2xl md:text-[40px] uppercase text-primary">
            <RedBlockText
              blocks={[{
                startChar: selectRange.start,
                top: "-30%",
                endChar: selectRange.end,
                paddingStart: 10,
                height: "115%",
              }]}
              // lgBlocks={[{ // Not used as it is the same up for now
              //   startChar: 16, 
              //   top: "-30%",
              //   endChar: 20, 
              //   paddingStart: 10,
              //   height: "115%",
              // }]}
              className="text-2xl font-bold"
            >
              {selectTitle}
            </RedBlockText>
          </h2>
        </div>

        {/* Categories */}
        <div className="flex flex-col md:flex-row md:overflow-x-auto md:gap-5 gap-4 scrollbar-hide">
          {STYLE_CATEGORIES.map((category) => (
            <Link
              key={category.key}
              // href={`/${locale}${category.href}`}
              href='#'
              className="relative group overflow-hidden rounded-lg md:shrink-0 md:w-[641px]"
            >
              <div className="relative h-80 md:h-[400px] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={t(`categories.${category.key}`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 641px"
                />
              </div>

              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 py-3 bg-black/40 flex items-center justify-center">
                <span className="font-roboto-condensed font-bold text-lg text-white uppercase">
                  {t(`categories.${category.key}`)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom Made Section */}
      <section className="relative py-8 md:py-12 lg:py-11 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/custommadebg.png"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />

        {/* Growing Dots Overlay */}
        <GrowingDotsBackground
          showText={false}
          noDotsZone={{ top: 0, bottom: 0 }}
        />

        {/* Centered DOiT Watermark */}
        <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none select-none">
          <span className="font-roboto-condensed font-bold text-[150px] lg:text-[500px] text-gray-200 uppercase leading-none"> {/* Used leading-none here to make the big text appear on top */}
            DO iT
          </span>
        </div>

        {/* Mobile: 15px padding, Desktop: container */}
        <div className="px-[15px] lg:px-19 relative">
          {/* Section Title */}
          <div className="flex justify-center mb-6 md:mb-8">
            <h2 className="font-roboto-condensed font-bold text-2xl md:text-[40px] uppercase text-primary">
              <RedBlockText
                blocks={[{
                  startChar: customRange.start,
                  top: "40%",
                  endChar: customRange.end,
                  paddingStart: 4,
                  paddingEnd: 9,
                  height: "80%",
                }]}
                lgBlocks={[{
                  startChar: customRange.start,
                  top: "40%",
                  endChar: customRange.end,
                  paddingStart: 24,
                  paddingEnd: 2,
                  height: "80%",
                }]}
              >
                {customTitle}
              </RedBlockText>
            </h2>
          </div>

          <CustomMadeForm />
        </div>
      </section>
    </div>
  )
}
