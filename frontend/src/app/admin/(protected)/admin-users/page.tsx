'use client'

import { useMemo, useState } from 'react'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { getAdminAuthSnapshot } from '@/lib/auth-storage'
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from '@/hooks/useAdminUsers'
import type { AdminLevel, AdminUser } from '@/types/admin-user'
import { ProfileCircle } from 'iconsax-reactjs'

type FormState = {
  adminId: string
  email: string
  password: string
  adminLevel: AdminLevel
}

const initialFormState: FormState = {
  adminId: '',
  email: '',
  password: '',
  adminLevel: 'ADMIN',
}

export default function AdminUsersPage() {
  const snapshot = getAdminAuthSnapshot()
  const isSuperAdmin = snapshot.adminLevel === 'SUPER_ADMIN' || snapshot.adminLevel === null

  const { data, isLoading, isError } = useAdminUsers(isSuperAdmin)
  const { mutateAsync: createAdminUser, isPending: isCreating } = useCreateAdminUser()
  const { mutateAsync: updateAdminUser, isPending: isUpdating } = useUpdateAdminUser()
  const { mutateAsync: deleteAdminUser, isPending: isDeleting } = useDeleteAdminUser()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const admins = useMemo(() => data ?? [], [data])
  const isBusy = isCreating || isUpdating || isDeleting
  const isEditMode = Boolean(editingId)

  const formatError = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null) {
      const responseData = (error as { response?: { data?: { message?: unknown } } }).response?.data
      const apiMessage = responseData?.message
      if (Array.isArray(apiMessage)) return apiMessage.join(', ')
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) return apiMessage
    }
    if (error instanceof Error && error.message) return error.message
    return fallback
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(initialFormState)
  }

  const handleEdit = (admin: AdminUser) => {
    setEditingId(admin.id)
    setForm({
      adminId: admin.adminId,
      email: admin.email,
      password: '',
      adminLevel: admin.adminLevel,
    })
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleDelete = async (admin: AdminUser) => {
    if (admin.id === snapshot.user?.id) {
      setErrorMessage('You cannot delete your own admin account.')
      return
    }

    const confirmed = typeof window === 'undefined' ? true : window.confirm(`Delete admin "${admin.adminId}"?`)
    if (!confirmed) return

    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      await deleteAdminUser(admin.id)
      if (editingId === admin.id) {
        resetForm()
      }
      setSuccessMessage('Admin account deleted.')
    } catch (error) {
      setErrorMessage(formatError(error, 'Failed to delete admin account.'))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!form.adminId.trim() || !form.email.trim()) {
      setErrorMessage('Admin ID and email are required.')
      return
    }

    if (!isEditMode && !form.password.trim()) {
      setErrorMessage('Password is required when creating a new admin.')
      return
    }

    try {
      if (isEditMode && editingId) {
        await updateAdminUser({
          id: editingId,
          payload: {
            adminId: form.adminId.trim(),
            email: form.email.trim(),
            adminLevel: form.adminLevel,
            ...(form.password.trim() ? { password: form.password } : {}),
          },
        })
        setSuccessMessage('Admin account updated.')
      } else {
        await createAdminUser({
          adminId: form.adminId.trim(),
          email: form.email.trim(),
          password: form.password,
          adminLevel: form.adminLevel,
        })
        setSuccessMessage('Admin account created.')
      }
      resetForm()
    } catch (error) {
      setErrorMessage(formatError(error, 'Failed to save admin account.'))
    }
  }

  const columns: Column<AdminUser>[] = [
    {
      key: 'avatar',
      header: 'User',
      width: 'w-[90px]',
      render: () => (
        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
          <ProfileCircle size={18} className="text-neutral-500" />
        </div>
      ),
    },
    {
      key: 'adminId',
      header: 'Admin ID',
      width: 'min-w-[180px]',
    },
    {
      key: 'email',
      header: 'Email',
      width: 'min-w-[260px]',
    },
    {
      key: 'adminLevel',
      header: 'Level',
      width: 'w-[150px]',
      render: (admin) => (
        <span className="inline-flex px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 text-xs font-medium">
          {admin.adminLevel === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: 'w-[170px]',
      render: (admin) => new Date(admin.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 'w-[180px]',
      render: (admin) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleEdit(admin)}
            disabled={isBusy}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(admin)}
            disabled={isBusy || admin.id === snapshot.user?.id}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin Users</h1>
          <p className="text-sm text-neutral-600">Only super admins can manage admin accounts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Admin Users</h1>
        <p className="text-sm text-neutral-500 mb-4">
          {isEditMode
            ? 'Update admin account information. Leave password empty to keep it unchanged.'
            : 'Create an admin account. Only super admins can access this section.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={form.adminId}
              onChange={(event) => setForm((current) => ({ ...current, adminId: event.target.value }))}
              placeholder="Admin ID"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder={isEditMode ? 'New password (optional)' : 'Password'}
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
            <select
              value={form.adminLevel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  adminLevel: event.target.value as AdminLevel,
                }))
              }
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isBusy}
              className="h-11 px-5 rounded bg-neutral-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {isEditMode ? 'Update Admin' : 'Create Admin'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isBusy}
                className="h-11 px-5 rounded border border-neutral-900 text-neutral-900 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg p-4">
        <DataTable
          columns={columns}
          data={admins}
          keyExtractor={(admin) => admin.id}
          emptyMessage={
            isLoading ? 'Loading admin users...' : isError ? 'Failed to load admin users' : 'No admins found'
          }
        />
      </div>
    </div>
  )
}
