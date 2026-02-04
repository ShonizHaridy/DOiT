export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  title: string
  images: string[]
  price: number
  originalPrice?: number
  currency: string
  category: string
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex'
  vendor: string
  type: string
  sku: string
  colors: ProductColor[]
  sizes: string[]
  inStock: boolean
  description?: string
  details?: string[]
  discount?: string
}



// export const FEATURED_PRODUCTS_HOME: Product[] = [
//   {
//     id: '1',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Red', hex: '#FE0503' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '2',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Gray', hex: '#A8A8A8' },
//       { name: 'Yellow', hex: '#FFCC00' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '3',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Gray', hex: '#A8A8A8' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '4',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/4f326d22b7426aac5f6e011446064a2c36e836eb',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'White', hex: '#FFFFFF' },
//       { name: 'Gray', hex: '#A8A8A8' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '5',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/e4cdb57b233bfe0ca4d4ad0ed712ee077115a48e',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Gray', hex: '#A8A8A8' },
//       { name: 'Navy', hex: '#283557' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '6',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/f404ff2c4d6a963b490af535d922ee378ac94c95',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Gray', hex: '#A8A8A8' },
//       { name: 'Yellow', hex: '#CEC458' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '7',
//     title: 'AlAhly 2025 Jersey',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/bf2779f77e2b25c6cb102a52f53c73ebe112ca51',
//     price: 1140,
//     currency: 'LE',
//     category: 'clothing',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Red', hex: '#FE0503' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '8',
//     title: 'BOUNCE SPORT RUNNING LACE SHOES',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
//     price: 1140,
//     currency: 'LE',
//     category: 'footwear',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Gray', hex: '#A8A8A8' },
//       { name: 'Pink', hex: '#FF2D55' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
//   {
//     id: '9',
//     title: 'AlAhly CAF Champions League Jersey',
//     image: 'https://api.builder.io/api/v1/image/assets/TEMP/672f2145a395fd1256c8050272c939435756754d',
//     price: 1140,
//     currency: 'LE',
//     category: 'clothing',
//     gender: 'Men',
//     brand: 'Adidas',
//     colors: [
//       { name: 'Black', hex: '#212121' },
//       { name: 'Red', hex: '#FE0503' },
//     ],
//     sizes: ['40', '41', '42', '43'],
//     inStock: true,
//   },
// ]

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
      'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
      'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2',
      'https://api.builder.io/api/v1/image/assets/TEMP/4f326d22b7426aac5f6e011446064a2c36e836eb',
    ],
    price: 1140,
    originalPrice: 1630,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Unisex',
    vendor: 'Bounce',
    type: 'RUNNING SHOES',
    sku: '364U0w2',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Pink', hex: '#FF69B4' },
    ],
    sizes: ['EU- 35', 'EU- 36', 'EU- 37', 'EU- 38'],
    inStock: true,
    discount: '20% discount on summer collection',
    description: 'Designed the follow the contour of your foot. Cushioned to feel comfortable during every activity. Made with a layered mesh upper and a Bounce midsole that feels springy and light.',
    details: [
      'Regular fit.',
      'Sandwich mesh upper.',
      'Textile lining.',
      'Upper contains a minimum of 50% recycled content.',
      'Lace closure.',
      'Bounce midsole.',
      'No-marking rubber outsole.',
    ],
  },
  {
    id: '2',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
    ],
    price: 1140,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Bounce',
    type: 'RUNNING SHOES',
    sku: '364U0w3',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
      { name: 'Yellow', hex: '#FFCC00' },
    ],
    sizes: ['EU- 35', 'EU- 36', 'EU- 37', 'EU- 38', 'EU- 39', 'EU- 40'],
    inStock: true,
  },
  {
    id: '3',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2',
    ],
    price: 1140,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Bounce',
    type: 'RUNNING SHOES',
    sku: '364U0w4',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Gray', hex: '#A8A8A8' },
    ],
    sizes: ['EU- 35', 'EU- 36', 'EU- 37', 'EU- 38'],
    inStock: true,
  },
  {
    id: '4',
    title: 'BOUNCE SPORT RUNNING LACE SHOES',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/4f326d22b7426aac5f6e011446064a2c36e836eb',
    ],
    price: 1140,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Unisex',
    vendor: 'Bounce',
    type: 'RUNNING SHOES',
    sku: '364U0w5',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#A8A8A8' },
    ],
    sizes: ['EU- 35', 'EU- 36', 'EU- 37', 'EU- 38'],
    inStock: true,
  },
  {
    id: '5',
    title: 'M AIR MAX ALPHA TRAINER',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/e4cdb57b233bfe0ca4d4ad0ed712ee077115a48e',
    ],
    price: 1300,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Nike',
    type: 'TRAINING SHOES',
    sku: '364U0w6',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['EU- 40', 'EU- 41', 'EU- 42', 'EU- 43'],
    inStock: true,
  },
  {
    id: '6',
    title: 'Nike Air',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/f404ff2c4d6a963b490af535d922ee378ac94c95',
    ],
    price: 1300,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Nike',
    type: 'LIFESTYLE',
    sku: '364U0w7',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#A8A8A8' },
    ],
    sizes: ['EU- 40', 'EU- 41', 'EU- 42', 'EU- 43'],
    inStock: true,
  },
  {
    id: '7',
    title: 'AlAhly 2025 Jersey',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/bf2779f77e2b25c6cb102a52f53c73ebe112ca51',
    ],
    price: 1140,
    currency: 'EGP',
    category: 'clothing',
    gender: 'Men',
    vendor: 'Adidas',
    type: 'T shirt',
    sku: '364U0w8',
    colors: [{ name: 'Red', hex: '#FE0503' }],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '8',
    title: 'AlAhly CAF Champions League Jersey',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/672f2145a395fd1256c8050272c939435756754d',
    ],
    price: 5249,
    currency: 'EGP',
    category: 'clothing',
    gender: 'Unisex',
    vendor: 'Adidas',
    type: 'T shirt',
    sku: '364U0w2',
    colors: [
      { name: 'Black', hex: '#212121' },
      { name: 'Red', hex: '#FE0503' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: '9',
    title: 'Football NIKEINCYTE',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
    ],
    price: 2280,
    currency: 'EGP',
    category: 'accessories',
    gender: 'Unisex',
    vendor: 'Nike',
    type: 'Football',
    sku: '364U0w2',
    colors: [{ name: 'Multicolor', hex: '#FF6B35' }],
    sizes: ['NS'],
    inStock: true,
  },
  {
    id: '10',
    title: 'Juniper Trail 3 Men\'s Trail',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
    ],
    price: 1300,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Nike',
    type: 'TRAIL SHOES',
    sku: '364U0w9',
    colors: [
      { name: 'Blue', hex: '#1E90FF' },
      { name: 'Orange', hex: '#FF6B35' },
    ],
    sizes: ['EU- 40', 'EU- 41', 'EU- 42', 'EU- 43', 'EU- 44'],
    inStock: true,
  },
  {
    id: '11',
    title: 'Court Vision Low Men\'s Shoes',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2',
    ],
    price: 1300,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Nike',
    type: 'LIFESTYLE',
    sku: '364U0w10',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#212121' },
    ],
    sizes: ['EU- 40', 'EU- 41', 'EU- 42', 'EU- 43'],
    inStock: true,
  },
  {
    id: '12',
    title: 'Air Monarch IV Men\'s Workout Shoes',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/4f326d22b7426aac5f6e011446064a2c36e836eb',
    ],
    price: 1300,
    currency: 'EGP',
    category: 'footwear',
    gender: 'Men',
    vendor: 'Nike',
    type: 'TRAINING SHOES',
    sku: '364U0w11',
    colors: [
      { name: 'Red', hex: '#FE0503' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['EU- 40', 'EU- 41', 'EU- 42', 'EU- 43'],
    inStock: true,
  },
]

// For backward compatibility
export const FEATURED_PRODUCTS = PRODUCTS

export const STYLE_CATEGORIES = [
  {
    key: 'running',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/2303de609ede517a189cb3f5197a412d86c0461c',
    href: '/category/running',
  },
  {
    key: 'training',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e5c293cee5f5d87fba3ebd9bcf07d67b891768d2',
    href: '/category/training',
  },
  {
    key: 'lifestyle',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b3beca0489f825bfb4edb619892e9a0df256a6f3',
    href: '/category/lifestyle',
  },
]

export const SALE_BANNERS = [
  {
    id: 'black-friday-1',
    title: 'BLACK FRIDAY',
    subtitle: 'UP TO 25% OFF',
    href: '/offers/black-friday',
  },
  {
    id: 'exclusive-offers',
    title: 'EXCLUSIVE OFFERS',
    subtitle: '50% DISCOUNT',
    href: '/offers/exclusive',
  },
  {
    id: 'black-friday-2',
    title: 'BLACK FRIDAY',
    subtitle: 'LIMITED OFFER 50% DISCOUNT',
    href: '/offers/black-friday-limited',
  },
]


// Filter options
export const FILTER_OPTIONS = {
  availability: ['In Stock', 'Out of Stock'],
  priceRanges: ['Under 500 EGP', '500-1000 EGP', '1000-2000 EGP', 'Over 2000 EGP'],
  productTypes: ['Running Shoes', 'Training Shoes', 'Lifestyle', 'T-Shirts', 'Football'],
  brands: ['Adidas', 'Nike', 'Reebok', 'Puma', 'Bounce'],
  sizes: ['EU- 35', 'EU- 36', 'EU- 37', 'EU- 38', 'EU- 39', 'EU- 40', 'EU- 41', 'EU- 42', 'EU- 43', 'S', 'M', 'L', 'XL', 'XXL'],
  genders: ['Men', 'Women', 'Kids', 'Unisex'],
  colors: [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#212121' },
    { name: 'Red', hex: '#FE0503' },
    { name: 'Blue', hex: '#1E90FF' },
    { name: 'Yellow', hex: '#FFCC00' },
    { name: 'Pink', hex: '#FF69B4' },
    { name: 'Gray', hex: '#A8A8A8' },
    { name: 'Teal', hex: '#008080' },
  ],
}

export const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'best-selling', label: 'Best Selling' },
  { key: 'a-z', label: 'Alphabetical A to Z' },
  { key: 'z-a', label: 'Alphabetical Z to A' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
  { key: 'date-old', label: 'Date: Old to New' },
  { key: 'date-new', label: 'Date: New to Old' },
]