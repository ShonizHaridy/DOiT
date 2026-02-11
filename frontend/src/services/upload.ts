import { apiClient } from '@/lib/axios-client'

const uploadSingle = async (endpoint: string, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ url: string }>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

const uploadMultiple = async (endpoint: string, files: File[]): Promise<string[]> => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const { data } = await apiClient.post<{ urls: string[] }>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.urls
}

export const uploadProductImage = (file: File) => uploadSingle('/upload/product-image', file)
export const uploadProductImages = (files: File[]) => uploadMultiple('/upload/product-images', files)
export const uploadHeroImage = (file: File) => uploadSingle('/upload/hero-image', file)
export const uploadBannerImage = (file: File) => uploadSingle('/upload/banner-image', file)
export const uploadVendorLogo = (file: File) => uploadSingle('/upload/vendor-logo', file)
export const uploadCategoryIcon = (file: File) => uploadSingle('/upload/category-icon', file)
export const uploadCustomOrderImages = (files: File[]) =>
  uploadMultiple('/upload/custom-order-images', files)
