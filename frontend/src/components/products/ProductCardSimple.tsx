'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProductCardSimpleProps {
  id: string
  title: string
  image: string
  price: string
  href: string
  className?: string
}

export default function ProductCardSimple({
  id,
  title,
  image,
  price,
  href,
  className,
}: ProductCardSimpleProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div
      className={cn(
        'flex flex-col p-1 rounded bg-white',
        className
      )}
    >
      {/* Image Section */}
      <Link href={href} className="relative h-[152px] bg-neutral-100 rounded overflow-hidden group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-col pt-2 gap-1">
        {/* Title */}
        <Link href={href}>
          <h3 className="text-neutral-900 text-sm md:text-base font-normal leading-tight line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price and Favorite */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span className="text-primary text-base md:text-xl font-medium">{price.split(' ')[0]} </span>
            <span className="text-primary text-xs md:text-sm font-medium">{price.split(' ')[1]}</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="w-6 h-6 flex items-center justify-center transition-colors"
            aria-label="Add to wishlist"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(isFavorite && 'fill-neutral-700')}
            >
              <path
                d="M11 2.5C12.777 2.50017 14.166 3.88991 14.166 5.66699C14.1659 6.76258 13.6779 7.79573 12.7168 8.97168C11.7498 10.1547 10.3573 11.4203 8.63086 12.9893L8 13.5576L7.36914 12.9834L6.1377 11.8613C4.97237 10.79 4.00739 9.85729 3.28223 8.9707C2.32124 7.79574 1.8331 6.76254 1.83301 5.66699C1.83301 3.8898 3.22281 2.5 5 2.5C6.00849 2.5001 6.98434 2.97232 7.61914 3.71777L8 4.16406L8.37988 3.71777C9.01475 2.97224 9.99139 2.5 11 2.5Z"
                stroke="#424242"
                strokeWidth="1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
