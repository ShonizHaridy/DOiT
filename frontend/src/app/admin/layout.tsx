import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/QueryProvider'
import AdminLayout from '@/components/admin/AdminLayout'
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
      <body>
        <QueryProvider>
          <AdminLayout>{children}</AdminLayout>
        </QueryProvider>
      </body>
    </html>
  )
}

/* for ai
"
update it here, as this is the rootlayout for the pages of admin route and there is folders like login and dashboard and stuff, update it please to make it redirect and stuff
"
*/