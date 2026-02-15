export const DEFAULT_PRODUCT_SIZE_VALUES = [
  'XS',
  'S',
  'SM',
  'M',
  'MD',
  'L',
  'XL',
  '1XL',
  '2XL',
  '3XL',
  '4XL',
  '48',
  '47',
  '46',
  '45',
  '44',
  '43',
  '42',
  '41',
  '40',
  '39',
  '38',
  '37',
  '36',
  '35',
  '34',
  '33',
  '32',
  '31',
  '30',
  '29',
  '28',
]

export interface ProductColorOption {
  value: string
  label: string
  colorHex: string
}

const COLOR_CATALOG = [
  { label: 'Black', colorHex: '#000000' },
  { label: 'Beige', colorHex: '#E8E4CF' },
  { label: 'Brown', colorHex: '#8B4513' },
  { label: 'Light Brown', colorHex: '#A67B5B' },
  { label: 'Gold', colorHex: '#D4AF37' },
  { label: 'Dark Red', colorHex: '#8B0000' },
  { label: 'Silver', colorHex: '#C0C0C0' },
  { label: 'Red', colorHex: '#FF0000' },
  { label: 'Coral Red', colorHex: '#F56B6B' },
  { label: 'Pink', colorHex: '#F41BAA' },
  { label: 'Orange', colorHex: '#FFA500' },
  { label: 'Peach', colorHex: '#F6B39C' },
  { label: 'Soft Pink', colorHex: '#EDB6C1' },
  { label: 'Yellow', colorHex: '#FFD700' },
  { label: 'lime green', colorHex: '#32CD32' },
  { label: 'Green', colorHex: '#008000' },
  { label: 'Turquoise', colorHex: '#40E0D0' },
  { label: 'Dark Green', colorHex: '#006400' },
  { label: 'Mint', colorHex: '#3EB489' },
  { label: 'Light Blue', colorHex: '#ADD8E6' },
  { label: 'Blue', colorHex: '#1E5BFF' },
  { label: 'Royal blue', colorHex: '#4169E1' },
  { label: 'Dark Blue', colorHex: '#00008B' },
  { label: 'Ice blue', colorHex: '#D6F0F7' },
  { label: 'Violet', colorHex: '#8A2BE2' },
  { label: 'Lilac', colorHex: '#C8A2C8' },
  { label: 'Lavender', colorHex: '#D8D8F0' },
  { label: 'Dark Grey', colorHex: '#666666' },
  { label: 'Grey', colorHex: '#9A9A9A' },
  { label: 'Light Grey', colorHex: '#D3D3D3' },
  { label: 'White', colorHex: '#FFFFFF' },
] as const

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const FALLBACK_COLOR_HEX = '#E5E7EB'

const normalizeOption = (value: string) => value.trim().toLowerCase()
const normalizeHex = (value: string) => value.toUpperCase()

export const DEFAULT_PRODUCT_COLOR_OPTIONS: ProductColorOption[] = COLOR_CATALOG.map((item) => ({
  value: normalizeHex(item.colorHex),
  label: item.label,
  colorHex: normalizeHex(item.colorHex),
}))

const COLOR_BY_VALUE = new Map(
  DEFAULT_PRODUCT_COLOR_OPTIONS.map((option) => [normalizeOption(option.value), option])
)
const COLOR_BY_LABEL = new Map(
  DEFAULT_PRODUCT_COLOR_OPTIONS.map((option) => [normalizeOption(option.label), option])
)

export const DEFAULT_PRODUCT_COLOR_VALUES = DEFAULT_PRODUCT_COLOR_OPTIONS.map((option) => option.value)

export const normalizeProductColorValue = (value?: string) => {
  const trimmed = value?.trim()
  if (!trimmed) return ''

  const byValue = COLOR_BY_VALUE.get(normalizeOption(trimmed))
  if (byValue) return byValue.value

  const byLabel = COLOR_BY_LABEL.get(normalizeOption(trimmed))
  if (byLabel) return byLabel.value

  if (HEX_COLOR_REGEX.test(trimmed)) {
    return normalizeHex(trimmed)
  }

  return trimmed
}

export const resolveProductColorHex = (value?: string) => {
  const trimmed = value?.trim()
  if (!trimmed) return FALLBACK_COLOR_HEX

  const byValue = COLOR_BY_VALUE.get(normalizeOption(trimmed))
  if (byValue) return byValue.colorHex

  const byLabel = COLOR_BY_LABEL.get(normalizeOption(trimmed))
  if (byLabel) return byLabel.colorHex

  if (HEX_COLOR_REGEX.test(trimmed)) {
    return normalizeHex(trimmed)
  }

  return FALLBACK_COLOR_HEX
}

const buildFallbackOption = (raw: string): ProductColorOption => {
  if (HEX_COLOR_REGEX.test(raw)) {
    const normalized = normalizeHex(raw)
    return {
      value: normalized,
      label: normalized,
      colorHex: normalized,
    }
  }

  return {
    value: raw,
    label: raw,
    colorHex: FALLBACK_COLOR_HEX,
  }
}

export const buildProductColorOptions = (fromApi?: string[]): ProductColorOption[] => {
  const merged = [...DEFAULT_PRODUCT_COLOR_OPTIONS]
  const existing = new Set<string>()

  for (const option of merged) {
    existing.add(normalizeOption(option.value))
    existing.add(normalizeOption(option.label))
  }

  for (const option of fromApi ?? []) {
    const trimmed = option.trim()
    if (!trimmed) continue

    const normalizedValue = normalizeProductColorValue(trimmed)
    const normalizedKey = normalizeOption(normalizedValue)
    if (existing.has(normalizedKey)) continue

    const fallback = buildFallbackOption(normalizedValue)
    merged.push(fallback)
    existing.add(normalizeOption(fallback.value))
    existing.add(normalizeOption(fallback.label))
  }

  return merged
}

export const mergeProductOptionValues = (defaults: string[], fromApi?: string[]) => {
  const merged = [...defaults]
  const existing = new Set(defaults.map(normalizeOption))

  for (const option of fromApi ?? []) {
    const trimmed = option.trim()
    if (!trimmed) continue
    const key = normalizeOption(trimmed)
    if (existing.has(key)) continue
    existing.add(key)
    merged.push(trimmed)
  }

  return merged
}
