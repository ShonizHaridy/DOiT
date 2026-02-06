import { QueryProvider } from '@/providers/QueryProvider'
import AdminShell from '@/components/admin/AdminLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  )
}
