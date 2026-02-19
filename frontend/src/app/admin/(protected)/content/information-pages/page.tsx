'use client'

import { useMemo, useState } from 'react'
import DataTable, { type Column } from '@/components/admin/DataTable'
import type { CreateSitePageRequest, InformationPage } from '@/types/content'
import {
  useAdminSitePages,
  useCreateSitePage,
  useDeleteSitePage,
  useUpdateSitePage,
} from '@/hooks/useContent'

type FormState = {
  titleEn: string
  titleAr: string
  slug: string
  contentEn: string
  contentAr: string
  showInFooter: boolean
  order: string
  status: boolean
}

const initialState: FormState = {
  titleEn: '',
  titleAr: '',
  slug: '',
  contentEn: '',
  contentAr: '',
  showInFooter: true,
  order: '0',
  status: true,
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export default function InformationPagesAdminPage() {
  const { data, isLoading, isError } = useAdminSitePages()
  const { mutateAsync: createSitePage, isPending: isCreating } = useCreateSitePage()
  const { mutateAsync: updateSitePage, isPending: isUpdating } = useUpdateSitePage()
  const { mutateAsync: deleteSitePage, isPending: isDeleting } = useDeleteSitePage()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialState)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const pages = useMemo(() => data ?? [], [data])
  const isBusy = isCreating || isUpdating || isDeleting
  const isEditMode = Boolean(editingId)

  const toErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error !== null) {
      const responseData = (error as { response?: { data?: { message?: unknown } } }).response?.data
      const apiMessage = responseData?.message
      if (Array.isArray(apiMessage)) return apiMessage.join(', ')
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) return apiMessage
    }
    if (error instanceof Error && error.message) return error.message
    return fallback
  }

  const reset = () => {
    setEditingId(null)
    setForm(initialState)
  }

  const applyPageToForm = (page: InformationPage) => {
    setEditingId(page.id)
    setForm({
      titleEn: page.titleEn ?? '',
      titleAr: page.titleAr ?? '',
      slug: page.slug ?? '',
      contentEn: page.contentEn ?? '',
      contentAr: page.contentAr ?? '',
      showInFooter: Boolean(page.showInFooter),
      order: String(page.order ?? 0),
      status: Boolean(page.status),
    })
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleDelete = async (id: string) => {
    const confirmed = typeof window === 'undefined' ? true : window.confirm('Delete this page?')
    if (!confirmed) return

    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      await deleteSitePage(id)
      if (editingId === id) {
        reset()
      }
      setSuccessMessage('Page deleted.')
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Failed to delete page.'))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const normalizedSlug = slugify(form.slug || form.titleEn)
    if (!normalizedSlug) {
      setErrorMessage('Slug is required (letters, numbers, hyphens).')
      return
    }

    if (!form.titleEn.trim() || !form.titleAr.trim()) {
      setErrorMessage('Both English and Arabic titles are required.')
      return
    }

    if (!form.contentEn.trim() || !form.contentAr.trim()) {
      setErrorMessage('Both English and Arabic content are required.')
      return
    }

    const payload: CreateSitePageRequest = {
      titleEn: form.titleEn.trim(),
      titleAr: form.titleAr.trim(),
      slug: normalizedSlug,
      contentEn: form.contentEn.trim(),
      contentAr: form.contentAr.trim(),
      showInFooter: form.showInFooter,
      order: Number.isFinite(Number(form.order)) ? Number(form.order) : 0,
      status: form.status,
    }

    try {
      if (isEditMode && editingId) {
        await updateSitePage({ id: editingId, data: payload })
        setSuccessMessage('Page updated.')
      } else {
        await createSitePage(payload)
        setSuccessMessage('Page created.')
      }
      reset()
    } catch (error) {
      setErrorMessage(toErrorMessage(error, 'Failed to save page.'))
    }
  }

  const columns: Column<InformationPage>[] = [
    {
      key: 'titleEn',
      header: 'Title',
      width: 'min-w-[230px]',
      render: (page) => (
        <div>
          <p className="font-medium">{page.titleEn}</p>
          <p className="text-xs text-neutral-500">{page.titleAr}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      width: 'w-[180px]',
      render: (page) => <span className="text-neutral-700">/info/{page.slug}</span>,
    },
    {
      key: 'showInFooter',
      header: 'Footer',
      width: 'w-[120px]',
      render: (page) => (page.showInFooter ? 'Visible' : 'Hidden'),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-[120px]',
      render: (page) => (page.status ? 'Published' : 'Draft'),
    },
    {
      key: 'order',
      header: 'Order',
      width: 'w-[100px]',
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 'w-[170px]',
      render: (page) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => applyPageToForm(page)}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            disabled={isBusy}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(page.id)}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
            disabled={isBusy}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Information Pages</h1>
        <p className="text-sm text-neutral-500 mb-4">
          Manage footer informational pages such as Shipping, Privacy, Terms, Returns and Stores.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={form.titleEn}
              onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))}
              placeholder="Title (English)"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
            <input
              type="text"
              value={form.titleAr}
              onChange={(event) => setForm((current) => ({ ...current, titleAr: event.target.value }))}
              placeholder="Title (Arabic)"
              dir="rtl"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
              placeholder="slug (example: shipping)"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-500">Content (English)</label>
              <textarea
                value={form.contentEn}
                onChange={(event) => setForm((current) => ({ ...current, contentEn: event.target.value }))}
                rows={10}
                className="w-full rounded border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-y"
                placeholder="Use plain rich text. Tip: start section headings with ## and leave a blank line between sections."
                disabled={isBusy}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-500 text-right block">Content (Arabic)</label>
              <textarea
                value={form.contentAr}
                onChange={(event) => setForm((current) => ({ ...current, contentAr: event.target.value }))}
                rows={10}
                dir="rtl"
                className="w-full rounded border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-y"
                placeholder="Use plain rich text. Tip: headings can start with ## and sections can be separated by blank lines."
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="h-11 px-3 rounded border border-neutral-200 text-sm text-neutral-700 inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.showInFooter}
                onChange={(event) => setForm((current) => ({ ...current, showInFooter: event.target.checked }))}
                disabled={isBusy}
              />
              Show in footer
            </label>
            <label className="h-11 px-3 rounded border border-neutral-200 text-sm text-neutral-700 inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.checked }))}
                disabled={isBusy}
              />
              Published
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.order}
              onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
              placeholder="Order"
              className="h-11 rounded border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              disabled={isBusy}
            />
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isBusy}
              className="h-11 px-5 rounded bg-neutral-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {isEditMode ? 'Update Page' : 'Create Page'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={reset}
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
          data={pages}
          keyExtractor={(page) => page.id}
          emptyMessage={
            isLoading ? 'Loading pages...' : isError ? 'Failed to load pages' : 'No pages found'
          }
        />
      </div>
    </div>
  )
}
