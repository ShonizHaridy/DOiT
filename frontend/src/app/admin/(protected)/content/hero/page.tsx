'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput, FormTextarea, FormPageHeader, ImageUpload, UploadedImage } from '@/components/admin/forms'
import { useHeroSections, useCreateHeroSection, useUpdateHeroSection } from '@/hooks/useContent'
import { uploadHeroImage } from '@/services/upload'

interface HeroFormData {
  headlineEn: string
  headlineAr: string
  descriptionEn: string
  descriptionAr: string
  priceEn: string
  priceAr: string
}

const parseNumber = (value?: string) => {
  if (!value) return undefined
  const parsed = Number(value.replace(/[^\d.]/g, ''))
  return Number.isNaN(parsed) ? undefined : parsed
}

export default function EditHeroSectionPage() {
  const { data: heroSections } = useHeroSections()
  const { mutateAsync: createHero } = useCreateHeroSection()
  const { mutateAsync: updateHero, isPending } = useUpdateHeroSection()

  const activeHero = heroSections?.[0]
  const [mainFigure, setMainFigure] = useState<UploadedImage[]>([])
  const [variants, setVariants] = useState<UploadedImage[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<HeroFormData>({
    defaultValues: {
      headlineEn: '',
      headlineAr: '',
      descriptionEn: '',
      descriptionAr: '',
      priceEn: '',
      priceAr: '',
    }
  })

  useEffect(() => {
    if (!activeHero) return
    reset({
      headlineEn: activeHero.headlineEn,
      headlineAr: activeHero.headlineAr,
      descriptionEn: activeHero.descriptionEn ?? '',
      descriptionAr: activeHero.descriptionAr ?? '',
      priceEn: activeHero.price?.toString() ?? '',
      priceAr: activeHero.price?.toString() ?? '',
    })
    setMainFigure(activeHero.mainImageUrl ? [{
      id: 'main',
      url: activeHero.mainImageUrl,
      name: activeHero.mainImageUrl.split('/').pop() ?? 'hero',
    }] : [])
    setVariants((activeHero.variantImages ?? []).map((url, index) => ({
      id: `variant-${index}`,
      url,
      name: url.split('/').pop() ?? `variant-${index}`,
    })))
  }, [activeHero, reset])

  const onSubmit = async (data: HeroFormData) => {
    let mainImageUrl = mainFigure[0]?.url
    if (mainFigure[0]?.file) {
      mainImageUrl = await uploadHeroImage(mainFigure[0].file)
    }

    const newVariantFiles = variants.filter((img) => img.file).map((img) => img.file!)
    const newVariantUrls = newVariantFiles.length
      ? await Promise.all(newVariantFiles.map((file) => uploadHeroImage(file)))
      : []
    const existingVariantUrls = variants.filter((img) => !img.file).map((img) => img.url)
    const allVariants = [...existingVariantUrls, ...newVariantUrls]

    const payload = {
      headlineEn: data.headlineEn,
      headlineAr: data.headlineAr,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      price: parseNumber(data.priceEn) ?? parseNumber(data.priceAr) ?? undefined,
      mainImageUrl: mainImageUrl ?? '',
      variantImages: allVariants,
      status: true,
    }

    if (activeHero?.id) {
      await updateHero({ id: activeHero.id, data: payload })
    } else {
      await createHero(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <FormPageHeader
        title="Edit Hero Section"
        backHref="/admin/content"
        isSubmitting={isPending}
      />

      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                <span className="text-base">EN</span>
                <span className="font-medium">English</span>
              </div>

              <FormInput
                label="Headline"
                placeholder="Enter headline"
                error={errors.headlineEn}
                {...register('headlineEn')}
              />

              <FormTextarea
                label="Description"
                placeholder="Enter description"
                rows={4}
                error={errors.descriptionEn}
                {...register('descriptionEn')}
              />

              <FormInput
                label="Price"
                placeholder="0 EGP"
                error={errors.priceEn}
                {...register('priceEn')}
              />
            </div>

            <div className="space-y-4" dir="rtl">
              <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                <span className="font-medium">Arabic</span>
                <span className="text-base">AR</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-900 text-right">العنوان الرئيسي</label>
                <input
                  type="text"
                  dir="rtl"
                  className="h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  {...register('headlineAr')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-900 text-right">الوصف</label>
                <textarea
                  dir="rtl"
                  rows={4}
                  className="px-3 py-2.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
                  {...register('descriptionAr')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-900 text-right">السعر</label>
                <input
                  type="text"
                  dir="rtl"
                  className="h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  {...register('priceAr')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <ImageUpload
              label="Main Figure"
              value={mainFigure}
              onChange={setMainFigure}
              maxImages={1}
              single
              maxSizeMB={50}
              allowedTypes={['png', 'jpg', 'jpeg']}
            />
          </div>

          <div className="bg-white rounded-lg p-6">
            <ImageUpload
              label="Variants"
              value={variants}
              onChange={setVariants}
              maxImages={4}
              maxSizeMB={50}
              allowedTypes={['png', 'jpg', 'jpeg']}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
