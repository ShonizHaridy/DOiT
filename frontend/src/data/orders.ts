export interface OrderItem {
  id: string
  title: string
  image: string
  price: number
  originalPrice?: number
  currency: string
  quantity: number
  vendor: string
  type: string
  size: string
  gender: string
  sku: string
  discount?: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  time: string
  status: 'in progress' | 'shipped' | 'completed' | 'cancelled'
  deliveredTo: string
  dateOfDelivery: string
  total: number
  currency: string
  items: OrderItem[]
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#732365',
    date: 'Nov 10,2025',
    time: '13:45',
    status: 'in progress',
    deliveredTo: '421 Gamal Abdelnasser St. Panorama Tower, Cairo, Egypt',
    dateOfDelivery: 'Nov 15,2025',
    total: 6790,
    currency: 'EGP',
    items: [
      {
        id: '1-1',
        title: 'AlAhly CAF Champions League Jersey',
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/672f2145a395fd1256c8050272c939435756754d',
        price: 1230,
        originalPrice: 1630,
        currency: 'EGP',
        quantity: 2,
        vendor: 'Adidas',
        type: 'T shirt',
        size: 'Medium',
        gender: 'Unisex',
        sku: '364U0w2',
        discount: '20% discount on summer collection',
      },
      {
        id: '1-2',
        title: 'BOUNCE SPORT RUNNING LACE SHOES',
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
        price: 1970,
        currency: 'EGP',
        quantity: 1,
        vendor: 'Bounce',
        type: 'RUNNING SHOES',
        size: '42',
        gender: 'Men',
        sku: '364U0w2',
      },
      {
        id: '1-3',
        title: 'Football NIKEINCYTE',
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
        price: 2280,
        currency: 'EGP',
        quantity: 1,
        vendor: 'Nike',
        type: 'Football',
        size: 'NS',
        gender: 'NS',
        sku: '364U0w2',
      },
    ],
  },
  {
    id: '2',
    orderNumber: '#732365',
    date: 'Oct 5,2025',
    time: '13:45',
    status: 'completed',
    deliveredTo: '421 Gamal Abdelnasser St. Panorama Tower, Cairo, Egypt',
    dateOfDelivery: 'Oct 10,2025',
    total: 1920,
    currency: 'EGP',
    items: [
      {
        id: '2-1',
        title: 'Nike Air Max',
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/f404ff2c4d6a963b490af535d922ee378ac94c95',
        price: 1920,
        currency: 'EGP',
        quantity: 1,
        vendor: 'Nike',
        type: 'LIFESTYLE',
        size: '41',
        gender: 'Men',
        sku: '364U0w3',
      },
    ],
  },
]

export const ORDER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'completed', label: 'Completed' },
]