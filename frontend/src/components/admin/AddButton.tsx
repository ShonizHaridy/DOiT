'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AddCircle } from 'iconsax-reactjs'

interface AddButtonProps {
  label: string
  href?: string
  onClick?: () => void
  className?: string
}

export default function AddButton({ label, href, onClick, className }: AddButtonProps) {
  const classes = cn(
    'inline-flex items-center gap-2 px-5 h-11 rounded-lg',
    'text-sm font-medium text-white bg-neutral-900',
    'hover:bg-neutral-800 transition-colors',
    className
  )

  const content = (
    <>
      <AddCircle size={18} />
      {label}
    </>
  )

  // If href provided, render as Link
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  )
}