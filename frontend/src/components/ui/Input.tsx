// 'use client'

// import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

// export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string
//   error?: string
//   helperText?: string
//   leftIcon?: ReactNode
//   rightIcon?: ReactNode
//   onRightIconClick?: () => void
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       label,
//       error,
//       helperText,
//       leftIcon,
//       rightIcon,
//       onRightIconClick,
//       className = '',
//       id,
//       ...props
//     },
//     ref
//   ) => {
//     const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

//     return (
//       <div className="w-full">
//         {/* Label */}
//         {label && (
//           <label
//             htmlFor={inputId}
//             className="block text-neutral-900 text-xl font-normal mb-1"
//             style={{ fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif' }}
//           >
//             {label}
//           </label>
//         )}

//         {/* Input Container */}
//         <div className="relative">
//           {/* Left Icon */}
//           {leftIcon && (
//             <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
//               {leftIcon}
//             </div>
//           )}

//           {/* Input Field */}
//           <input
//             ref={ref}
//             id={inputId}
//             className={`
//               w-full
//               px-4 py-3
//               ${leftIcon ? 'ps-12' : ''}
//               ${rightIcon ? 'pe-12' : ''}
//               bg-white
//               border border-[#E8E7EA]
//               rounded
//               text-base text-neutral-900
//               placeholder:text-[#888787]
//               focus:outline-none focus:ring-2 focus:ring-[#222E50]/20 focus:border-[#222E50]
//               disabled:bg-neutral-100 disabled:cursor-not-allowed
//               transition-all duration-200
//               ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
//               ${className}
//             `}
//             style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
//             {...props}
//           />

//           {/* Right Icon */}
//           {rightIcon && (
//             <button
//               type="button"
//               onClick={onRightIconClick}
//               className={`absolute inset-y-0 end-0 flex items-center pe-4 ${
//                 onRightIconClick ? 'cursor-pointer hover:opacity-70' : 'pointer-events-none'
//               } transition-opacity`}
//               tabIndex={onRightIconClick ? 0 : -1}
//             >
//               {rightIcon}
//             </button>
//           )}
//         </div>

//         {/* Helper Text / Error */}
//         {(helperText || error) && (
//           <p
//             className={`mt-1 text-base ${
//               error ? 'text-red-500' : 'text-[#888787]'
//             }`}
//             style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
//           >
//             {error || helperText}
//           </p>
//         )}
//       </div>
//     )
//   }
// )

// Input.displayName = 'Input'

// export default Input


'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onRightIconClick?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-inter font-medium text-xl text-neutral-900 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-text-tertiary">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 bg-white border border-border-input rounded',
              'font-roboto font-normal text-base text-neutral-900',
              'placeholder:text-text-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-border-focus/20 focus:border-border-focus',
              'disabled:bg-neutral-100 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              leftIcon && 'ps-12',
              rightIcon && 'pe-12',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={cn(
                'absolute inset-y-0 end-0 flex items-center pe-4 text-text-tertiary',
                onRightIconClick ? 'cursor-pointer hover:text-neutral-700' : 'pointer-events-none',
                'transition-colors'
              )}
              tabIndex={onRightIconClick ? 0 : -1}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 font-roboto font-normal text-sm',
              error ? 'text-red-500' : 'text-text-tertiary'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input