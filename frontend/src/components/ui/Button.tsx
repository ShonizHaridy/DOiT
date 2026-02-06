// 'use client'

// import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

// export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'solid' | 'outline' | 'ghost' | 'link'
//   size?: 'sm' | 'md' | 'lg'
//   fullWidth?: boolean
//   isLoading?: boolean
//   leftIcon?: ReactNode
//   rightIcon?: ReactNode
// }

// const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       children,
//       variant = 'solid',
//       size = 'lg',
//       fullWidth = false,
//       isLoading = false,
//       leftIcon,
//       rightIcon,
//       className = '',
//       disabled,
//       ...props
//     },
//     ref
//   ) => {
//     // Base styles
//     const baseStyles = `
//       inline-flex items-center justify-center gap-2
//       font-medium rounded-lg
//       transition-all duration-200
//       focus:outline-none focus:ring-2 focus:ring-offset-2
//       disabled:opacity-50 disabled:cursor-not-allowed
//       ${fullWidth ? 'w-full' : ''}
//     `

//     // Variant styles
//     const variantStyles = {
//       solid: `
//         bg-neutral-900 text-white
//         hover:bg-neutral-800
//         focus:ring-neutral-900/20
//         disabled:hover:bg-neutral-900
//       `,
//       outline: `
//         border-2 border-neutral-900 text-neutral-900 bg-transparent
//         hover:bg-neutral-900 hover:text-white
//         focus:ring-neutral-900/20
//       `,
//       ghost: `
//         text-neutral-900 bg-transparent
//         hover:bg-neutral-100
//         focus:ring-neutral-900/20
//       `,
//       link: `
//         text-neutral-900 bg-transparent underline-offset-4
//         hover:underline
//         focus:ring-neutral-900/20
//       `,
//     }

//     // Size styles
//     const sizeStyles = {
//       sm: 'px-4 py-2 text-sm',
//       md: 'px-6 py-2.5 text-base',
//       lg: 'px-8 py-4 text-xl',
//     }

//     return (
//       <button
//         ref={ref}
//         disabled={disabled || isLoading}
//         className={`
//           ${baseStyles}
//           ${variantStyles[variant]}
//           ${sizeStyles[size]}
//           ${className}
//         `}
//         style={{ fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif' }}
//         {...props}
//       >
//         {isLoading ? (
//           <>
//             <svg
//               className="animate-spin h-5 w-5"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//             <span>Loading...</span>
//           </>
//         ) : (
//           <>
//             {leftIcon && <span>{leftIcon}</span>}
//             {children}
//             {rightIcon && <span>{rightIcon}</span>}
//           </>
//         )}
//       </button>
//     )
//   }
// )

// Button.displayName = 'Button'

// export default Button



'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'solid',
      size = 'lg',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'flex items-center justify-center gap-2',
      'font-rubik font-medium',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    )

    const variantStyles = {
      solid: cn(
        'bg-primary text-white',
        'hover:bg-primary/90',
        'focus:ring-primary/20',
        'disabled:hover:bg-primary'
      ),
      outline: cn(
        'border-2 border-primary text-primary bg-transparent',
        'hover:bg-primary hover:text-white',
        'focus:ring-primary/20'
      ),
      ghost: cn(
        'text-primary bg-transparent',
        'hover:bg-gray-100',
        'focus:ring-primary/20'
      ),
      link: cn(
        'text-primary bg-transparent underline-offset-4',
        'hover:underline',
        'focus:ring-primary/20'
      ),
    }

    // Mobile: 10px 16px, rounded (4px)
    // Desktop: 16px 32px, rounded-lg (8px)
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded',
      md: 'px-4 py-2.5 text-base rounded md:px-6 md:rounded-lg',
      lg: 'lg:px-32 lg:py-4 lg:text-xl lg:rounded-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button