import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | DOiT Admin',
    default: 'DOiT Admin Dashboard',
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
