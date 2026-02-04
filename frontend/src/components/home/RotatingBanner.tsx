'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useHomeContent } from '@/hooks/useContent'
import { Banner } from '@/types/content'


interface RotatingBannerProps {
  locale: string,
  banners: Banner[]
}


export default function RotatingBanner({ locale, banners }: RotatingBannerProps) {
  // const { data: homeContent } = useHomeContent()
  const [currentIndex, setCurrentIndex] = useState(0)

  const BANNERS = banners || [
    {
      image: '/offers1.png',
      href: '/offers/black-friday',
      alt: 'Black Friday Sale'
    },
    {
      image: '/offers2.png',
      href: '/offers/exclusive',
      alt: 'Exclusive Offers'
    },
    {
      image: '/offers3.png',
      href: '/offers/black-friday-limited',
      alt: 'Black Friday Limited'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const currentBanner = BANNERS[currentIndex]

  return (
    <section className="w-full">
      <Link 
        href={`/${locale}${currentBanner.link}`}
        className="relative block h-42 md:h-56 lg:h-161 overflow-hidden group"
      >
        <Image
          src={currentBanner.imageUrl}
          alt={currentBanner.titleEn}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
          sizes="100vw"
        />
        
        {/* Optional: Add dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-(--z-content)">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </Link>
    </section>
  )
}