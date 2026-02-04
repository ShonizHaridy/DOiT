// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { cn } from '@/lib/utils'

// interface Color {
//   name: string
//   hex: string
// }

// interface ProductCardProps {
//   id: string
//   title: string
//   image: string
//   colors: Color[]
//   sizes: string[]
//   gender: string
//   price: string
//   href: string
//   className?: string
// }

// export default function ProductCard({
//   id,
//   title,
//   image,
//   colors,
//   sizes,
//   gender,
//   price,
//   href,
//   className,
// }: ProductCardProps) {
//   const [isFavorite, setIsFavorite] = useState(false)

//   return (
//     <Link
//       href={href}
//       className={cn(
//         'flex flex-col w-full h-auto rounded-lg md:rounded-xl bg-neutral-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden group',
//         className
//       )}
//     >
//       {/* Image Section */}
//       <div className="relative h-28 md:h-32 lg:h-36 p-4 md:p-5 overflow-hidden">
//         <Image
//           src={image}
//           alt={title}
//           fill
//           className="object-contain group-hover:scale-105 transition-transform duration-300"
//         />

//         {/* Favorite Button */}
//         <button
//           onClick={(e) => {
//             e.preventDefault()
//             setIsFavorite(!isFavorite)
//           }}
//           className="absolute top-2 end-2 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-colors"
//           aria-label="Add to wishlist"
//         >
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 16 16"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className={cn(isFavorite && 'fill-primary')}
//           >
//             <path
//               d="M11.0005 2.5C12.7775 2.50017 14.1665 3.88991 14.1665 5.66699C14.1664 6.76258 13.6784 7.79573 12.7173 8.97168C11.7503 10.1547 10.3578 11.4203 8.63135 12.9893L8.00049 13.5576L7.36963 12.9834L6.13818 11.8613C4.97286 10.79 4.00788 9.85729 3.28271 8.9707C2.32173 7.79574 1.83359 6.76254 1.8335 5.66699C1.8335 3.8898 3.2233 2.5 5.00049 2.5C6.00898 2.5001 6.98483 2.97232 7.61963 3.71777L8.00049 4.16406L8.38037 3.71777C9.01524 2.97224 9.99188 2.5 11.0005 2.5Z"
//               stroke="currentColor"
//               strokeWidth="1"
//               className="text-neutral-600"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Content Section */}
//       <div className="flex flex-col flex-1 px-2 md:px-3 pb-3 md:pb-4">
//         {/* Title */}
//         <h3 className="text-xs md:text-sm font-medium leading-relaxed text-neutral-900 mb-2 line-clamp-2">
//           {title}
//         </h3>

//         {/* Details */}
//         <div className="flex flex-col gap-1.5 md:gap-2 text-neutral-600">
//           {/* Colors */}
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs md:text-sm font-normal">Colors:</span>
//             <div className="flex gap-1">
//               {colors.slice(0, 3).map((color, index) => (
//                 <div
//                   key={index}
//                   className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm border border-neutral-300"
//                   style={{ backgroundColor: color.hex }}
//                   title={color.name}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Sizes */}
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs md:text-sm font-normal">Sizes:</span>
//             <span className="flex-1 text-xs md:text-sm">{sizes.join('/ ')}</span>
//           </div>

//           {/* Gender */}
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs md:text-sm font-normal">Gender:</span>
//             <span className="text-xs md:text-sm">{gender}</span>
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-1.5">
//             <span className="text-xs md:text-sm font-normal">Price:</span>
//             <span className="text-xs md:text-sm font-semibold text-primary">{price}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

import Image from 'next/image'
import Link from 'next/link'
import FavoriteButton from '@/components/products/FavoriteButton'
import AddToCartButton from '@/components/products/AddToCartButton'
import { cn } from '@/lib/utils'
import { Heart } from 'iconsax-reactjs'



export interface ProductCardProps {
  id: string
  title: string
  image: string
  price: number 
  currency?: string
  href: string
  colors?: string[]
  sizes?: string[]
  gender?: string
  className?: string
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  currency = 'LE',
  href,
  colors = [],
  sizes = [],
  gender,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col bg-bg-card rounded-lg overflow-hidden shadow-card z-(--z-content)',
        className
      )}
    >
      {/* Image with Heart Icon */}
      <Link href={href} className="relative aspect-square bg-bg-card overflow-hidden group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Heart Icon - Top Right */}
        <div className="absolute top-2 right-2 lg:hidden">
          <FavoriteButton productId={id} size={24} className="" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 bg-white">
        {/* Title Row with Add to Cart */}
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="flex-1">
            <h3 className="font-roboto font-medium text-sm md:text-base leading-6 tracking-[0.15px] text-text-card-title hover:text-secondary transition-colors">
              {title}
            </h3>
          </Link>

          {/* Add to Cart Button */}
          <div className="flex items-center gap-2 shrink-0">
            <AddToCartButton productId={id} />
            <div className="hidden lg:block">
              <FavoriteButton productId={id} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 lg:gap-4 text-sm lg:text-xl">
          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">Colors:</span>
              <div className="flex gap-1">
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-sm border border-gray-300"
                    // style={{ backgroundColor: color.hex }}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">Sizes:</span>
              <span className="font-rubik font-normal text-text-body">
                {sizes.join('/ ')}
              </span>
            </div>
          )}

          {/* Gender */}
          {gender && (
            <div className="flex items-center gap-2">
              <span className="font-rubik font-normal text-text-body">Gender:</span>
              <span className="font-rubik font-normal text-text-body">{gender}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-rubik font-normal text-text-body">Price:</span>
            <span className="font-rubik font-semibold text-secondary">
              {price.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}