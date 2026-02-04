export interface HeroProduct {
  mainImage: string
  variants: string[]
  price: {
    amount: number
    currency: string
  }
}

export const HERO_PRODUCT: HeroProduct = {
  mainImage: 'https://api.builder.io/api/v1/image/assets/TEMP/7cd0d1633c829f7832988cbf0f0e4d915ed9943e?width=578',
  variants: [
    'https://api.builder.io/api/v1/image/assets/TEMP/156c9d0a7fceeb8bd2977ea1767797a5e16799c8?width=248',
    'https://api.builder.io/api/v1/image/assets/TEMP/834cac12ee730428555e8fc422325f95d04c2850?width=248',
    'https://api.builder.io/api/v1/image/assets/TEMP/ed928265bff6a3e626eef8e3673774154dc7a3f7?width=248',
  ],
  price: {
    amount: 990,
    currency: 'EGP',
  },
}
