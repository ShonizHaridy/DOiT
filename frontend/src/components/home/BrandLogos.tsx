'use client'

import Image from 'next/image'

const brands = [
  { name: 'Brand 1', src: '/brands/brand1.png' },
  { name: 'Brand 2', src: '/brands/brand2.png' },
  { name: 'Brand 3', src: '/brands/brand3.png' },
  { name: 'Brand 4', src: '/brands/brand4.png' },
  { name: 'Brand 5', src: '/brands/brand5.png' },
  { name: 'Brand 6', src: '/brands/brand6.png' },
  { name: 'Brand 7', src: '/brands/brand7.png' },
  { name: 'Brand 8', src: '/brands/brand8.png' },
  { name: 'Brand 9', src: '/brands/brand9.png' },
]

export default function BrandLogos() {
  return (
    <div className="w-full bg-white overflow-hidden py-1 lg:py-2">
      <div className="flex items-center animate-scroll">
        {/* Render 4 sets for seamless infinite scroll (handles wide screens) */}
        {[...Array(4)].map((_, setIndex) =>
          brands.map((brand, index) => (
            <div
              key={`${brand.name}-${setIndex}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-[50px] lg:h-[100px] pr-8 lg:pr-12"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={150}
                height={100}
                className="object-contain w-auto h-full"
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}