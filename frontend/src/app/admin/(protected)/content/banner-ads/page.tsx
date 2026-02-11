'use client'

import { useEffect, useState } from 'react'
import { FormPageHeader, ImageUpload, UploadedImage } from '@/components/admin/forms'
import { Add } from 'iconsax-reactjs'
import { useBannerAds, useCreateBannerAd, useUpdateBannerAd, useDeleteBannerAd } from '@/hooks/useContent'
import { uploadBannerImage } from '@/services/upload'

interface BannerFormItem {
  id: string
  titleEn: string
  titleAr: string
  link: string
  image: UploadedImage[]
}

export default function EditBannerAdsPage() {
  const { data: bannersData } = useBannerAds()
  const { mutateAsync: createBanner } = useCreateBannerAd()
  const { mutateAsync: updateBanner } = useUpdateBannerAd()
  const { mutateAsync: deleteBanner } = useDeleteBannerAd()

  const [banners, setBanners] = useState<BannerFormItem[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bannersData) return
    setBanners(
      bannersData.map((banner) => ({
        id: banner.id,
        titleEn: banner.titleEn ?? '',
        titleAr: banner.titleAr ?? '',
        link: banner.link ?? '',
        image: banner.imageUrl
          ? [{ id: banner.id, url: banner.imageUrl, name: banner.imageUrl.split('/').pop() ?? 'banner' }]
          : [],
      }))
    )
  }, [bannersData])

  const updateBannerField = (index: number, field: keyof BannerFormItem, value: string | UploadedImage[]) => {
    const updated = [...banners]
    updated[index] = { ...updated[index], [field]: value }
    setBanners(updated)
  }

  const addBanner = () => {
    setBanners([
      ...banners,
      { id: `temp-${Date.now()}`, titleEn: '', titleAr: '', link: '', image: [] },
    ])
  }

  const removeBanner = (index: number) => {
    const banner = banners[index]
    if (banner && !banner.id.startsWith('temp-')) {
      setRemovedIds((prev) => [...prev, banner.id])
    }
    setBanners(banners.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)

    for (const id of removedIds) {
      await deleteBanner(id)
    }

    for (const banner of banners) {
      let imageUrl = banner.image[0]?.url
      if (banner.image[0]?.file) {
        imageUrl = await uploadBannerImage(banner.image[0].file)
      }

      if (banner.id.startsWith('temp-')) {
        await createBanner({ imageUrl: imageUrl ?? '', titleEn: banner.titleEn, titleAr: banner.titleAr, link: banner.link })
      } else {
        await updateBanner({ id: banner.id, data: { imageUrl: imageUrl ?? '', titleEn: banner.titleEn, titleAr: banner.titleAr, link: banner.link } })
      }
    }

    setRemovedIds([])
    setSaving(false)
  }

  return (
    <div className="p-6">
      <FormPageHeader
        title="Edit Banner Ads Carousel Section"
        backHref="/admin/content"
        onSave={handleSave}
        isSubmitting={saving}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary">Banner {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeBanner(index)}
                className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Title (EN)</label>
                <input
                  type="text"
                  value={banner.titleEn}
                  onChange={(e) => updateBannerField(index, 'titleEn', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Title (AR)</label>
                <input
                  type="text"
                  value={banner.titleAr}
                  onChange={(e) => updateBannerField(index, 'titleAr', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Link</label>
                <input
                  type="text"
                  value={banner.link}
                  onChange={(e) => updateBannerField(index, 'link', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
            </div>

            <div className="mt-4">
              <ImageUpload
                label="Banner Image"
                value={banner.image}
                onChange={(images) => updateBannerField(index, 'image', images)}
                maxImages={1}
                single
                maxSizeMB={10}
                allowedTypes={['png', 'jpg', 'jpeg']}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addBanner}
          className="bg-white rounded-lg border-2 border-dashed border-neutral-200 p-6 flex items-center justify-center gap-2 text-sm text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 transition-colors min-h-[200px]"
        >
          <Add size={20} />
          Add Banner
        </button>
      </div>
    </div>
  )
}
