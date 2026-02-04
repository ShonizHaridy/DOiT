'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer')

  const categories = [
    { key: 'men', href: `/${locale}/men` },
    { key: 'women', href: `/${locale}/women` },
    { key: 'kids', href: `/${locale}/kids` },
    { key: 'accessories', href: `/${locale}/accessories` },
    { key: 'sports', href: `/${locale}/sport` },
  ]

  const services = [
    { key: 'locate', href: `/${locale}/stores` },
    { key: 'returns', href: `/${locale}/returns` },
    { key: 'shipping', href: `/${locale}/shipping` },
    { key: 'privacy', href: `/${locale}/privacy` },
    { key: 'terms', href: `/${locale}/terms` },
  ]

  return (
    <footer className="bg-graphite">
      {/* Mobile Footer - EXACT ORIGINAL */}
      <div className="lg:hidden py-4 px-4">
        <div className="flex flex-col items-start gap-4">
          {/* Logo */}
          <div className="mb-4">
            <Logo className="w-[145px] h-[50px]" />
          </div>

          {/* Links */}
          <div className="flex items-start gap-8 w-full">
            {/* Categories */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-[#FEFEFD] text-sm font-roboto font-medium leading-tight">
                {t('categories')}
              </h3>
              <div className="flex flex-col items-start gap-2">
                {categories.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="py-2 text-[#F5F5F1] text-xs font-roboto font-normal leading-tight hover:text-primary transition-colors"
                  >
                    {t(`categoryItems.${item.key}`)}
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
                {services.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="py-2 text-[#F5F5F1] text-xs font-roboto font-normal leading-tight hover:text-primary transition-colors"
                  >
                    {t(`serviceItems.${item.key}`)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-start gap-2 w-full mt-6">
            <div className="flex py-2 justify-center items-center gap-6 w-full">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="text-[#F3F3EE] hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9998 0C5.37253 0 0 5.39238 0 12.0441C0 17.6923 3.87448 22.4319 9.1011 23.7336V15.7248H6.62675V12.0441H9.1011V10.4581C9.1011 6.35879 10.9495 4.45872 14.9594 4.45872C15.7197 4.45872 17.0315 4.60855 17.5681 4.75789V8.0941C17.2849 8.06423 16.7929 8.0493 16.1819 8.0493C14.2144 8.0493 13.4541 8.79748 13.4541 10.7424V12.0441H17.3737L16.7003 15.7248H13.4541V24C19.3959 23.2798 24 18.202 24 12.0441C23.9995 5.39238 18.627 0 11.9998 0Z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp" className="text-[#F3F3EE] hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 24L1.687 17.837C0.645998 16.033 0.0989998 13.988 0.0999998 11.891C0.103 5.335 5.43799 0 11.993 0C15.174 0.001 18.16 1.24 20.406 3.488C22.6509 5.736 23.8869 8.724 23.8859 11.902C23.8829 18.459 18.548 23.794 11.993 23.794C10.003 23.793 8.04198 23.294 6.30499 22.346L0 24ZM6.59698 20.193C8.27298 21.188 9.87298 21.784 11.989 21.785C17.437 21.785 21.875 17.351 21.878 11.9C21.88 6.438 17.463 2.01 11.997 2.008C6.54498 2.008 2.11 6.442 2.108 11.892C2.107 14.117 2.75899 15.783 3.85399 17.526L2.85499 21.174L6.59698 20.193ZM17.984 14.729C17.91 14.605 17.712 14.531 17.414 14.382C17.117 14.233 15.656 13.514 15.383 13.415C15.111 13.316 14.913 13.266 14.714 13.564C14.516 13.861 13.946 14.531 13.773 14.729C13.6 14.927 13.426 14.952 13.129 14.803C12.832 14.654 11.874 14.341 10.739 13.328C9.85598 12.54 9.25898 11.567 9.08598 11.269C8.91298 10.972 9.06798 10.811 9.21598 10.663C9.34998 10.53 9.51298 10.316 9.66198 10.142C9.81298 9.97 9.86198 9.846 9.96198 9.647C10.061 9.449 10.012 9.275 9.93698 9.126C9.86198 8.978 9.26798 7.515 9.02098 6.92C8.77898 6.341 8.53398 6.419 8.35198 6.41L7.78198 6.4C7.58398 6.4 7.26198 6.474 6.98998 6.772C6.71798 7.07 5.94999 7.788 5.94999 9.251C5.94999 10.714 7.01498 12.127 7.16298 12.325C7.31198 12.523 9.25798 15.525 12.239 16.812C12.948 17.118 13.502 17.301 13.933 17.438C14.645 17.664 15.293 17.632 15.805 17.556C16.376 17.471 17.563 16.837 17.811 16.143C18.059 15.448 18.059 14.853 17.984 14.729Z" />
                </svg>
              </a>

              {/* Telegram */}
              <a href="#" aria-label="Telegram" className="text-[#F3F3EE] hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.5378 5.01092C12.3883 5.90497 8.09231 7.75543 1.64987 10.5623C0.603723 10.9783 0.055703 11.3853 0.00581426 11.7832C-0.078499 12.4558 0.76372 12.7206 1.9106 13.0813C2.06661 13.1303 2.22826 13.1811 2.39397 13.235C3.52233 13.6018 5.04018 14.0309 5.82924 14.0479C6.545 14.0634 7.34386 13.7683 8.22584 13.1627C14.2452 9.09945 17.3524 7.04569 17.5475 7.00142C17.6851 6.97018 17.8759 6.93091 18.0051 7.04576C18.1343 7.16061 18.1216 7.37812 18.1079 7.43647C18.0245 7.79216 14.7184 10.8657 13.0076 12.4563C12.4742 12.9522 12.0959 13.3039 12.0185 13.3842C11.8453 13.5642 11.6687 13.7344 11.499 13.898C10.4507 14.9085 9.66464 15.6663 11.5425 16.9038C12.445 17.4985 13.1671 17.9903 13.8876 18.4809C14.6743 19.0167 15.4591 19.5511 16.4744 20.2167C16.7331 20.3863 16.9801 20.5624 17.2208 20.7339C18.1364 21.3867 18.959 21.9731 19.9753 21.8796C20.5658 21.8253 21.1758 21.27 21.4856 19.6139C22.2177 15.7001 23.6567 7.21999 23.9893 3.72555C24.0185 3.41939 23.9818 3.02757 23.9524 2.85557C23.9229 2.68357 23.8614 2.43851 23.6379 2.25709C23.3731 2.04224 22.9643 1.99694 22.7815 2.00016C21.9503 2.0148 20.675 2.45823 14.5378 5.01092Z" />
                </svg>
              </a>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white my-2" />

            {/* Copyright */}
            <div className="flex justify-between items-start w-full text-xs">
              <div className="text-white text-center">
                <span className="font-normal">© 2026 </span>
                <span className="font-bold">DoiT</span>
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

      {/* Desktop Footer */}
      <div className="hidden lg:block py-9 px-18">
        <div className="px-28">
          <div className="flex gap-16 mb-10">
            {/* Logo & Description */}
            <div className="max-w-xs">
              <Logo size="lg" className="mb-4" />
              <p className="text-text-footer-sub text-sm font-inter leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Mi nibh venenatis in suscipit turpis enim cursus vulputate amet. Lobortis mi platea aliquam senectus tempus mauris neque.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-6">
                <SocialIcon type="facebook" />
                <SocialIcon type="instagram" />
                <SocialIcon type="linkedin" />
              </div>
            </div>

            <div className="flex gap-24">
              {/* Categories */}
              <div className="flex flex-col gap-5">
                <h3 className="text-text-footer text-xl font-inter font-medium">
                  Categories
                </h3>
                <div className="flex flex-col gap-5">
                  {categories.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="text-text-footer-sub text-sm font-inter hover:text-white transition-colors"
                    >
                      {t(`categoryItems.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Us */}
              <div className="flex flex-col gap-5">
                <h3 className="text-text-footer text-xl font-inter font-medium">
                  Contact us
                </h3>
                <div className="flex flex-col gap-5">
                  <span className="text-text-footer-sub text-sm font-roboto">Lurim epsom</span>
                  <span className="text-text-footer-sub text-sm font-roboto">Lurim epsom</span>
                  <span className="text-text-footer-sub text-sm font-roboto">Lurim epsom</span>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-col gap-5">
                <h3 className="text-text-footer text-xl font-inter font-medium">
                  Services
                </h3>
                <div className="flex flex-col gap-5">
                  {services.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="text-text-footer-sub text-sm font-inter hover:text-white transition-colors"
                    >
                      {t(`serviceItems.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white mb-6" />

          {/* Copyright */}
          <div className="flex justify-between items-center text-sm text-white">
            <span>© 2026 <span className="font-bold">DoiT</span> All rights reserved.</span>
            <span>Powered by <span className="font-bold text-[#00CCAD]">NOVIX CODE</span></span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ type }: { type: 'facebook' | 'whatsapp' | 'telegram' | 'instagram' | 'linkedin' }) {
  const icons = {
    facebook: (
      <path d="M11.9998 0C5.37253 0 0 5.39238 0 12.0441C0 17.6923 3.87448 22.4319 9.1011 23.7336V15.7248H6.62675V12.0441H9.1011V10.4581C9.1011 6.35879 10.9495 4.45872 14.9594 4.45872C15.7197 4.45872 17.0315 4.60855 17.5681 4.75789V8.0941C17.2849 8.06423 16.7929 8.0493 16.1819 8.0493C14.2144 8.0493 13.4541 8.79748 13.4541 10.7424V12.0441H17.3737L16.7003 15.7248H13.4541V24C19.3959 23.2798 24 18.202 24 12.0441C23.9995 5.39238 18.627 0 11.9998 0Z" />
    ),
    whatsapp: (
      <path d="M0 24L1.687 17.837C0.645998 16.033 0.0989998 13.988 0.0999998 11.891C0.103 5.335 5.43799 0 11.993 0C15.174 0.001 18.16 1.24 20.406 3.488C22.6509 5.736 23.8869 8.724 23.8859 11.902C23.8829 18.459 18.548 23.794 11.993 23.794C10.003 23.793 8.04198 23.294 6.30499 22.346L0 24ZM6.59698 20.193C8.27298 21.188 9.87298 21.784 11.989 21.785C17.437 21.785 21.875 17.351 21.878 11.9C21.88 6.438 17.463 2.01 11.997 2.008C6.54498 2.008 2.11 6.442 2.108 11.892C2.107 14.117 2.75899 15.783 3.85399 17.526L2.85499 21.174L6.59698 20.193ZM17.984 14.729C17.91 14.605 17.712 14.531 17.414 14.382C17.117 14.233 15.656 13.514 15.383 13.415C15.111 13.316 14.913 13.266 14.714 13.564C14.516 13.861 13.946 14.531 13.773 14.729C13.6 14.927 13.426 14.952 13.129 14.803C12.832 14.654 11.874 14.341 10.739 13.328C9.85598 12.54 9.25898 11.567 9.08598 11.269C8.91298 10.972 9.06798 10.811 9.21598 10.663C9.34998 10.53 9.51298 10.316 9.66198 10.142C9.81298 9.97 9.86198 9.846 9.96198 9.647C10.061 9.449 10.012 9.275 9.93698 9.126C9.86198 8.978 9.26798 7.515 9.02098 6.92C8.77898 6.341 8.53398 6.419 8.35198 6.41L7.78198 6.4C7.58398 6.4 7.26198 6.474 6.98998 6.772C6.71798 7.07 5.94999 7.788 5.94999 9.251C5.94999 10.714 7.01498 12.127 7.16298 12.325C7.31198 12.523 9.25798 15.525 12.239 16.812C12.948 17.118 13.502 17.301 13.933 17.438C14.645 17.664 15.293 17.632 15.805 17.556C16.376 17.471 17.563 16.837 17.811 16.143C18.059 15.448 18.059 14.853 17.984 14.729Z" />
    ),
    telegram: (
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5378 5.01092C12.3883 5.90497 8.09231 7.75543 1.64987 10.5623C0.603723 10.9783 0.055703 11.3853 0.00581426 11.7832C-0.078499 12.4558 0.76372 12.7206 1.9106 13.0813C2.06661 13.1303 2.22826 13.1811 2.39397 13.235C3.52233 13.6018 5.04018 14.0309 5.82924 14.0479C6.545 14.0634 7.34386 13.7683 8.22584 13.1627C14.2452 9.09945 17.3524 7.04569 17.5475 7.00142C17.6851 6.97018 17.8759 6.93091 18.0051 7.04576C18.1343 7.16061 18.1216 7.37812 18.1079 7.43647C18.0245 7.79216 14.7184 10.8657 13.0076 12.4563C12.4742 12.9522 12.0959 13.3039 12.0185 13.3842C11.8453 13.5642 11.6687 13.7344 11.499 13.898C10.4507 14.9085 9.66464 15.6663 11.5425 16.9038C12.445 17.4985 13.1671 17.9903 13.8876 18.4809C14.6743 19.0167 15.4591 19.5511 16.4744 20.2167C16.7331 20.3863 16.9801 20.5624 17.2208 20.7339C18.1364 21.3867 18.959 21.9731 19.9753 21.8796C20.5658 21.8253 21.1758 21.27 21.4856 19.6139C22.2177 15.7001 23.6567 7.21999 23.9893 3.72555C24.0185 3.41939 23.9818 3.02757 23.9524 2.85557C23.9229 2.68357 23.8614 2.43851 23.6379 2.25709C23.3731 2.04224 22.9643 1.99694 22.7815 2.00016C21.9503 2.0148 20.675 2.45823 14.5378 5.01092Z" />
    ),
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  }

  return (
    <a href="#" aria-label={type} className="text-text-footer-sub hover:text-white transition-colors">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        {icons[type]}
      </svg>
    </a>
  )
}