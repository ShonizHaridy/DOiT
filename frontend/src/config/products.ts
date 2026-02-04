export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  title: string
  image: string
  colors: ProductColor[]
  sizes: string[]
  gender: string
  price: string
  href: string
}

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Pink', hex: '#FF2D55' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/1',
  },
  {
    id: '2',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Yellow', hex: '#FFCC00' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/2',
  },
  {
    id: '3',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Lime', hex: '#CEC458' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/3',
  },
  {
    id: '4',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/4f326d22b7426aac5f6e011446064a2c36e836eb?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/4',
  },
  {
    id: '5',
    title: 'AlAhly 2025 Jersey',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/bf2779f77e2b25c6cb102a52f53c73ebe112ca51?width=259',
    colors: [{ name: 'Red', hex: '#FF2D55' }],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/5',
  },
  {
    id: '6',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e4cdb57b233bfe0ca4d4ad0ed712ee077115a48e?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Navy', hex: '#283557' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/6',
  },
  {
    id: '7',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f404ff2c4d6a963b490af535d922ee378ac94c95?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Pink', hex: '#FF2D55' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/7',
  },
  {
    id: '8',
    title: 'AlAhly CAF Champions League Jersey',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/672f2145a395fd1256c8050272c939435756754d?width=259',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Red', hex: '#FF2D55' },
    ],
    sizes: ['40', '41', '42', '43'],
    gender: 'Men',
    price: '1140 LE',
    href: '/products/8',
  },
]
