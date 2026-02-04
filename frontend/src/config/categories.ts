export interface Category {
  id: string
  titleKey: string // Translation key for the title
  image: string
  href: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'running',
    titleKey: 'categories.running',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/2303de609ede517a189cb3f5197a412d86c0461c?width=750',
    href: '/running',
  },
  {
    id: 'training',
    titleKey: 'categories.training',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e5c293cee5f5d87fba3ebd9bcf07d67b891768d2?width=750',
    href: '/training',
  },
  {
    id: 'lifestyle',
    titleKey: 'categories.lifestyle',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b3beca0489f825bfb4edb619892e9a0df256a6f3?width=750',
    href: '/lifestyle',
  },
]
