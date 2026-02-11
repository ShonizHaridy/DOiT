'use client'

import { useEffect, useState } from 'react'
import { FormPageHeader, ImageUpload, UploadedImage } from '@/components/admin/forms'
import { Add } from 'iconsax-reactjs'
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from '@/hooks/useContent'
import { uploadVendorLogo } from '@/services/upload'

interface VendorFormItem {
  id: string
  name: string
  logo: UploadedImage[]
}

export default function EditVendorsSectionPage() {
  const { data: vendorsData } = useVendors()
  const { mutateAsync: createVendor } = useCreateVendor()
  const { mutateAsync: updateVendor } = useUpdateVendor()
  const { mutateAsync: deleteVendor } = useDeleteVendor()

  const [vendors, setVendors] = useState<VendorFormItem[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!vendorsData) return
    setVendors(
      vendorsData.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        logo: vendor.logoUrl
          ? [{ id: vendor.id, url: vendor.logoUrl, name: vendor.logoUrl.split('/').pop() ?? vendor.name }]
          : [],
      }))
    )
  }, [vendorsData])

  const updateVendorField = (index: number, field: keyof VendorFormItem, value: string | UploadedImage[]) => {
    const updated = [...vendors]
    updated[index] = { ...updated[index], [field]: value }
    setVendors(updated)
  }

  const addVendor = () => {
    setVendors([
      ...vendors,
      { id: `temp-${Date.now()}`, name: '', logo: [] },
    ])
  }

  const removeVendor = (index: number) => {
    const vendor = vendors[index]
    if (vendor && !vendor.id.startsWith('temp-')) {
      setRemovedIds((prev) => [...prev, vendor.id])
    }
    setVendors(vendors.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)

    for (const id of removedIds) {
      await deleteVendor(id)
    }

    for (const vendor of vendors) {
      let logoUrl = vendor.logo[0]?.url
      if (vendor.logo[0]?.file) {
        logoUrl = await uploadVendorLogo(vendor.logo[0].file)
      }

      if (vendor.id.startsWith('temp-')) {
        await createVendor({ name: vendor.name, logoUrl: logoUrl ?? '' })
      } else {
        await updateVendor({ id: vendor.id, data: { name: vendor.name, logoUrl: logoUrl ?? '' } })
      }
    }

    setRemovedIds([])
    setSaving(false)
  }

  return (
    <div className="p-6">
      <FormPageHeader
        title="Edit Vendors Section"
        backHref="/admin/content"
        onSave={handleSave}
        isSubmitting={saving}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vendors.map((vendor, index) => (
          <div key={vendor.id} className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">Vendor {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeVendor(index)}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Vendor Name</label>
              <input
                type="text"
                value={vendor.name}
                onChange={(e) => updateVendorField(index, 'name', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="Vendor name"
              />
            </div>

            <ImageUpload
              label="Logo"
              value={vendor.logo}
              onChange={(images) => updateVendorField(index, 'logo', images)}
              maxImages={1}
              single
              maxSizeMB={10}
              allowedTypes={['png', 'jpg', 'jpeg']}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addVendor}
          className="bg-white rounded-lg border-2 border-dashed border-neutral-200 p-6 flex items-center justify-center gap-2 text-sm text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors min-h-[200px]"
        >
          <Add size={20} />
          Add Vendor
        </button>
      </div>
    </div>
  )
}
