'use client'

import { useMemo, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Logo from '@/components/ui/Logo'
import { getLocalized, type Locale } from '@/lib/i18n-utils'
import type { Category } from '@/types/category'

interface FooterProps {
  locale: string
  categories: Category[]
}

interface FooterLink {
  label: string
  href: string
}

/* ── Particle Canvas (optimized) ───────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: -999, y: -999 })

  const initParticles = useCallback((w: number, h: number) => {
    const COUNT = 65
    const particles: {
      x: number; y: number
      baseVx: number; baseVy: number
      vx: number; vy: number
      r: number
      color: [number, number, number]
    }[] = []

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.3 + Math.random() * 0.5
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: 0,
        vy: 0,
        r: 1.5 + Math.random() * 2,
        color: Math.random() > 0.5 ? [255, 60, 60] : [0, 204, 173],
      })
    }
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = canvas.width = rect.width * dpr
      h = canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const particles = initParticles(w / dpr, h / dpr)
    const rw = () => w / dpr
    const rh = () => h / dpr
    const CONNECTION_DIST = 120
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
    const MOUSE_DIST = 130
    const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST

    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }
    window.addEventListener('resize', handleResize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    const handleLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
    }
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleLeave)

    const draw = () => {
      const realW = rw()
      const realH = rh()
      ctx.clearRect(0, 0, realW, realH)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // baseV = constant drift (never stops), vx/vy = reactive (decays)
        p.x += p.baseVx + p.vx
        p.y += p.baseVy + p.vy

        // Only the mouse-push part fades out
        p.vx *= 0.92
        p.vy *= 0.92

        // Wrap edges
        if (p.x < -10) p.x = realW + 10
        else if (p.x > realW + 10) p.x = -10
        if (p.y < -10) p.y = realH + 10
        else if (p.y > realH + 10) p.y = -10

        // Mouse repel (squared distance check first, sqrt only when needed)
        const dx = p.x - mx
        const dy = p.y - my
        const distSq = dx * dx + dy * dy
        if (distSq < MOUSE_DIST_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / MOUSE_DIST) * 1.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }

      // Draw glow pass (larger transparent circles, NO shadowBlur)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const [r, g, b] = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.12)`
        ctx.fill()
      }

      // Draw core dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const [r, g, b] = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`
        ctx.fill()
      }

      // Connection lines (squared distance avoids sqrt)
      ctx.lineWidth = 0.8
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const ddx = p.x - q.x
          const ddy = p.y - q.y
          const distSq = ddx * ddx + ddy * ddy
          if (distSq < CONNECTION_DIST_SQ) {
            const alpha = (1 - distSq / CONNECTION_DIST_SQ) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ cursor: 'crosshair' }}
    />
  )
}

/* ── Footer ────────────────────────────────────────────────────────── */
export default function FooterParticles({ locale, categories }: FooterProps) {
  const t = useTranslations('footer')

  const categoryLinks = useMemo<FooterLink[]>(() => {
    const backendLinks = (categories ?? [])
      .filter((category) => category.status)
      .slice(0, 5)
      .map((category) => {
        const name = getLocalized(category, 'name', locale as Locale)
        return { label: name, href: `/${name.toLowerCase()}` }
      })
    if (backendLinks.length > 0) return backendLinks
    return [
      { label: t('categoryItems.men'), href: '/men' },
      { label: t('categoryItems.women'), href: '/women' },
      { label: t('categoryItems.kids'), href: '/kids' },
      { label: t('categoryItems.accessories'), href: '/accessories' },
      { label: t('categoryItems.sports'), href: '/sport' },
    ]
  }, [categories, locale, t])

  const serviceLinks: FooterLink[] = [
    { label: t('serviceItems.locate'), href: '/stores' },
    { label: t('serviceItems.returns'), href: '/returns' },
    { label: t('serviceItems.shipping'), href: '/shipping' },
    { label: t('serviceItems.privacy'), href: '/privacy' },
    { label: t('serviceItems.terms'), href: '/terms' },
  ]

  return (
    <footer className="relative overflow-hidden bg-graphite text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/3 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-[#00CCAD]/20 blur-3xl" />
      </div>

      <ParticleCanvas />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* ========== MOBILE ========== */}
        <div className="lg:hidden py-4 px-4">
          <div className="flex flex-col items-start gap-4">
            <div className="mb-4">
              <Logo className="w-[145px] h-[50px]" />
            </div>

            <div className="flex items-start gap-8 w-full">
              {/* Categories */}
              <div className="flex flex-col items-start gap-4">
                <h3 className="text-[#FEFEFD] text-sm font-roboto font-medium leading-tight">
                  {t('categories')}
                </h3>
                <div className="flex flex-col items-start gap-2">
                  {categoryLinks.map((item) => (
                    <Link
                      key={`mob-cat-${item.href}`}
                      href={item.href}
                      locale={locale}
                      className="py-2 text-[#F5F5F1] text-xs font-roboto font-normal leading-tight hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-col items-start gap-4 flex-1">
                <h3 className="text-[#FEFEFD] text-sm font-roboto font-medium leading-tight">
                  {t('services')}
                </h3>
                <div className="flex flex-col items-start gap-2">
                  {serviceLinks.map((item) => (
                    <Link
                      key={`mob-svc-${item.href}`}
                      href={item.href}
                      locale={locale}
                      className="py-2 text-[#F5F5F1] text-xs font-roboto font-normal leading-tight hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Social + Copyright */}
            <div className="flex flex-col items-start gap-2 w-full mt-6">
              <div className="flex py-2 justify-center items-center gap-6 w-full">
                <SocialIcon href="#" label="Facebook" type="facebook" />
                <SocialIcon href="#" label="Instagram" type="instagram" />
                <SocialIcon href="#" label="LinkedIn" type="linkedin" />
              </div>

              <div className="w-full h-px bg-white my-2" />

              <div className="flex justify-between items-start w-full text-xs">
                <div className="text-white text-center">
                  <span className="font-normal">© 2026 </span>
                  <span className="font-bold">DOiT</span>
                  <span className="font-normal"> All rights reserved.</span>
                </div>
                <div className="text-white text-center">
                  <span className="font-normal">Powered by </span>
                  <span className="font-bold text-[#00CCAD]">NOVIX CODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== DESKTOP ========== */}
        <div className="hidden lg:block container-doit py-14">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-10">
            <div className="space-y-6">
              <Logo size="lg" />

              <p className="max-w-xl text-sm leading-6 text-white/80">
                DOiT is a sportswear platform built for movement. We combine clean design,
                durable materials and custom-order flexibility so every athlete gets the fit,
                comfort and style they need.
              </p>

              <div className="flex items-center gap-3">
                <SocialIcon href="#" label="Facebook" type="facebook" />
                <SocialIcon href="#" label="Instagram" type="instagram" />
                <SocialIcon href="#" label="LinkedIn" type="linkedin" />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
                {t('categories')}
              </h3>
              <ul className="space-y-2.5">
                {categoryLinks.map((item) => (
                  <li key={`desk-cat-${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      locale={locale}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
                {t('services')}
              </h3>
              <ul className="space-y-2.5">
                {serviceLinks.map((item) => (
                  <li key={`desk-svc-${item.href}`}>
                    <Link
                      href={item.href}
                      locale={locale}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/20 pt-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 <span className="font-bold">DOiT</span> All rights reserved.</p>
            <p>
              Powered by <span className="font-semibold text-[#00CCAD]">NOVIX CODE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({
  href,
  label,
  type,
}: {
  href: string
  label: string
  type: 'facebook' | 'instagram' | 'linkedin'
}) {
  const icons = {
    facebook: (
      <path d="M11.9998 0C5.37253 0 0 5.39238 0 12.0441C0 17.6923 3.87448 22.4319 9.1011 23.7336V15.7248H6.62675V12.0441H9.1011V10.4581C9.1011 6.35879 10.9495 4.45872 14.9594 4.45872C15.7197 4.45872 17.0315 4.60855 17.5681 4.75789V8.0941C17.2849 8.06423 16.7929 8.0493 16.1819 8.0493C14.2144 8.0493 13.4541 8.79748 13.4541 10.7424V12.0441H17.3737L16.7003 15.7248H13.4541V24C19.3959 23.2798 24 18.202 24 12.0441C23.9995 5.39238 18.627 0 11.9998 0Z" />
    ),
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  }

  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-white/50 hover:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        {icons[type]}
      </svg>
    </a>
  )
}