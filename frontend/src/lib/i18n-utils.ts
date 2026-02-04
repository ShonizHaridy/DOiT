// lib/i18n-utils.ts
export type Locale = 'en' | 'ar' | String

export type LocalizedContent = {
  nameEn: string
  nameAr: string
}

/**
 * Get localized name from content object
 */
export function getLocalizedName<T extends LocalizedContent>(
  content: T,
  locale: Locale
): string {
  return locale === 'ar' ? content.nameAr : content.nameEn
}

/**
 * Generic function to get any localized field (strings)
 * @example getLocalized(product, 'description', 'ar') // Returns product.descriptionAr
 */
export function getLocalized<T extends Record<string, any>>(
  content: T,
  fieldBase: string,
  locale: Locale
): string {
  const key = locale === 'ar' ? `${fieldBase}Ar` : `${fieldBase}En`
  return content[key] || content[`${fieldBase}En`] // Fallback to English
}

/**
 * Generic function for localized arrays
 * @example getLocalizedArray(product, 'details', 'ar') // Returns product.detailsAr
 */
export function getLocalizedArray<T extends Record<string, any>>(
  content: T,
  fieldBase: string,
  locale: Locale
): string[] {
  const key = locale === 'ar' ? `${fieldBase}Ar` : `${fieldBase}En`
  return content[key] || content[`${fieldBase}En`] || []
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}

/**
 * Get text direction for locale
 */
export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}