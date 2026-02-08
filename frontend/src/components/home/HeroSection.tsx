'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import GrowingDotsBackground from '../ui/GrowingDotsBackground'
import type { HeroSectionProduct } from '@/types/content'
import { getLocalized } from '@/lib/i18n-utils'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  locale: 'en' | 'ar',
  heroSection: HeroSectionProduct
}

export default function HeroSection({ locale, heroSection }: HeroSectionProps) {
  const t = useTranslations('home.hero')

  const shoeVariants = [ // Was for dev test
    { id: 'red', src: '/red.png', alt: 'Red Shoe' },
    { id: 'purple', src: '/purple.png', alt: 'Purple Shoe' },
    { id: 'green', src: '/green.png', alt: 'Green Shoe' },
  ]

  const allVariants = [
    heroSection.mainImageUrl,
    ...heroSection.variantImages
  ]
  // const allVariants = shoeVariants.map(shoeVariant => shoeVariant.src)
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  return (
    <section className="relative w-full min-h-[550px] lg:min-h-[650px] pt-8 lg:pt-33 px-16 bg-graphite overflow-hidden">
      <GrowingDotsBackground 
        topPosition="-top-[100px] lg:-top-[200px] -start-[50px]" 
        bottomPosition="-bottom-[100px] lg:-bottom-[200px] -end-[50px]" 
        fontSizeClass="text-[10rem] lg:text-[20rem]"
      />

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="relative z-(--z-content) flex flex-col lg:hidden py-8">
        {/* Text Content */}
        <div className="flex flex-col items-start ps-8">
          <h1 className="font-roboto-condensed font-bold text-4xl leading-tight text-white uppercase">
            {getLocalized(heroSection, 'headline', locale)}
          </h1>
        </div>

        {/* Price Tag */}
        <div className="ps-[35px] mt-3">
          <div className="inline-flex items-end bg-secondary px-4 py-1">
            <span className="font-roboto-condensed font-bold text-3xl leading-none text-primary">
              {heroSection.price}
            </span>
            <span className="font-roboto-condensed font-bold text-xl leading-none text-primary ms-1">
              EGP
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="ps-[35px] mt-4">
          <Link
            href={`/${locale}/cart`}
            className="inline-block px-6 py-2 border border-secondary rounded-sm text-white font-roboto-condensed font-bold text-[7.5px] uppercase tracking-wide hover:bg-secondary hover:text-primary transition-colors"
          >
            {t('addToCart')}
          </Link>
        </div>

        {/* Shoe Display Area */}
        <div className="relative mt-6 h-[320px]">
          {/* Main Shoe + Red Bar Container */}
          <div className="absolute top-0 end-[5%] w-[288px] h-[253px]">
            {/* Red Vertical Bar - centered behind shoe */}
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[83px] h-[196px] bg-secondary" />
            
            {/* Main Shoe - ROTATED */}
            <Image
              src={allVariants[selectedImageIndex]}
              alt={getLocalized(heroSection, 'ctaText', locale)}
              fill
              className="object-contain drop-shadow-2xl relative transition-opacity duration-300"
              style={{ transform: 'rotate(-18.62deg)' }}
              priority
            />
          </div>

          {/* Shoe Variants - NOT ROTATED, SMALL SIZE */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 px-[55px]">
            {allVariants.map((variant, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                onMouseEnter={() => setSelectedImageIndex(index)}
                className={cn(
                  'relative w-[70px] h-[45px] hover:scale-105 transition-transform',
                  selectedImageIndex === index ? 'ring-2 ring-secondary ring-offset-2 ring-offset-graphite' : ''
                )}
              >
                <Image
                  src={variant}
                  alt={`Variant ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden lg:flex lg:justify-around lg:gap-5 relative z-(--z-content) h-full py-12">
        {/* Left Side - Shoe Images */}
        <div className="flex flex-col w-[545px]">
          {/* Main Shoe Container */}
          <div className="relative w-full h-[478px]">
            {/* Red Vertical Bar - absolute to this container */}
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[156px] h-[372px] bg-secondary" />
            
            {/* Main Shoe - ROTATED, BIG */}
            <Image
              src={allVariants[selectedImageIndex]}
              alt={getLocalized(heroSection, 'ctaText', locale)}
              fill
              className="object-contain drop-shadow-2xl relative transition-opacity duration-300"
              style={{ transform: 'rotate(18.62deg)' }}
              priority
            />
          </div>

          {/* Shoe Variants - NOT ROTATED, SMALL SIZE */}
          <div className="flex gap-5 justify-center">
            {allVariants.map((variant, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                onMouseEnter={() => setSelectedImageIndex(index)}
                className={cn(
                  'relative w-[132px] h-[96px] hover:scale-110 transition-transform cursor-pointer',
                  selectedImageIndex === index ? 'ring-2 ring-secondary ring-offset-2 ring-offset-graphite' : ''
                )}
              >
                <Image
                  src={variant}
                  alt={`Variant ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col items-start gap-6 lg:gap-8">
          {/* Title */}
<h1 className="font-roboto-condensed font-bold text-[52px] xl:text-[70px] leading-[1.05] text-white uppercase lg:max-w-[593px]">
  {getLocalized(heroSection, 'headline', locale)}
</h1>

          {/* Price Tag */}
          <div className="inline-flex items-end bg-secondary px-5 py-2">
            <span className="font-roboto-condensed font-bold text-[60px] xl:text-[72px] leading-none text-primary">
              {heroSection.price}
            </span>
            <span className="font-roboto-condensed font-bold text-[32px] xl:text-[40px] text-primary ms-2">
              EGP
            </span>
          </div>

          {/* Description */}
          <p className="font-roboto text-lg text-white max-w-[320px] leading-relaxed">
            {getLocalized(heroSection, 'description', locale)}
          </p>

          {/* Add to Cart Button */}
          <Link
            href={`/${locale}/cart`}
            className="px-10 py-3 border border-secondary rounded-lg text-white font-roboto-condensed font-bold text-sm uppercase tracking-wide hover:bg-secondary hover:text-primary transition-colors"
          >
            {t('addToCart')}
          </Link>
        </div>
      </div>
    </section>
  )
}