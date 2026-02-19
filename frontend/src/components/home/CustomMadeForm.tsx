'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Gallery, CloseCircle } from 'iconsax-reactjs'
import { Input, Select, Textarea, Button } from '@/components/ui'
import { uploadCustomOrderImages } from '@/services/upload'
import { useRouter } from '@/i18n/navigation'
import { toAbsoluteMediaUrl } from '@/lib/media-url'

interface FormData {
  productType: string
  gender: string
  color: string
  size: string
  quantity: number
  details: string
}

export default function CustomMadeForm() {
  const t = useTranslations('home.customMade')
  const router = useRouter()
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const imagesRef = useRef<Array<{ file: File; preview: string }>>([])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      productType: '',
      gender: '',
      color: '',
      size: '',
      quantity: 1,
      details: '',
    }
  })

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    let redirecting = false

    try {
      setSubmitError(null)
      setIsSubmitting(true)

      const files = images.map((item) => item.file)
      const uploadedReferenceImages = files.length > 0 ? await uploadCustomOrderImages(files) : []
      const referenceImages = uploadedReferenceImages
        .map((url) => toAbsoluteMediaUrl(url))
        .filter(Boolean)

      // Save custom order data to localStorage so checkout can collect delivery info first
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'doit_pending_custom_order',
          JSON.stringify({
            productType: data.productType,
            color: data.color,
            gender: data.gender,
            size: data.size,
            quantity: data.quantity,
            details: data.details,
            referenceImages,
          })
        )
      }

      // Keep form values visible until route transition to avoid flashing empty fields.
      redirecting = true
      router.push('/checkout?mode=custom')
    } catch {
      setSubmitError('Failed to upload images. Please try again.')
    } finally {
      if (!redirecting) {
        setIsSubmitting(false)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const remainingSlots = 3 - images.length
      const nextFiles = Array.from(files).slice(0, Math.max(0, remainingSlots))
      const nextItems = nextFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      if (nextItems.length > 0) {
        setImages((prev) => [...prev, ...nextItems])
      }
    }
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const productTypeOptions = [
    { value: 't-shirt', label: t('form.productTypeOptions.tshirt') },
    { value: 'jersey', label: t('form.productTypeOptions.jersey') },
    { value: 'shoes', label: t('form.productTypeOptions.shoes') },
    { value: 'accessories', label: t('form.productTypeOptions.accessories') },
  ]

  const genderOptions = [
    { value: 'men', label: t('form.genderOptions.men') },
    { value: 'women', label: t('form.genderOptions.women') },
    { value: 'kids', label: t('form.genderOptions.kids') },
  ]

  const sizeOptions = [
    { value: 's', label: t('form.sizeOptions.s') },
    { value: 'm', label: t('form.sizeOptions.m') },
    { value: 'l', label: t('form.sizeOptions.l') },
    { value: 'xl', label: t('form.sizeOptions.xl') },
    { value: 'xxl', label: t('form.sizeOptions.xxl') },
  ]
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
        className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-[20px] p-6 md:p-8 border border-[#F5F4F4] shadow-form"
    >
      {submitError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Select
          label={t('form.productType')}
          placeholder={t('form.selectOption')}
          options={productTypeOptions}
          error={errors.productType?.message}
          {...register('productType', { required: true })}
        />

        <Input
          label={t('form.color')}
          placeholder={t('form.colorPlaceholder')}
          error={errors.color?.message}
          {...register('color')}
        />

        <Select
          label={t('form.gender')}
          placeholder={t('form.selectOption')}
          options={genderOptions}
          error={errors.gender?.message}
          {...register('gender', { required: true })}
        />

        <Select
          label={t('form.size')}
          placeholder={t('form.selectOption')}
          options={sizeOptions}
          error={errors.size?.message}
          {...register('size')}
        />

        <Input
          type="number"
          min={1}
          label={t('form.quantity')}
          error={errors.quantity?.message}
          {...register('quantity', { min: 1, valueAsNumber: true })}
        />

        <Textarea
          label={t('form.details')}
          placeholder={t('form.detailsPlaceholder')}
          rows={3}
          error={errors.details?.message}
          {...register('details')}
        />

        {/* Images Section - Mobile */}
        <div>
          <label className="block font-inter font-medium text-xl text-primary mb-2">
            {t('form.images')}
          </label>

          <div className="flex flex-col gap-3">
            {/* Upload Button */}
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border-input rounded cursor-pointer hover:bg-gray-50 transition-colors">
              <Gallery size={20} color="#888787" />
              <span className="font-rubik font-normal text-sm text-text-placeholder">
                {t('form.selectFile')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Previews - 2 boxes on mobile */}
            <div className="flex gap-2">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className="relative w-[120px] h-[120px] rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  {images[index] ? (
                    <>
                      <img
                        src={images[index].preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -end-2"
                      >
                        <CloseCircle size={20} color="#FE0503" variant="Bold" />
                      </button>
                    </>
                  ) : (
                    <Gallery size={24} color="#D4D4D4" />
                  )}
                </div>
              ))}
            </div>

            <p className="font-roboto font-medium text-xs text-text-placeholder">
              {t('form.maxFileSize')} {t('form.allowedFiles')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - 3 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Column 1: Product Type, Color, Details */}
        <div className="flex flex-col gap-4">
          <Select
            label={t('form.productType')}
            placeholder={t('form.selectOption')}
            options={productTypeOptions}
            error={errors.productType?.message}
            {...register('productType', { required: true })}
          />

          <Input
            label={t('form.color')}
            placeholder={t('form.colorPlaceholder')}
            error={errors.color?.message}
            {...register('color')}
          />

          <Textarea
            label={t('form.details')}
            placeholder={t('form.detailsPlaceholder')}
            rows={4}
            error={errors.details?.message}
            {...register('details')}
          />
        </div>

        {/* Column 2: Gender, Size, Quantity */}
        <div className="flex flex-col gap-4">
          <Select
            label={t('form.gender')}
            placeholder={t('form.selectOption')}
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender', { required: true })}
          />

          <Select
            label={t('form.size')}
            placeholder={t('form.selectOption')}
            options={sizeOptions}
            error={errors.size?.message}
            {...register('size')}
          />

          <Input
            type="number"
            min={1}
            label={t('form.quantity')}
            error={errors.quantity?.message}
            {...register('quantity', { min: 1, valueAsNumber: true })}
          />
        </div>

        {/* Column 3: Images */}
        <div className="flex flex-col">
          <label className="block font-inter font-medium text-xl text-primary mb-2">
            {t('form.images')}
          </label>

          <div className="flex flex-col gap-3 flex-1">
            {/* Drag & Drop Area */}
            <label className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-input rounded-lg cursor-pointer hover:bg-gray-50 transition-colors py-8">
              <span className="font-rubik text-sm text-text-placeholder">
                {t('form.dragImageHere')} {t('form.or')}
              </span>
              <span className="px-4 py-2 border border-border-input rounded font-rubik text-sm">
                {t('form.selectFile')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Previews - 3 boxes on desktop */}
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="relative w-full h-[100px] rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  {images[index] ? (
                    <>
                      <img
                        src={images[index].preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -end-2"
                      >
                        <CloseCircle size={18} color="#FE0503" variant="Bold" />
                      </button>
                    </>
                  ) : (
                    <Gallery size={20} color="#D4D4D4" />
                  )}
                </div>
              ))}
            </div>

            <p className="font-roboto font-medium text-xs text-text-placeholder">
              {t('form.maxFileSize')} {t('form.allowedFiles')}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : t('form.confirmOrder')}
        </Button>
      </div>
    </form>
  )
}
