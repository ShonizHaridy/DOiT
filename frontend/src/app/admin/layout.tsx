import type { Metadata } from 'next'
import '../globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import AdminGuard from '@/components/admin/AdminGuard'

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
      <body>
        <QueryProvider>
          <AdminGuard>{children}</AdminGuard>
        </QueryProvider>
      </body>
    </html>
  )
}
