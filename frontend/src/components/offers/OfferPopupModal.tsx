'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useClaimPopupOffer, usePopupOffer } from '@/hooks/useContent'

const CLAIMED_KEY_PREFIX = 'doit_offer_popup_claimed_'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function OfferPopupModal() {
  const locale = useLocale()
  const { data: offer } = usePopupOffer()
  const { mutateAsync: claimPopupOffer, isPending } = useClaimPopupOffer()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const claimedStorageKey = offer ? `${CLAIMED_KEY_PREFIX}${offer.id}` : null

  useEffect(() => {
    if (!offer || !claimedStorageKey || typeof window === 'undefined') return

    const alreadyClaimed = localStorage.getItem(claimedStorageKey) === '1'
    if (alreadyClaimed) return

    const timer = window.setTimeout(() => setIsOpen(true), 700)
    return () => window.clearTimeout(timer)
  }, [claimedStorageKey, offer])

  const close = () => {
    setIsOpen(false)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setError(null)
    setSuccess(null)

    try {
      await claimPopupOffer({
        email: normalizedEmail,
        locale: locale === 'ar' ? 'ar' : 'en',
      })

      if (claimedStorageKey && typeof window !== 'undefined') {
        localStorage.setItem(claimedStorageKey, '1')
      }

      setSuccess('Offer sent. Please check your inbox.')
      window.setTimeout(() => {
        close()
      }, 1200)
    } catch {
      setError('Unable to send offer right now. Please try again.')
    }
  }

  if (!offer || !isOpen) return null

  const amountLabel = (offer.amountLabel?.trim() || `${offer.amount}%`).replace(/\s+off$/i, '')

  return (
    <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={close} aria-hidden="true" />

      <div className="relative w-full max-w-[480px] rounded-[28px] bg-[#f5f5f5] px-6 pb-7 pt-10 shadow-[0_24px_40px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={close}
          className="absolute end-4 top-4 h-8 w-8 rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-200"
          aria-label="Close popup"
        >
          x
        </button>

        <div className="pointer-events-none absolute start-1/2 -top-5 sm:-top-10 -translate-x-1/2 -translate-y-1/2">
          <Image src="/offerbox.png" alt="" width={240} height={240} priority />
        </div>

        <div className="text-center mt-4 sm:mt-2">
          <p className="text-[18px] font-rubik font-medium text-[#1f2f54]">Save Up to</p>
          <p className="mt-1 text-[48px] font-rubik font-semibold leading-none text-[#ff1f1f]">{amountLabel}</p>
          <p className="mt-2 text-[19px] font-rubik text-[#1f2f54]">On your next Order</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter Your Email here"
            className="h-12 w-full rounded-md border border-[#d8d8d8] bg-white px-4 text-center text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-md bg-[#111216] text-xl font-rubik font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Sending...' : 'Get Offer'}
          </button>
        </form>

        {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}
        {success && <p className="mt-3 text-center text-sm font-medium text-green-700">{success}</p>}
      </div>
    </div>
  )
}
