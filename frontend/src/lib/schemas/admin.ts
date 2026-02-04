import { z } from 'zod'

// Product variant schema
export const productVariantSchema = z.object({
  id: z.string(),
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  quantity: z.string().min(1, 'Quantity is required'),
})

// Product form schema
export const productSchema = z.object({
  // English
  nameEn: z.string().min(1, 'Product name is required'),
  descriptionEn: z.string().min(1, 'Description is required'),
  detailsEn: z.string().optional(),
  // Arabic
  nameAr: z.string().min(1, 'اسم المنتج مطلوب'),
  descriptionAr: z.string().min(1, 'الوصف مطلوب'),
  detailsAr: z.string().optional(),
  // General
  sku: z.string().min(1, 'SKU is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  status: z.string().min(1, 'Status is required'),
  basePrice: z.string().min(1, 'Price is required'),
  discountPercentage: z.string().optional(),
  vendor: z.string().min(1, 'Vendor is required'),
  gender: z.string().min(1, 'Gender is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub category is required'),
  productList: z.string().min(1, 'Product list is required'),
  type: z.string().min(1, 'Type is required'),
  // Variants
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>

// Product list schema (for categories)
export const productListSchema = z.object({
  id: z.string(),
  valueEn: z.string(),
  valueAr: z.string(),
})

// Sub category schema
export const subCategorySchema = z.object({
  id: z.string(),
  nameEn: z.string().min(1, 'Sub category name is required'),
  nameAr: z.string().min(1, 'اسم الفئة الفرعية مطلوب'),
  productLists: z.array(productListSchema),
})

// Category form schema
export const categorySchema = z.object({
  nameEn: z.string().min(1, 'Category name is required'),
  nameAr: z.string().min(1, 'اسم الفئة مطلوب'),
  subCategories: z.array(subCategorySchema).min(1, 'At least one sub category is required'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
export type SubCategory = z.infer<typeof subCategorySchema>
export type ProductList = z.infer<typeof productListSchema>
