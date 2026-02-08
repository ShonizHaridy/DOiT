# DOiT E-commerce API - Complete Documentation

Complete API documentation for the DOiT E-commerce platform. This document covers all public and admin endpoints with detailed request/response examples.

**Base URL:** `https://api.doit.com/api` (or `http://localhost:4000/api` for development)

**Date Format:** All dates are in ISO 8601 format (e.g., `2025-01-30T10:00:00Z`)  
**Currency:** All monetary values are in EGP (Egyptian Pounds)  
**Language Support:** Bilingual (English/Arabic) - most content has both `nameEn` and `nameAr` fields

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Public Endpoints](#public-endpoints)
   - [Products](#products)
   - [Categories](#categories)
   - [Content](#content)
   - [Orders (Guest Checkout)](#guest-orders)
3. [Customer Endpoints](#customer-endpoints)
   - [Profile Management](#profile-management)
   - [Addresses](#addresses)
   - [Wishlist](#wishlist)
   - [Orders](#customer-orders)
4. [Admin Endpoints](#admin-endpoints)
   - [Products Management](#admin-products)
   - [Categories Management](#admin-categories)
   - [Orders Management](#admin-orders)
   - [Customers Management](#admin-customers)
   - [Content Management](#admin-content)
   - [Offers Management](#admin-offers)
   - [Dashboard & Analytics](#admin-dashboard)
   - [File Upload](#file-upload)
5. [Error Responses](#error-responses)
6. [Enums & Constants](#enums-and-constants)

---

## 🔐 Authentication

### Customer Authentication (OTP-based)

#### Send OTP

**Endpoint:** `POST /auth/customer/send-otp`  
**Public:** Yes  
**Description:** Sends a 6-digit OTP code to the customer's email. Creates customer account if doesn't exist.

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "message": "OTP code sent successfully to your email"
}
```

**Notes:**
- In development, OTP is logged to console
- OTP expires in 10 minutes (configurable)
- Auto-creates customer account on first sign-in

---

#### Verify OTP

**Endpoint:** `POST /auth/customer/verify-otp`  
**Public:** Yes  
**Description:** Verifies OTP code and returns JWT access token.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "code": "123456"
}
```

**Success Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm5abc123",
    "email": "customer@example.com",
    "fullName": "John Doe",
    "role": "customer"
  }
}
```

**Error Responses:**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired OTP code"
}
```

---

### Admin Authentication (JWT-based)

#### Admin Login

**Endpoint:** `POST /auth/admin/login`  
**Public:** Yes  
**Description:** Admin login using adminId and password.

**Request Body:**
```json
{
  "adminId": "admin001",
  "password": "Change@123"
}
```

**Success Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm5xyz789",
    "email": "admin@doit.com",
    "role": "admin"
  }
}
```

---

#### Admin Reset Password Request

**Endpoint:** `POST /auth/admin/reset-request`  
**Public:** Yes  
**Description:** Sends password reset code to admin email.

**Request Body:**
```json
{
  "adminCode": "admin001",
  "email": "admin@doit.com"
}
```

**Success Response:**
```json
{
  "message": "Reset code sent to your email"
}
```

---

#### Admin Reset Password

**Endpoint:** `POST /auth/admin/reset-password`  
**Public:** Yes  
**Description:** Resets admin password using verification code.

**Request Body:**
```json
{
  "adminCode": "admin001",
  "verificationCode": "123456",
  "newPassword": "NewSecure@123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Success Response:**
```json
{
  "message": "Password reset successfully"
}
```

---

## 🛍️ Public Endpoints

### Products

#### Get All Products (with filtering and pagination)

**Endpoint:** `GET /products`  
**Public:** Yes  
**Description:** Browse products with advanced filtering, sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | enum | `featured` | Sort order (see SortBy enum) |
| `category` | string | - | Filter by category ID |
| `subCategory` | string | - | Filter by subcategory ID |
| `productList` | string | - | Filter by product list ID |
| `vendor` | string | - | Filter by vendor name |
| `gender` | enum | - | Filter by gender (UNISEX, MEN, WOMEN, KIDS) |
| `type` | string | - | Filter by product type |
| `search` | string | - | Search by name, SKU |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |
| `colors` | string | - | Comma-separated color filter |
| `sizes` | string | - | Comma-separated size filter |
| `availability` | enum | - | Filter by stock (in-stock, low-stock, out-of-stock) |

**Sort Options (sortBy):**
- `featured` - Most viewed products (default)
- `best-selling` - Most ordered products
- `a-z` - Name ascending
- `z-a` - Name descending
- `price-low` - Price ascending
- `price-high` - Price descending
- `date-old` - Oldest first
- `date-new` - Newest first

**Example Request:**
```http
GET /products?page=1&limit=20&sortBy=price-low&category=cm5cat123&minPrice=100&maxPrice=500&colors=Black,White&availability=in-stock
```

**Success Response:**
```json
{
  "products": [
    {
      "id": "cm5prod123",
      "sku": "364U0w2",
      "nameEn": "BOUNCE SPORT RUNNING SHOES",
      "nameAr": "حذاء جري باونس سبورت",
      "descriptionEn": "Designed to follow the contour of your foot...",
      "descriptionAr": "مصمم ليتبع شكل قدمك...",
      "detailsEn": ["Regular fit", "Mesh upper", "Bounce midsole"],
      "detailsAr": ["ملاءمة عادية", "جزء علوي شبكي", "نعل أوسط باونس"],
      "basePrice": 1630,
      "discountPercentage": 30,
      "finalPrice": 1141,
      "vendor": "Bounce",
      "gender": "UNISEX",
      "type": "RUNNING SHOES",
      "status": "PUBLISHED",
      "sizeChartUrl": "/uploads/size-charts/bounce.jpg",
      "images": [
        {
          "id": "cm5img1",
          "url": "/uploads/products/bounce-1.jpg",
          "order": 0
        },
        {
          "id": "cm5img2",
          "url": "/uploads/products/bounce-2.jpg",
          "order": 1
        }
      ],
      "colors": ["Black", "Pink"],
      "sizes": ["EU- 35", "EU- 36", "EU- 37"],
      "availability": "in-stock",
      "totalStock": 50,
      "viewCount": 245,
      "createdAt": "2025-01-30T10:00:00Z",
      "category": {
        "id": "cm5cat1",
        "nameEn": "Men",
        "nameAr": "رجال"
      },
      "subCategory": {
        "id": "cm5sub1",
        "nameEn": "Footwear",
        "nameAr": "أحذية"
      },
      "productList": {
        "id": "cm5list1",
        "nameEn": "Running",
        "nameAr": "جري"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### Get Product by ID

**Endpoint:** `GET /products/:id`  
**Public:** Yes  
**Description:** Get detailed product information. Auto-increments view count.

**URL Parameters:**
- `id` - Product ID (required)

**Example Request:**
```http
GET /products/cm5prod123
```

**Success Response:**
```json
{
  "id": "cm5prod123",
  "sku": "364U0w2",
  "nameEn": "BOUNCE SPORT RUNNING SHOES",
  "nameAr": "حذاء جري باونس سبورت",
  "descriptionEn": "Designed to follow the contour of your foot. Cushioned to feel comfortable during every activity.",
  "descriptionAr": "مصمم ليتبع شكل قدمك. مبطن ليشعرك بالراحة أثناء كل نشاط.",
  "detailsEn": [
    "Regular fit",
    "Sandwich mesh upper",
    "Textile lining",
    "Bounce midsole"
  ],
  "detailsAr": [
    "ملاءمة عادية",
    "جزء علوي شبكي",
    "بطانة نسيجية",
    "نعل أوسط باونس"
  ],
  "basePrice": 1630,
  "discountPercentage": 30,
  "finalPrice": 1141,
  "vendor": "Bounce",
  "gender": "UNISEX",
  "type": "RUNNING SHOES",
  "status": "PUBLISHED",
  "sizeChartUrl": "/uploads/size-charts/bounce.jpg",
  "images": [
    {
      "id": "cm5img1",
      "url": "/uploads/products/bounce-1.jpg",
      "order": 0
    },
    {
      "id": "cm5img2",
      "url": "/uploads/products/bounce-2.jpg",
      "order": 1
    }
  ],
  "colors": ["Black", "Pink"],
  "sizes": ["EU- 35", "EU- 36", "EU- 37"],
  "availability": "in-stock",
  "totalStock": 50,
  "viewCount": 246,
  "createdAt": "2025-01-30T10:00:00Z",
  "category": {
    "id": "cm5cat1",
    "nameEn": "Men",
    "nameAr": "رجال"
  },
  "subCategory": {
    "id": "cm5sub1",
    "nameEn": "Footwear",
    "nameAr": "أحذية"
  },
  "productList": {
    "id": "cm5list1",
    "nameEn": "Running",
    "nameAr": "جري"
  }
}
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

---

#### Get Featured Products

**Endpoint:** `GET /products/featured`  
**Public:** Yes  
**Description:** Get featured products based on admin configuration (auto-selected or manual).

**Success Response:**
```json
[
  {
    "id": "cm5prod123",
    "sku": "364U0w2",
    "nameEn": "BOUNCE SPORT RUNNING SHOES",
    "nameAr": "حذاء جري باونس سبورت",
    "descriptionEn": "Premium running shoes...",
    "descriptionAr": "أحذية جري ممتازة...",
    "basePrice": 1630,
    "discountPercentage": 30,
    "finalPrice": 1141,
    "vendor": "Bounce",
    "gender": "UNISEX",
    "type": "RUNNING SHOES",
    "images": [...],
    "colors": ["Black", "Pink"],
    "sizes": ["EU- 35", "EU- 36"],
    "availability": "in-stock",
    "totalStock": 50,
    "viewCount": 246,
    "createdAt": "2025-01-30T10:00:00Z"
  }
  // ... more products (up to 9)
]
```

**Notes:**
- Returns max 9 products
- If `autoChoose` is enabled: returns most viewed products
- If manual selection: returns admin-selected products
- Default: returns newest products

---

### Categories

#### Get All Categories

**Endpoint:** `GET /categories`  
**Public:** Yes  
**Description:** Get all active categories with optional nested children.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeChildren` | boolean | false | Include subcategories and product lists |

**Example Request:**
```http
GET /categories?includeChildren=true
```

**Success Response (with children):**
```json
[
  {
    "id": "cm5cat1",
    "nameEn": "Men",
    "nameAr": "رجال",
    "icon": "/uploads/icons/men.svg",
    "status": true,
    "subCategories": [
      {
        "id": "cm5sub1",
        "nameEn": "Footwear",
        "nameAr": "أحذية",
        "icon": "/uploads/icons/shoes.svg",
        "productLists": [
          {
            "id": "cm5list1",
            "nameEn": "Running",
            "nameAr": "جري"
          },
          {
            "id": "cm5list2",
            "nameEn": "Training",
            "nameAr": "تدريب"
          }
        ]
      },
      {
        "id": "cm5sub2",
        "nameEn": "Clothing",
        "nameAr": "ملابس",
        "icon": "/uploads/icons/clothing.svg",
        "productLists": [
          {
            "id": "cm5list3",
            "nameEn": "T-Shirts",
            "nameAr": "تيشيرتات"
          }
        ]
      }
    ]
  },
  {
    "id": "cm5cat2",
    "nameEn": "Women",
    "nameAr": "نساء",
    "icon": "/uploads/icons/women.svg",
    "status": true,
    "subCategories": []
  }
]
```

**Success Response (without children):**
```json
[
  {
    "id": "cm5cat1",
    "nameEn": "Men",
    "nameAr": "رجال",
    "icon": "/uploads/icons/men.svg",
    "status": true
  },
  {
    "id": "cm5cat2",
    "nameEn": "Women",
    "nameAr": "نساء",
    "icon": "/uploads/icons/women.svg",
    "status": true
  }
]
```

---

#### Get Category by ID

**Endpoint:** `GET /categories/:id`  
**Public:** Yes  
**Description:** Get single category with full hierarchy.

**URL Parameters:**
- `id` - Category ID (required)

**Example Request:**
```http
GET /categories/cm5cat1
```

**Success Response:**
```json
{
  "id": "cm5cat1",
  "nameEn": "Men",
  "nameAr": "رجال",
  "icon": "/uploads/icons/men.svg",
  "status": true,
  "subCategories": [
    {
      "id": "cm5sub1",
      "nameEn": "Footwear",
      "nameAr": "أحذية",
      "icon": "/uploads/icons/shoes.svg",
      "productLists": [
        {
          "id": "cm5list1",
          "nameEn": "Running",
          "nameAr": "جري"
        }
      ]
    }
  ]
}
```

---

#### Get Filter Options

**Endpoint:** `GET /categories/filters`  
**Public:** Yes  
**Description:** Get all available filter options for product filtering.

**Success Response:**
```json
{
  "brands": ["Adidas", "Bounce", "Nike", "Puma", "Reebok"],
  "types": ["Football", "LIFESTYLE", "RUNNING SHOES", "T shirt", "TRAINING SHOES"],
  "genders": ["KIDS", "MEN", "UNISEX", "WOMEN"],
  "colors": ["Black", "Gray", "Multicolor", "Pink", "Red", "White"],
  "sizes": ["EU- 35", "EU- 36", "EU- 37", "EU- 40", "EU- 41", "EU- 42", "L", "M", "NS", "S", "XL"]
}
```

**Notes:**
- All arrays are sorted alphabetically
- Values are distinct/unique
- Only includes options from published products

---

### Content

#### Get Home Page Content

**Endpoint:** `GET /content/home`  
**Public:** Yes  
**Description:** Get all content for homepage (hero section, vendors, banners).

**Success Response:**
```json
{
  "heroSection": {
    "id": "cm5hero1",
    "headlineEn": "ESSENTIAL ITEMS FOR",
    "headlineAr": "عناصر أساسية لـ",
    "descriptionEn": "Latest collection of premium sports gear",
    "descriptionAr": "أحدث مجموعة من معدات الرياضة الممتازة",
    "price": 990,
    "mainImageUrl": "/uploads/heroes/main-hero.jpg",
    "variantImages": [
      "/uploads/heroes/variant-1.jpg",
      "/uploads/heroes/variant-2.jpg"
    ],
    "ctaTextEn": "ADD TO CART",
    "ctaTextAr": "أضف إلى السلة",
    "ctaLink": "/products/cm5prod123"
  },
  "vendors": [
    {
      "id": "cm5vend1",
      "name": "Nike",
      "logoUrl": "/uploads/brands/brand1.jpg"
    },
    {
      "id": "cm5vend2",
      "name": "Adidas",
      "logoUrl": "/uploads/brands/brand2.jpg"
    }
  ],
  "banners": [
    {
      "id": "cm5ban1",
      "imageUrl": "/uploads/banners/black-friday.png",
      "titleEn": "BLACK FRIDAY",
      "titleAr": "الجمعة السوداء",
      "link": "/offers/black-friday"
    },
    {
      "id": "cm5ban2",
      "imageUrl": "/uploads/banners/exclusive.png",
      "titleEn": "EXCLUSIVE OFFERS",
      "titleAr": "عروض حصرية",
      "link": "/offers/exclusive"
    }
  ]
}
```

**Notes:**
- Only returns active/visible content
- Hero section is singular (one active hero)
- Vendors and banners are ordered by `order` field

---

#### Get Active Popup Offer

**Endpoint:** `GET /content/popup-offer`  
**Public:** Yes  
**Description:** Get currently active popup offer for display.

**Success Response:**
```json
{
  "id": "cm5popup1",
  "headlineEn": "WELCOME OFFER",
  "headlineAr": "عرض الترحيب",
  "subHeadlineEn": "Get 100 EGP OFF",
  "subHeadlineAr": "احصل على خصم 100 جنيه",
  "amount": 100,
  "voucherCode": "WELCOME100",
  "targetedUser": "first_time_customer",
  "imageUrl": "/uploads/popups/welcome.jpg"
}
```

**Response when no active popup:**
```json
null
```

**Notes:**
- Only returns offers within valid date range
- Only returns status=true offers
- Use for showing popup on page load

---

### Guest Orders

#### Create Guest Order (No Login Required)

**Endpoint:** `POST /orders/guest`  
**Public:** Yes  
**Description:** Place an order without logging in. Creates customer account if email doesn't exist.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "cm5prod123",
      "color": "Black",
      "size": "EU- 42",
      "quantity": 2
    },
    {
      "productId": "cm5prod456",
      "color": "White",
      "size": "M",
      "quantity": 1
    }
  ],
  "email": "guest@example.com",
  "fullName": "Ahmed Hassan",
  "phoneNumber": "+201234567890",
  "addressLabel": "Home",
  "fullAddress": "123 Main St, Nasr City, Cairo, Egypt",
  "paymentMethod": "Cash on Delivery",
  "notes": "Please call before delivery",
  "couponCode": "SUMMER25"
}
```

**Success Response:**
```json
{
  "id": "cm5order123",
  "orderNumber": "#732365",
  "status": "ORDER_PLACED",
  "subtotal": 3450,
  "discount": 345,
  "shipping": 50,
  "total": 3155,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": null,
  "notes": "Please call before delivery",
  "createdAt": "2025-02-08T10:30:00Z",
  "address": {
    "label": "Home",
    "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
  },
  "items": [
    {
      "id": "cm5item1",
      "productName": "BOUNCE SPORT RUNNING SHOES",
      "productImage": "/uploads/products/bounce-1.jpg",
      "sku": "364U0w2",
      "vendor": "Bounce",
      "type": "RUNNING SHOES",
      "gender": "UNISEX",
      "color": "Black",
      "size": "EU- 42",
      "price": 1141,
      "originalPrice": 1630,
      "quantity": 2,
      "discount": "30% OFF"
    },
    {
      "id": "cm5item2",
      "productName": "AlAhly 2025 Jersey",
      "productImage": "/uploads/products/jersey-1.jpg",
      "sku": "364U0w8",
      "vendor": "Adidas",
      "type": "T shirt",
      "gender": "MEN",
      "color": "White",
      "size": "M",
      "price": 1140,
      "quantity": 1
    }
  ]
}
```

**Error Responses:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for BOUNCE SPORT RUNNING SHOES. Available: 5, Requested: 10"
}
```

```json
{
  "statusCode": 400,
  "message": "Product cm5prod999 not found or unavailable"
}
```

**Notes:**
- Auto-creates customer if email doesn't exist
- Creates new address for each order
- Validates stock availability before placing order
- Applies coupon discount if valid
- Fixed shipping: 50 EGP
- Stock is decremented atomically in transaction

---

#### Track Guest Order

**Endpoint:** `GET /orders/track/:orderNumber`  
**Public:** Yes  
**Description:** Track order status using order number (no login required).

**URL Parameters:**
- `orderNumber` - Order number (e.g., #732365)

**Example Request:**
```http
GET /orders/track/%23732365
```

**Success Response:**
```json
{
  "id": "cm5order123",
  "orderNumber": "#732365",
  "status": "SHIPPED",
  "subtotal": 3450,
  "discount": 345,
  "shipping": 50,
  "total": 3155,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": "AX123456789",
  "notes": "Please call before delivery",
  "createdAt": "2025-02-08T10:30:00Z",
  "address": {
    "label": "Home",
    "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
  },
  "items": [...]
}
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Order not found"
}
```

---

## 👤 Customer Endpoints

**All customer endpoints require authentication:**
```http
Authorization: Bearer {customer-access-token}
```

### Profile Management

#### Get Customer Profile

**Endpoint:** `GET /customer/profile`  
**Auth Required:** Yes (Customer)  
**Description:** Get current customer's profile with addresses and order stats.

**Success Response:**
```json
{
  "id": "cm5cust123",
  "email": "customer@example.com",
  "fullName": "Ahmed Hassan",
  "phoneNumber": "+201234567890",
  "avatarUrl": "/uploads/avatars/ahmed.jpg",
  "status": "ACTIVE",
  "lastLogin": "2025-02-08T08:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "addresses": [
    {
      "id": "cm5addr1",
      "label": "Home",
      "fullAddress": "123 Main St, Nasr City, Cairo, Egypt",
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": "cm5addr2",
      "label": "Work",
      "fullAddress": "456 Office Tower, Maadi, Cairo, Egypt",
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "totalOrders": 12,
  "totalSpending": 15000
}
```

---

#### Update Customer Profile

**Endpoint:** `PUT /customer/profile`  
**Auth Required:** Yes (Customer)  
**Description:** Update customer profile information.

**Request Body:**
```json
{
  "fullName": "Ahmed Hassan Mohamed",
  "phoneNumber": "+201234567890",
  "avatarUrl": "/uploads/avatars/new-avatar.jpg"
}
```

**Success Response:**
```json
{
  "id": "cm5cust123",
  "email": "customer@example.com",
  "fullName": "Ahmed Hassan Mohamed",
  "phoneNumber": "+201234567890",
  "avatarUrl": "/uploads/avatars/new-avatar.jpg",
  "status": "ACTIVE",
  "lastLogin": "2025-02-08T08:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "addresses": [...],
  "totalOrders": 12,
  "totalSpending": 15000
}
```

**Notes:**
- Email cannot be changed
- All fields are optional
- Phone number can be set to null to clear

---

### Addresses

#### Get All Addresses

**Endpoint:** `GET /customer/addresses`  
**Auth Required:** Yes (Customer)  
**Description:** Get all addresses for current customer.

**Success Response:**
```json
[
  {
    "id": "cm5addr1",
    "label": "Home",
    "fullAddress": "123 Main St, Nasr City, Cairo, Egypt",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": "cm5addr2",
    "label": "Work",
    "fullAddress": "456 Office Tower, Maadi, Cairo, Egypt",
    "createdAt": "2025-01-15T00:00:00Z"
  }
]
```

---

#### Create Address

**Endpoint:** `POST /customer/addresses`  
**Auth Required:** Yes (Customer)  
**Description:** Add new address for current customer.

**Request Body:**
```json
{
  "label": "Parents House",
  "fullAddress": "789 Family St, Heliopolis, Cairo, Egypt"
}
```

**Success Response:**
```json
{
  "id": "cm5addr3",
  "label": "Parents House",
  "fullAddress": "789 Family St, Heliopolis, Cairo, Egypt",
  "createdAt": "2025-02-08T10:00:00Z"
}
```

---

#### Update Address

**Endpoint:** `PUT /customer/addresses/:id`  
**Auth Required:** Yes (Customer)  
**Description:** Update existing address.

**URL Parameters:**
- `id` - Address ID

**Request Body:**
```json
{
  "label": "Office",
  "fullAddress": "Updated Office Address, New Cairo, Egypt"
}
```

**Success Response:**
```json
{
  "id": "cm5addr2",
  "label": "Office",
  "fullAddress": "Updated Office Address, New Cairo, Egypt",
  "createdAt": "2025-01-15T00:00:00Z"
}
```

**Error Response:**
```json
{
  "statusCode": 403,
  "message": "Address not found or unauthorized"
}
```

---

#### Delete Address

**Endpoint:** `DELETE /customer/addresses/:id`  
**Auth Required:** Yes (Customer)  
**Description:** Delete address.

**URL Parameters:**
- `id` - Address ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 403,
  "message": "Address not found or unauthorized"
}
```

---

### Wishlist

#### Get Wishlist

**Endpoint:** `GET /wishlist`  
**Auth Required:** Yes (Customer)  
**Description:** Get all items in customer's wishlist.

**Success Response:**
```json
[
  {
    "id": "cm5wish1",
    "productId": "cm5prod123",
    "product": {
      "id": "cm5prod123",
      "nameEn": "BOUNCE SPORT RUNNING SHOES",
      "nameAr": "حذاء جري باونس سبورت",
      "basePrice": 1630,
      "discountPercentage": 30,
      "finalPrice": 1141,
      "images": ["/uploads/products/bounce-1.jpg"],
      "vendor": "Bounce",
      "availability": "in-stock"
    },
    "createdAt": "2025-02-01T10:00:00Z"
  },
  {
    "id": "cm5wish2",
    "productId": "cm5prod456",
    "product": {
      "id": "cm5prod456",
      "nameEn": "Nike Air Max",
      "nameAr": "نايك إير ماكس",
      "basePrice": 1300,
      "discountPercentage": 0,
      "finalPrice": 1300,
      "images": ["/uploads/products/nike-1.jpg"],
      "vendor": "Nike",
      "availability": "low-stock"
    },
    "createdAt": "2025-02-05T14:30:00Z"
  }
]
```

---

#### Add to Wishlist

**Endpoint:** `POST /wishlist`  
**Auth Required:** Yes (Customer)  
**Description:** Add product to wishlist.

**Request Body:**
```json
{
  "productId": "cm5prod789"
}
```

**Success Response:**
```json
{
  "id": "cm5wish3",
  "productId": "cm5prod789",
  "product": {
    "id": "cm5prod789",
    "nameEn": "AlAhly 2025 Jersey",
    "nameAr": "قميص الأهلي 2025",
    "basePrice": 1140,
    "discountPercentage": 0,
    "finalPrice": 1140,
    "images": ["/uploads/products/jersey-1.jpg"],
    "vendor": "Adidas",
    "availability": "in-stock"
  },
  "createdAt": "2025-02-08T11:00:00Z"
}
```

**Error Responses:**
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

```json
{
  "statusCode": 409,
  "message": "Product already in wishlist"
}
```

---

#### Remove from Wishlist

**Endpoint:** `DELETE /wishlist/:productId`  
**Auth Required:** Yes (Customer)  
**Description:** Remove product from wishlist.

**URL Parameters:**
- `productId` - Product ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Item not found in wishlist"
}
```

---

#### Clear Wishlist

**Endpoint:** `DELETE /wishlist`  
**Auth Required:** Yes (Customer)  
**Description:** Remove all items from wishlist.

**Success Response:**
```
204 No Content
```

---

### Customer Orders

#### Create Order (Authenticated Customer)

**Endpoint:** `POST /orders`  
**Auth Required:** Yes (Customer)  
**Description:** Place order as authenticated customer.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "cm5prod123",
      "color": "Black",
      "size": "EU- 42",
      "quantity": 2
    }
  ],
  "addressId": "cm5addr1",
  "paymentMethod": "Cash on Delivery",
  "notes": "Please call before delivery",
  "couponCode": "SUMMER25"
}
```

**Success Response:**
```json
{
  "id": "cm5order456",
  "orderNumber": "#845621",
  "status": "ORDER_PLACED",
  "subtotal": 2282,
  "discount": 228.2,
  "shipping": 50,
  "total": 2103.8,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": null,
  "notes": "Please call before delivery",
  "createdAt": "2025-02-08T11:30:00Z",
  "address": {
    "label": "Home",
    "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
  },
  "items": [
    {
      "id": "cm5item3",
      "productName": "BOUNCE SPORT RUNNING SHOES",
      "productImage": "/uploads/products/bounce-1.jpg",
      "sku": "364U0w2",
      "vendor": "Bounce",
      "type": "RUNNING SHOES",
      "gender": "UNISEX",
      "color": "Black",
      "size": "EU- 42",
      "price": 1141,
      "originalPrice": 1630,
      "quantity": 2,
      "discount": "30% OFF"
    }
  ]
}
```

**Notes:**
- Uses existing customer addresses
- Customer info auto-filled from profile
- Same stock validation as guest checkout

---

#### Get Customer Orders

**Endpoint:** `GET /orders`  
**Auth Required:** Yes (Customer)  
**Description:** Get all orders for current customer with pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | all | Filter by status |

**Status Options:**
- `all` - All orders
- `order-placed` - New orders
- `processed` - Being prepared
- `shipped` - In transit
- `delivered` - Completed
- `cancelled` - Cancelled orders

**Example Request:**
```http
GET /orders?page=1&limit=10&status=shipped
```

**Success Response:**
```json
{
  "orders": [
    {
      "id": "cm5order456",
      "orderNumber": "#845621",
      "status": "SHIPPED",
      "subtotal": 2282,
      "discount": 228.2,
      "shipping": 50,
      "total": 2103.8,
      "currency": "EGP",
      "paymentMethod": "Cash on Delivery",
      "deliveryDate": null,
      "trackingNumber": "AX987654321",
      "createdAt": "2025-02-08T11:30:00Z",
      "address": {
        "label": "Home",
        "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
      },
      "items": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

#### Get Order by ID

**Endpoint:** `GET /orders/:id`  
**Auth Required:** Yes (Customer)  
**Description:** Get detailed order information.

**URL Parameters:**
- `id` - Order ID

**Success Response:**
```json
{
  "id": "cm5order456",
  "orderNumber": "#845621",
  "status": "SHIPPED",
  "subtotal": 2282,
  "discount": 228.2,
  "shipping": 50,
  "total": 2103.8,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": "AX987654321",
  "notes": "Please call before delivery",
  "createdAt": "2025-02-08T11:30:00Z",
  "address": {
    "label": "Home",
    "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
  },
  "items": [
    {
      "id": "cm5item3",
      "productName": "BOUNCE SPORT RUNNING SHOES",
      "productImage": "/uploads/products/bounce-1.jpg",
      "sku": "364U0w2",
      "vendor": "Bounce",
      "type": "RUNNING SHOES",
      "gender": "UNISEX",
      "color": "Black",
      "size": "EU- 42",
      "price": 1141,
      "originalPrice": 1630,
      "quantity": 2,
      "discount": "30% OFF"
    }
  ]
}
```

**Error Responses:**
```json
{
  "statusCode": 404,
  "message": "Order not found"
}
```

```json
{
  "statusCode": 403,
  "message": "Unauthorized"
}
```

---

## 🔧 Admin Endpoints

**All admin endpoints require admin authentication:**
```http
Authorization: Bearer {admin-access-token}
```

### Admin Products

#### Get All Products (Admin View)

**Endpoint:** `GET /admin/products`  
**Auth Required:** Yes (Admin)  
**Description:** Get all products with admin-specific fields and filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `search` | string | - | Search by name, SKU, vendor |
| `status` | enum | - | Filter by status (PUBLISHED, UNPUBLISHED, DRAFT) |
| `category` | string | - | Filter by category ID |

**Example Request:**
```http
GET /admin/products?page=1&limit=20&search=nike&status=PUBLISHED&category=cm5cat1
```

**Success Response:**
```json
{
  "products": [
    {
      "id": "cm5prod123",
      "sku": "364U0w2",
      "nameEn": "BOUNCE SPORT RUNNING SHOES",
      "nameAr": "حذاء جري باونس سبورت",
      "basePrice": 1630,
      "discountPercentage": 30,
      "vendor": "Bounce",
      "type": "RUNNING SHOES",
      "status": "PUBLISHED",
      "totalStock": 50,
      "availability": "In Stock",
      "viewCount": 245,
      "totalOrders": 12,
      "createdAt": "2025-01-30T10:00:00Z",
      "category": "Men",
      "subCategory": "Footwear",
      "productList": "Running"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Availability Values:**
- `In Stock` - totalStock > 10
- `Low Stock` - totalStock 1-10
- `Out of Stock` - totalStock = 0

---

#### Get Product by ID (Admin View)

**Endpoint:** `GET /admin/products/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Get complete product details including all variants.

**URL Parameters:**
- `id` - Product ID

**Success Response:**
```json
{
  "id": "cm5prod123",
  "productListId": "cm5list1",
  "sku": "364U0w2",
  "nameEn": "BOUNCE SPORT RUNNING SHOES",
  "nameAr": "حذاء جري باونس سبورت",
  "descriptionEn": "Designed to follow the contour of your foot...",
  "descriptionAr": "مصمم ليتبع شكل قدمك...",
  "detailsEn": ["Regular fit", "Mesh upper", "Bounce midsole"],
  "detailsAr": ["ملاءمة عادية", "جزء علوي شبكي", "نعل أوسط باونس"],
  "basePrice": 1630,
  "discountPercentage": 30,
  "vendor": "Bounce",
  "gender": "UNISEX",
  "type": "RUNNING SHOES",
  "status": "PUBLISHED",
  "sizeChartUrl": "/uploads/size-charts/bounce.jpg",
  "viewCount": 245,
  "createdAt": "2025-01-30T10:00:00Z",
  "updatedAt": "2025-02-01T14:20:00Z",
  "images": [
    {
      "id": "cm5img1",
      "url": "/uploads/products/bounce-1.jpg",
      "order": 0,
      "createdAt": "2025-01-30T10:00:00Z"
    },
    {
      "id": "cm5img2",
      "url": "/uploads/products/bounce-2.jpg",
      "order": 1,
      "createdAt": "2025-01-30T10:00:00Z"
    }
  ],
  "variants": [
    {
      "id": "cm5var1",
      "color": "Black",
      "size": "EU- 35",
      "quantity": 15,
      "createdAt": "2025-01-30T10:00:00Z"
    },
    {
      "id": "cm5var2",
      "color": "Black",
      "size": "EU- 36",
      "quantity": 12,
      "createdAt": "2025-01-30T10:00:00Z"
    },
    {
      "id": "cm5var3",
      "color": "Pink",
      "size": "EU- 35",
      "quantity": 10,
      "createdAt": "2025-01-30T10:00:00Z"
    }
  ],
  "productList": {
    "id": "cm5list1",
    "nameEn": "Running",
    "nameAr": "جري",
    "subCategory": {
      "id": "cm5sub1",
      "nameEn": "Footwear",
      "nameAr": "أحذية",
      "category": {
        "id": "cm5cat1",
        "nameEn": "Men",
        "nameAr": "رجال"
      }
    }
  }
}
```

---

#### Create Product

**Endpoint:** `POST /admin/products`  
**Auth Required:** Yes (Admin)  
**Description:** Create new product with images and variants.

**Request Body:**
```json
{
  "productListId": "cm5list1",
  "sku": "NIKE123",
  "nameEn": "Nike Air Max 2025",
  "nameAr": "نايك إير ماكس 2025",
  "descriptionEn": "Premium running shoes with Air Max technology",
  "descriptionAr": "أحذية جري ممتازة بتقنية إير ماكس",
  "detailsEn": [
    "Regular fit",
    "Mesh upper",
    "Air Max cushioning"
  ],
  "detailsAr": [
    "ملاءمة عادية",
    "جزء علوي شبكي",
    "توسيد إير ماكس"
  ],
  "basePrice": 1500,
  "discountPercentage": 20,
  "vendor": "Nike",
  "gender": "MEN",
  "type": "RUNNING SHOES",
  "status": "PUBLISHED",
  "sizeChartUrl": "/uploads/size-charts/nike.jpg",
  "imageUrls": [
    "/uploads/products/nike-air-1.jpg",
    "/uploads/products/nike-air-2.jpg",
    "/uploads/products/nike-air-3.jpg"
  ],
  "variants": [
    {
      "color": "Black",
      "size": "EU- 42",
      "quantity": 20
    },
    {
      "color": "Black",
      "size": "EU- 43",
      "quantity": 15
    },
    {
      "color": "White",
      "size": "EU- 42",
      "quantity": 10
    },
    {
      "color": "White",
      "size": "EU- 43",
      "quantity": 8
    }
  ]
}
```

**Field Requirements:**
- `productListId` - Must exist (required)
- `sku` - Must be unique (required)
- `nameEn`, `nameAr` - Required
- `descriptionEn`, `descriptionAr` - Optional
- `detailsEn`, `detailsAr` - Array of strings (optional)
- `basePrice` - Required, must be > 0
- `discountPercentage` - Required, 0-100
- `vendor` - Required
- `gender` - Enum: UNISEX, MEN, WOMEN, KIDS
- `type` - Required
- `status` - Enum: PUBLISHED, UNPUBLISHED, DRAFT
- `sizeChartUrl` - Optional
- `imageUrls` - Array of image URLs (required, min 1)
- `variants` - Array of variants (required, min 1)

**Success Response:**
```json
{
  "id": "cm5prod999",
  "sku": "NIKE123",
  "nameEn": "Nike Air Max 2025",
  "nameAr": "نايك إير ماكس 2025",
  "basePrice": 1500,
  "discountPercentage": 20,
  "vendor": "Nike",
  "type": "RUNNING SHOES",
  "status": "PUBLISHED",
  "totalStock": 53,
  "availability": "In Stock",
  "viewCount": 0,
  "totalOrders": 0,
  "createdAt": "2025-02-08T12:00:00Z",
  "category": "Men",
  "subCategory": "Footwear",
  "productList": "Running"
}
```

**Error Responses:**
```json
{
  "statusCode": 409,
  "message": "SKU already exists"
}
```

```json
{
  "statusCode": 404,
  "message": "Product list not found"
}
```

---

#### Update Product

**Endpoint:** `PUT /admin/products/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update product information, images, and/or variants.

**URL Parameters:**
- `id` - Product ID

**Request Body (all fields optional):**
```json
{
  "productListId": "cm5list2",
  "nameEn": "Updated Product Name",
  "nameAr": "اسم المنتج المحدث",
  "descriptionEn": "Updated description",
  "descriptionAr": "وصف محدث",
  "detailsEn": ["New detail 1", "New detail 2"],
  "detailsAr": ["تفصيل جديد 1", "تفصيل جديد 2"],
  "basePrice": 1600,
  "discountPercentage": 25,
  "vendor": "Nike",
  "gender": "WOMEN",
  "type": "TRAINING SHOES",
  "status": "UNPUBLISHED",
  "sizeChartUrl": "/uploads/size-charts/updated.jpg",
  "imageUrls": [
    "/uploads/products/new-image-1.jpg",
    "/uploads/products/new-image-2.jpg"
  ],
  "variants": [
    {
      "color": "Red",
      "size": "EU- 38",
      "quantity": 25
    }
  ]
}
```

**Success Response:**
```json
{
  "id": "cm5prod123",
  "sku": "364U0w2",
  "nameEn": "Updated Product Name",
  "nameAr": "اسم المنتج المحدث",
  "basePrice": 1600,
  "discountPercentage": 25,
  "vendor": "Nike",
  "type": "TRAINING SHOES",
  "status": "UNPUBLISHED",
  "totalStock": 25,
  "availability": "In Stock",
  "viewCount": 245,
  "totalOrders": 12,
  "createdAt": "2025-01-30T10:00:00Z",
  "category": "Men",
  "subCategory": "Footwear",
  "productList": "Training"
}
```

**Notes:**
- If `imageUrls` provided: replaces all images
- If `variants` provided: replaces all variants
- SKU cannot be changed
- All other fields optional

---

#### Delete Product

**Endpoint:** `DELETE /admin/products/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete product (only if no orders exist).

**URL Parameters:**
- `id` - Product ID

**Success Response:**
```
204 No Content
```

**Error Responses:**
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

```json
{
  "statusCode": 409,
  "message": "Cannot delete product with existing orders. Set status to UNPUBLISHED instead."
}
```

---

### Admin Categories

#### Get All Categories (Admin View)

**Endpoint:** `GET /admin/categories`  
**Auth Required:** Yes (Admin)  
**Description:** Get all categories with statistics.

**Success Response:**
```json
[
  {
    "id": "cm5cat1",
    "nameEn": "Men",
    "nameAr": "رجال",
    "icon": "/uploads/icons/men.svg",
    "status": true,
    "order": 1,
    "totalSubCategories": 2,
    "totalProducts": 45,
    "createdAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": "cm5cat2",
    "nameEn": "Women",
    "nameAr": "نساء",
    "icon": "/uploads/icons/women.svg",
    "status": true,
    "order": 2,
    "totalSubCategories": 3,
    "totalProducts": 32,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

---

#### Get Category by ID (Admin View)

**Endpoint:** `GET /admin/categories/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Get complete category hierarchy.

**URL Parameters:**
- `id` - Category ID

**Success Response:**
```json
{
  "id": "cm5cat1",
  "nameEn": "Men",
  "nameAr": "رجال",
  "icon": "/uploads/icons/men.svg",
  "status": true,
  "order": 1,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "subCategories": [
    {
      "id": "cm5sub1",
      "categoryId": "cm5cat1",
      "nameEn": "Footwear",
      "nameAr": "أحذية",
      "icon": "/uploads/icons/shoes.svg",
      "order": 1,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z",
      "productLists": [
        {
          "id": "cm5list1",
          "subCategoryId": "cm5sub1",
          "nameEn": "Running",
          "nameAr": "جري",
          "order": 1,
          "createdAt": "2025-01-01T00:00:00Z",
          "updatedAt": "2025-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

---

#### Create Category

**Endpoint:** `POST /admin/categories`  
**Auth Required:** Yes (Admin)  
**Description:** Create new category.

**Request Body:**
```json
{
  "nameEn": "Kids",
  "nameAr": "أطفال",
  "icon": "/uploads/icons/kids.svg",
  "status": true,
  "order": 3
}
```

**Field Requirements:**
- `nameEn`, `nameAr` - Required
- `icon` - Optional
- `status` - Optional, default: true
- `order` - Optional, default: 0

**Success Response:**
```json
{
  "id": "cm5cat3",
  "nameEn": "Kids",
  "nameAr": "أطفال",
  "icon": "/uploads/icons/kids.svg",
  "status": true,
  "order": 3,
  "totalSubCategories": 0,
  "totalProducts": 0,
  "createdAt": "2025-02-08T12:30:00Z"
}
```

---

#### Update Category

**Endpoint:** `PUT /admin/categories/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update category information.

**URL Parameters:**
- `id` - Category ID

**Request Body (all fields optional):**
```json
{
  "nameEn": "Updated Category Name",
  "nameAr": "اسم الفئة المحدث",
  "icon": "/uploads/icons/new-icon.svg",
  "status": false,
  "order": 5
}
```

**Success Response:**
```json
{
  "id": "cm5cat1",
  "nameEn": "Updated Category Name",
  "nameAr": "اسم الفئة المحدث",
  "icon": "/uploads/icons/new-icon.svg",
  "status": false,
  "order": 5,
  "totalSubCategories": 2,
  "totalProducts": 45,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

#### Delete Category

**Endpoint:** `DELETE /admin/categories/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete category (only if no products exist).

**URL Parameters:**
- `id` - Category ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 409,
  "message": "Cannot delete category with existing products"
}
```

---

#### Create SubCategory

**Endpoint:** `POST /admin/categories/subcategories`  
**Auth Required:** Yes (Admin)  
**Description:** Create new subcategory under a category.

**Request Body:**
```json
{
  "categoryId": "cm5cat1",
  "nameEn": "Accessories",
  "nameAr": "إكسسوارات",
  "icon": "/uploads/icons/accessories.svg",
  "order": 3
}
```

**Field Requirements:**
- `categoryId` - Required, must exist
- `nameEn`, `nameAr` - Required
- `icon` - Optional
- `order` - Optional, default: 0

**Success Response:**
```json
{
  "id": "cm5sub3",
  "categoryId": "cm5cat1",
  "nameEn": "Accessories",
  "nameAr": "إكسسوارات",
  "icon": "/uploads/icons/accessories.svg",
  "order": 3,
  "createdAt": "2025-02-08T13:00:00Z",
  "updatedAt": "2025-02-08T13:00:00Z",
  "category": {
    "id": "cm5cat1",
    "nameEn": "Men",
    "nameAr": "رجال"
  },
  "productLists": []
}
```

---

#### Update SubCategory

**Endpoint:** `PUT /admin/categories/subcategories/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update subcategory information.

**URL Parameters:**
- `id` - SubCategory ID

**Request Body (all fields optional):**
```json
{
  "nameEn": "Updated SubCategory",
  "nameAr": "فئة فرعية محدثة",
  "icon": "/uploads/icons/new-icon.svg",
  "order": 5
}
```

**Success Response:**
```json
{
  "id": "cm5sub1",
  "categoryId": "cm5cat1",
  "nameEn": "Updated SubCategory",
  "nameAr": "فئة فرعية محدثة",
  "icon": "/uploads/icons/new-icon.svg",
  "order": 5,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-02-08T13:30:00Z",
  "category": {...},
  "productLists": [...]
}
```

---

#### Delete SubCategory

**Endpoint:** `DELETE /admin/categories/subcategories/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete subcategory (only if no products exist).

**URL Parameters:**
- `id` - SubCategory ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 409,
  "message": "Cannot delete subcategory with existing products"
}
```

---

#### Create Product List

**Endpoint:** `POST /admin/categories/product-lists`  
**Auth Required:** Yes (Admin)  
**Description:** Create new product list under a subcategory.

**Request Body:**
```json
{
  "subCategoryId": "cm5sub1",
  "nameEn": "Basketball",
  "nameAr": "كرة سلة",
  "order": 4
}
```

**Field Requirements:**
- `subCategoryId` - Required, must exist
- `nameEn`, `nameAr` - Required
- `order` - Optional, default: 0

**Success Response:**
```json
{
  "id": "cm5list4",
  "subCategoryId": "cm5sub1",
  "nameEn": "Basketball",
  "nameAr": "كرة سلة",
  "order": 4,
  "createdAt": "2025-02-08T14:00:00Z",
  "updatedAt": "2025-02-08T14:00:00Z",
  "subCategory": {
    "id": "cm5sub1",
    "nameEn": "Footwear",
    "nameAr": "أحذية",
    "category": {
      "id": "cm5cat1",
      "nameEn": "Men",
      "nameAr": "رجال"
    }
  },
  "products": []
}
```

---

#### Update Product List

**Endpoint:** `PUT /admin/categories/product-lists/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Update product list information.

**URL Parameters:**
- `id` - ProductList ID

**Request Body (all fields optional):**
```json
{
  "nameEn": "Updated Product List",
  "nameAr": "قائمة منتجات محدثة",
  "order": 6
}
```

**Success Response:**
```json
{
  "id": "cm5list1",
  "subCategoryId": "cm5sub1",
  "nameEn": "Updated Product List",
  "nameAr": "قائمة منتجات محدثة",
  "order": 6,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-02-08T14:30:00Z",
  "subCategory": {...},
  "products": [...]
}
```

---

#### Delete Product List

**Endpoint:** `DELETE /admin/categories/product-lists/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete product list (only if no products exist).

**URL Parameters:**
- `id` - ProductList ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 409,
  "message": "Cannot delete product list with existing products"
}
```

---

### Admin Orders

#### Get All Orders (Admin View)

**Endpoint:** `GET /admin/orders`  
**Auth Required:** Yes (Admin)  
**Description:** Get all orders with filtering and statistics.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | all | Filter by status |
| `search` | string | - | Search by order number, customer name, email |

**Status Options:**
- `all` - All orders
- `order-placed` - ORDER_PLACED
- `processed` - PROCESSED
- `shipped` - SHIPPED
- `delivered` - DELIVERED
- `cancelled` - CANCELLED

**Example Request:**
```http
GET /admin/orders?page=1&limit=20&status=in-progress&search=john
```

**Success Response:**
```json
{
  "orders": [
    {
      "id": "cm5order123",
      "orderNumber": "#732365",
      "customer": {
        "id": "cm5cust456",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "status": "PROCESSED",
      "itemsCount": 3,
      "total": 3450,
      "currency": "EGP",
      "paymentMethod": "Cash on Delivery",
      "deliveryDate": null,
      "trackingNumber": null,
      "createdAt": "2025-01-25T10:00:00Z",
      "address": {
        "label": "Home",
        "fullAddress": "123 Main St, Cairo, Egypt"
      },
      "items": [
        {
          "id": "cm5item1",
          "productName": "BOUNCE SPORT RUNNING SHOES",
          "productImage": "/uploads/products/bounce-1.jpg",
          "sku": "364U0w2",
          "vendor": "Bounce",
          "color": "Black",
          "size": "EU- 42",
          "price": 1141,
          "quantity": 2
        }
      ],
      "statusHistory": [
        {
          "status": "ORDER_PLACED",
          "notes": "Order placed successfully",
          "createdAt": "2025-01-25T10:00:00Z"
        },
        {
          "status": "PROCESSED",
          "notes": "Order is being prepared",
          "createdAt": "2025-01-25T14:30:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "stats": {
    "totalOrders": 150,
    "activeOrders": 45,
    "completedOrders": 95,
    "cancelledOrders": 10,
    "totalRevenue": 125000
  }
}
```

---

#### Get Order by ID (Admin View)

**Endpoint:** `GET /admin/orders/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Get complete order details including customer info.

**URL Parameters:**
- `id` - Order ID

**Success Response:**
```json
{
  "id": "cm5order123",
  "orderNumber": "#732365",
  "customer": {
    "id": "cm5cust456",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "status": "PROCESSED",
  "itemsCount": 3,
  "total": 3450,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": null,
  "createdAt": "2025-01-25T10:00:00Z",
  "address": {
    "label": "Home",
    "fullAddress": "123 Main St, Cairo, Egypt"
  },
  "items": [
    {
      "id": "cm5item1",
      "productName": "BOUNCE SPORT RUNNING SHOES",
      "productImage": "/uploads/products/bounce-1.jpg",
      "sku": "364U0w2",
      "vendor": "Bounce",
      "color": "Black",
      "size": "EU- 42",
      "price": 1141,
      "quantity": 2
    }
  ],
  "statusHistory": [
    {
      "status": "ORDER_PLACED",
      "notes": "Order placed successfully",
      "createdAt": "2025-01-25T10:00:00Z"
    },
    {
      "status": "PROCESSED",
      "notes": "Order is being prepared",
      "createdAt": "2025-01-25T14:30:00Z"
    }
  ]
}
```

---

#### Update Order Status

**Endpoint:** `PUT /admin/orders/:id/status`  
**Auth Required:** Yes (Admin)  
**Description:** Update order status and add notes.

**URL Parameters:**
- `id` - Order ID

**Request Body:**
```json
{
  "status": "SHIPPED",
  "notes": "Order shipped via Aramex",
  "trackingNumber": "AX123456789"
}
```

**Status Values:**
- `ORDER_PLACED`
- `PROCESSED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Field Requirements:**
- `status` - Required, must be valid enum
- `notes` - Optional
- `trackingNumber` - Optional (recommended for SHIPPED status)

**Success Response:**
```json
{
  "id": "cm5order123",
  "orderNumber": "#732365",
  "customer": {...},
  "status": "SHIPPED",
  "itemsCount": 3,
  "total": 3450,
  "currency": "EGP",
  "paymentMethod": "Cash on Delivery",
  "deliveryDate": null,
  "trackingNumber": "AX123456789",
  "createdAt": "2025-01-25T10:00:00Z",
  "address": {...},
  "items": [...],
  "statusHistory": [
    {
      "status": "ORDER_PLACED",
      "notes": "Order placed successfully",
      "createdAt": "2025-01-25T10:00:00Z"
    },
    {
      "status": "PROCESSED",
      "notes": "Order is being prepared",
      "createdAt": "2025-01-25T14:30:00Z"
    },
    {
      "status": "SHIPPED",
      "notes": "Order shipped via Aramex",
      "createdAt": "2025-02-08T15:00:00Z"
    }
  ]
}
```

**Notes:**
- Status history is automatically created
- Setting status to DELIVERED auto-sets deliveryDate
- Tracking number can be updated anytime

---

#### Delete Order

**Endpoint:** `DELETE /admin/orders/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete order (permanent action).

**URL Parameters:**
- `id` - Order ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Order not found"
}
```

**Notes:**
- This is a destructive action
- Consider cancelling orders instead of deleting
- Use with caution

---

### Admin Customers

#### Get All Customers

**Endpoint:** `GET /admin/customers`  
**Auth Required:** Yes (Admin)  
**Description:** Get all customers with filtering and statistics.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | all | Filter by status (all, active, blocked) |
| `search` | string | - | Search by name, email, phone |

**Example Request:**
```http
GET /admin/customers?page=1&limit=20&status=active&search=john
```

**Success Response:**
```json
{
  "customers": [
    {
      "id": "cm5cust123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+201234567890",
      "avatarUrl": null,
      "status": "ACTIVE",
      "lastLogin": "2025-01-30T08:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "totalOrders": 12,
      "totalSpending": 15000,
      "addresses": [
        {
          "id": "cm5addr1",
          "label": "Home",
          "fullAddress": "123 Main St, Cairo, Egypt"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 350,
    "totalPages": 18
  },
  "stats": {
    "totalCustomers": 350,
    "activeCustomers": 340,
    "blockedCustomers": 10
  }
}
```

---

#### Get Customer by ID

**Endpoint:** `GET /admin/customers/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Get detailed customer information.

**URL Parameters:**
- `id` - Customer ID

**Success Response:**
```json
{
  "id": "cm5cust123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+201234567890",
  "avatarUrl": "/uploads/avatars/john.jpg",
  "status": "ACTIVE",
  "lastLogin": "2025-01-30T08:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "totalOrders": 12,
  "totalSpending": 15000,
  "addresses": [
    {
      "id": "cm5addr1",
      "label": "Home",
      "fullAddress": "123 Main St, Nasr City, Cairo, Egypt"
    },
    {
      "id": "cm5addr2",
      "label": "Work",
      "fullAddress": "456 Office Tower, Maadi, Cairo, Egypt"
    }
  ]
}
```

---

#### Update Customer Status (Block/Unblock)

**Endpoint:** `PUT /admin/customers/:id/status`  
**Auth Required:** Yes (Admin)  
**Description:** Block or unblock customer account.

**URL Parameters:**
- `id` - Customer ID

**Request Body:**
```json
{
  "status": "BLOCKED"
}
```

**Status Values:**
- `ACTIVE` - Normal account
- `BLOCKED` - Blocked account (cannot login)

**Success Response:**
```json
{
  "id": "cm5cust123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+201234567890",
  "avatarUrl": "/uploads/avatars/john.jpg",
  "status": "BLOCKED",
  "lastLogin": "2025-01-30T08:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "totalOrders": 12,
  "totalSpending": 15000,
  "addresses": [...]
}
```

**Notes:**
- Blocked customers cannot login
- Existing sessions remain valid until token expires
- Use this instead of deleting customers with orders

---

#### Get Customer Orders

**Endpoint:** `GET /admin/customers/:id/orders`  
**Auth Required:** Yes (Admin)  
**Description:** Get all orders for specific customer.

**URL Parameters:**
- `id` - Customer ID

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

**Success Response:**
```json
{
  "orders": [
    {
      "id": "cm5order456",
      "orderNumber": "#845621",
      "status": "DELIVERED",
      "total": 2103.8,
      "itemsCount": 2,
      "createdAt": "2025-02-08T11:30:00Z"
    },
    {
      "id": "cm5order789",
      "orderNumber": "#912345",
      "status": "SHIPPED",
      "total": 3250,
      "itemsCount": 3,
      "createdAt": "2025-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2
  }
}
```

---

#### Delete Customer

**Endpoint:** `DELETE /admin/customers/:id`  
**Auth Required:** Yes (Admin)  
**Description:** Delete customer (only if no orders exist).

**URL Parameters:**
- `id` - Customer ID

**Success Response:**
```
204 No Content
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Cannot delete customer with existing orders. Block them instead."
}
```

**Notes:**
- Cannot delete customers with orders
- Block customers instead to preserve order history
- Deletion is permanent

---

### Admin Content

#### Hero Sections

##### Get All Hero Sections

**Endpoint:** `GET /admin/content/hero-sections`  
**Auth Required:** Yes (Admin)

**Success Response:**
```json
[
  {
    "id": "cm5hero1",
    "headlineEn": "SUMMER COLLECTION",
    "headlineAr": "مجموعة الصيف",
    "descriptionEn": "Up to 50% OFF",
    "descriptionAr": "خصم حتى 50%",
    "price": 990,
    "mainImageUrl": "/uploads/heroes/summer.jpg",
    "variantImages": [
      "/uploads/heroes/summer-var1.jpg",
      "/uploads/heroes/summer-var2.jpg"
    ],
    "ctaTextEn": "SHOP NOW",
    "ctaTextAr": "تسوق الآن",
    "ctaLink": "/category/summer",
    "order": 1,
    "status": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-20T14:30:00Z"
  }
]
```

---

##### Create Hero Section

**Endpoint:** `POST /admin/content/hero-sections`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "headlineEn": "WINTER SALE",
  "headlineAr": "تخفيضات الشتاء",
  "descriptionEn": "Biggest discounts of the year",
  "descriptionAr": "أكبر خصومات العام",
  "price": 1200,
  "mainImageUrl": "/uploads/heroes/winter-main.jpg",
  "variantImages": [
    "/uploads/heroes/winter-var1.jpg",
    "/uploads/heroes/winter-var2.jpg",
    "/uploads/heroes/winter-var3.jpg"
  ],
  "ctaTextEn": "BROWSE DEALS",
  "ctaTextAr": "تصفح العروض",
  "ctaLink": "/offers/winter-sale",
  "order": 1,
  "status": true
}
```

**Field Requirements:**
- `headlineEn`, `headlineAr` - Required
- `descriptionEn`, `descriptionAr` - Optional
- `price` - Optional
- `mainImageUrl` - Required
- `variantImages` - Required (array of URLs)
- `ctaTextEn`, `ctaTextAr` - Optional
- `ctaLink` - Optional
- `order` - Optional, default: 0
- `status` - Optional, default: true

**Success Response:**
```json
{
  "id": "cm5hero2",
  "headlineEn": "WINTER SALE",
  "headlineAr": "تخفيضات الشتاء",
  "descriptionEn": "Biggest discounts of the year",
  "descriptionAr": "أكبر خصومات العام",
  "price": 1200,
  "mainImageUrl": "/uploads/heroes/winter-main.jpg",
  "variantImages": [...],
  "ctaTextEn": "BROWSE DEALS",
  "ctaTextAr": "تصفح العروض",
  "ctaLink": "/offers/winter-sale",
  "order": 1,
  "status": true,
  "createdAt": "2025-02-08T16:00:00Z",
  "updatedAt": "2025-02-08T16:00:00Z"
}
```

---

##### Update Hero Section

**Endpoint:** `PUT /admin/content/hero-sections/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Hero Section ID

**Request Body (all fields optional):**
```json
{
  "headlineEn": "Updated Headline",
  "price": 1500,
  "status": false
}
```

---

##### Delete Hero Section

**Endpoint:** `DELETE /admin/content/hero-sections/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Hero Section ID

**Success Response:**
```
204 No Content
```

---

#### Vendors

##### Get All Vendors

**Endpoint:** `GET /admin/content/vendors`  
**Auth Required:** Yes (Admin)

**Success Response:**
```json
[
  {
    "id": "cm5vend1",
    "name": "Nike",
    "logoUrl": "/uploads/brands/nike.png",
    "order": 1,
    "status": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": "cm5vend2",
    "name": "Adidas",
    "logoUrl": "/uploads/brands/adidas.png",
    "order": 2,
    "status": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

##### Create Vendor

**Endpoint:** `POST /admin/content/vendors`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Puma",
  "logoUrl": "/uploads/brands/puma.png",
  "order": 3,
  "status": true
}
```

**Field Requirements:**
- `name` - Required
- `logoUrl` - Required
- `order` - Optional, default: 0
- `status` - Optional, default: true

**Success Response:**
```json
{
  "id": "cm5vend3",
  "name": "Puma",
  "logoUrl": "/uploads/brands/puma.png",
  "order": 3,
  "status": true,
  "createdAt": "2025-02-08T16:30:00Z",
  "updatedAt": "2025-02-08T16:30:00Z"
}
```

---

##### Update Vendor

**Endpoint:** `PUT /admin/content/vendors/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Vendor ID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "logoUrl": "/uploads/brands/new-logo.png",
  "order": 5,
  "status": false
}
```

---

##### Delete Vendor

**Endpoint:** `DELETE /admin/content/vendors/:id`  
**Auth Required:** Yes (Admin)

**Success Response:**
```
204 No Content
```

---

#### Banners

##### Get All Banners

**Endpoint:** `GET /admin/content/banners`  
**Auth Required:** Yes (Admin)

**Success Response:**
```json
[
  {
    "id": "cm5ban1",
    "imageUrl": "/uploads/banners/black-friday.png",
    "titleEn": "BLACK FRIDAY",
    "titleAr": "الجمعة السوداء",
    "link": "/offers/black-friday",
    "order": 1,
    "status": true,
    "createdAt": "2025-01-10T00:00:00Z",
    "updatedAt": "2025-01-10T00:00:00Z"
  }
]
```

---

##### Create Banner

**Endpoint:** `POST /admin/content/banners`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "imageUrl": "/uploads/banners/new-year.png",
  "titleEn": "NEW YEAR SALE",
  "titleAr": "تخفيضات العام الجديد",
  "link": "/offers/new-year",
  "order": 2,
  "status": true
}
```

**Field Requirements:**
- `imageUrl` - Required
- `titleEn`, `titleAr` - Optional
- `link` - Optional
- `order` - Optional, default: 0
- `status` - Optional, default: true

**Success Response:**
```json
{
  "id": "cm5ban2",
  "imageUrl": "/uploads/banners/new-year.png",
  "titleEn": "NEW YEAR SALE",
  "titleAr": "تخفيضات العام الجديد",
  "link": "/offers/new-year",
  "order": 2,
  "status": true,
  "createdAt": "2025-02-08T17:00:00Z",
  "updatedAt": "2025-02-08T17:00:00Z"
}
```

---

##### Update Banner

**Endpoint:** `PUT /admin/content/banners/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Banner ID

**Request Body (all fields optional):**
```json
{
  "imageUrl": "/uploads/banners/updated.png",
  "titleEn": "Updated Title",
  "status": false
}
```

---

##### Delete Banner

**Endpoint:** `DELETE /admin/content/banners/:id`  
**Auth Required:** Yes (Admin)

**Success Response:**
```
204 No Content
```

---

#### Featured Products Configuration

##### Get Featured Products Config

**Endpoint:** `GET /admin/content/featured-products`  
**Auth Required:** Yes (Admin)

**Success Response:**
```json
{
  "id": "cm5feat1",
  "autoChoose": false,
  "selectedProducts": [
    "cm5prod123",
    "cm5prod456",
    "cm5prod789"
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-02-01T10:00:00Z"
}
```

---

##### Update Featured Products Config

**Endpoint:** `PUT /admin/content/featured-products`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "autoChoose": false,
  "selectedProducts": [
    "cm5prod123",
    "cm5prod456",
    "cm5prod789",
    "cm5prod012",
    "cm5prod345"
  ]
}
```

**Options:**
- `autoChoose: true` - Automatically select most viewed products
- `autoChoose: false` - Use manual selection from selectedProducts array

**Field Requirements:**
- `autoChoose` - Required (boolean)
- `selectedProducts` - Optional (array of product IDs), used only when autoChoose=false

**Success Response:**
```json
{
  "id": "cm5feat1",
  "autoChoose": false,
  "selectedProducts": [
    "cm5prod123",
    "cm5prod456",
    "cm5prod789",
    "cm5prod012",
    "cm5prod345"
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-02-08T17:30:00Z"
}
```

---

### Admin Offers

#### Get All Offers

**Endpoint:** `GET /admin/offers`  
**Auth Required:** Yes (Admin)  
**Description:** Get all offers with optional status filter.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | all | Filter by status (all, active, expired, inactive) |

**Status Filters:**
- `all` - All offers
- `active` - Active and not expired
- `expired` - End date passed
- `inactive` - status=false

**Success Response:**
```json
[
  {
    "id": "cm5off1",
    "code": "SUMMER25",
    "nameEn": "Summer Sale 2025",
    "nameAr": "تخفيضات الصيف 2025",
    "type": "PERCENTAGE",
    "discountValue": 25,
    "minCartValue": 500,
    "maxDiscount": 200,
    "applyTo": "ALL",
    "targetId": null,
    "startDate": "2025-06-01T00:00:00Z",
    "endDate": "2025-08-31T23:59:59Z",
    "startTime": "00:00",
    "endTime": "23:59",
    "totalUsageLimit": 1000,
    "perUserLimit": 5,
    "currentUsage": 45,
    "status": true,
    "createdAt": "2025-05-15T10:00:00Z",
    "updatedAt": "2025-05-15T10:00:00Z"
  }
]
```

---

#### Get Offer by ID

**Endpoint:** `GET /admin/offers/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Offer ID

**Success Response:**
```json
{
  "id": "cm5off1",
  "code": "SUMMER25",
  "nameEn": "Summer Sale 2025",
  "nameAr": "تخفيضات الصيف 2025",
  "type": "PERCENTAGE",
  "discountValue": 25,
  "minCartValue": 500,
  "maxDiscount": 200,
  "applyTo": "ALL",
  "targetId": null,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "startTime": "00:00",
  "endTime": "23:59",
  "totalUsageLimit": 1000,
  "perUserLimit": 5,
  "currentUsage": 45,
  "status": true,
  "createdAt": "2025-05-15T10:00:00Z",
  "updatedAt": "2025-05-15T10:00:00Z"
}
```

---

#### Create Offer

**Endpoint:** `POST /admin/offers`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "code": "WELCOME100",
  "nameEn": "Welcome Discount",
  "nameAr": "خصم الترحيب",
  "type": "FIXED_AMOUNT",
  "discountValue": 100,
  "minCartValue": 500,
  "maxDiscount": null,
  "applyTo": "ALL",
  "targetId": null,
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "startTime": "00:00",
  "endTime": "23:59",
  "totalUsageLimit": 500,
  "perUserLimit": 1,
  "status": true
}
```

**Offer Types:**
- `PERCENTAGE` - Percentage discount (discountValue = percentage)
- `FIXED_AMOUNT` - Fixed amount off (discountValue = amount in EGP)
- `BUNDLE` - Bundle deal
- `FREE_SHIPPING` - Free shipping

**Apply To Options:**
- `ALL` - All products (targetId=null)
- `CATEGORY` - Specific category (provide targetId)
- `SUB_CATEGORY` - Specific subcategory (provide targetId)
- `PRODUCT_LIST` - Specific product list (provide targetId)
- `PRODUCT_TYPE` - Specific product type (provide targetId)

**Field Requirements:**
- `code` - Required, must be unique
- `nameEn`, `nameAr` - Required
- `type` - Required (enum)
- `discountValue` - Required, must be > 0
- `minCartValue` - Optional (minimum cart value to apply)
- `maxDiscount` - Optional (maximum discount amount)
- `applyTo` - Required (enum)
- `targetId` - Optional (required for specific scopes)
- `startDate`, `endDate` - Required (ISO format)
- `startTime`, `endTime` - Optional (HH:mm format)
- `totalUsageLimit` - Optional (total times offer can be used)
- `perUserLimit` - Optional (times per user)
- `status` - Optional, default: true

**Success Response:**
```json
{
  "id": "cm5off2",
  "code": "WELCOME100",
  "nameEn": "Welcome Discount",
  "nameAr": "خصم الترحيب",
  "type": "FIXED_AMOUNT",
  "discountValue": 100,
  "minCartValue": 500,
  "maxDiscount": null,
  "applyTo": "ALL",
  "targetId": null,
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "startTime": "00:00",
  "endTime": "23:59",
  "totalUsageLimit": 500,
  "perUserLimit": 1,
  "currentUsage": 0,
  "status": true,
  "createdAt": "2025-02-08T18:00:00Z",
  "updatedAt": "2025-02-08T18:00:00Z"
}
```

**Error Response:**
```json
{
  "statusCode": 409,
  "message": "Offer code already exists"
}
```

---

#### Update Offer

**Endpoint:** `PUT /admin/offers/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Offer ID

**Request Body (all fields optional except code cannot be changed):**
```json
{
  "nameEn": "Updated Offer Name",
  "discountValue": 30,
  "status": false
}
```

---

#### Delete Offer

**Endpoint:** `DELETE /admin/offers/:id`  
**Auth Required:** Yes (Admin)

**Success Response:**
```
204 No Content
```

---

#### Popup Offers

##### Get All Popup Offers

**Endpoint:** `GET /admin/offers/popup/all`  
**Auth Required:** Yes (Admin)

**Success Response:**
```json
[
  {
    "id": "cm5popup1",
    "headlineEn": "WELCOME OFFER",
    "headlineAr": "عرض الترحيب",
    "subHeadlineEn": "Get 100 EGP OFF",
    "subHeadlineAr": "احصل على خصم 100 جنيه",
    "amount": 100,
    "voucherCode": "WELCOME100",
    "targetedUser": "first_time_customer",
    "imageUrl": "/uploads/popups/welcome.jpg",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "status": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

##### Create Popup Offer

**Endpoint:** `POST /admin/offers/popup`  
**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "headlineEn": "EXCLUSIVE DEAL",
  "headlineAr": "صفقة حصرية",
  "subHeadlineEn": "Save 200 EGP on your order",
  "subHeadlineAr": "وفر 200 جنيه على طلبك",
  "amount": 200,
  "voucherCode": "EXCLUSIVE200",
  "targetedUser": "all",
  "imageUrl": "/uploads/popups/exclusive.jpg",
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-02-28T23:59:59Z",
  "status": true
}
```

**Field Requirements:**
- `headlineEn`, `headlineAr` - Required
- `subHeadlineEn`, `subHeadlineAr` - Required
- `amount` - Required, must be > 0
- `voucherCode` - Required
- `targetedUser` - Required (e.g., "first_time_customer", "all", "returning")
- `imageUrl` - Optional
- `startDate`, `endDate` - Required (ISO format)
- `status` - Optional, default: true

**Success Response:**
```json
{
  "id": "cm5popup2",
  "headlineEn": "EXCLUSIVE DEAL",
  "headlineAr": "صفقة حصرية",
  "subHeadlineEn": "Save 200 EGP on your order",
  "subHeadlineAr": "وفر 200 جنيه على طلبك",
  "amount": 200,
  "voucherCode": "EXCLUSIVE200",
  "targetedUser": "all",
  "imageUrl": "/uploads/popups/exclusive.jpg",
  "startDate": "2025-02-01T00:00:00Z",
  "endDate": "2025-02-28T23:59:59Z",
  "status": true,
  "createdAt": "2025-02-08T18:30:00Z",
  "updatedAt": "2025-02-08T18:30:00Z"
}
```

---

##### Update Popup Offer

**Endpoint:** `PUT /admin/offers/popup/:id`  
**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id` - Popup Offer ID

**Request Body (all fields optional):**
```json
{
  "headlineEn": "Updated Headline",
  "amount": 250,
  "status": false
}
```

---

##### Delete Popup Offer

**Endpoint:** `DELETE /admin/offers/popup/:id`  
**Auth Required:** Yes (Admin)

**Success Response:**
```
204 No Content
```

---

### Admin Dashboard

#### Get Dashboard Overview

**Endpoint:** `GET /admin/dashboard/overview`  
**Auth Required:** Yes (Admin)  
**Description:** Get comprehensive dashboard metrics, charts, and statistics.

**Success Response:**
```json
{
  "metrics": {
    "totalProducts": 120,
    "activeOrders": 45,
    "totalCustomers": 350,
    "totalEarnings": 125000,
    "previousPeriodComparison": {
      "products": 8.5,
      "orders": 12.3,
      "customers": 5.2,
      "earnings": 15.7
    }
  },
  "charts": {
    "totalOrdersSeries": [
      { "date": "2025-02-01", "count": 12 },
      { "date": "2025-02-02", "count": 15 },
      { "date": "2025-02-03", "count": 18 },
      { "date": "2025-02-04", "count": 14 },
      { "date": "2025-02-05", "count": 20 },
      { "date": "2025-02-06", "count": 17 },
      { "date": "2025-02-07", "count": 22 }
    ],
    "totalProfitSeries": [
      { "date": "2025-02-01", "profit": 5400 },
      { "date": "2025-02-02", "profit": 6200 },
      { "date": "2025-02-03", "profit": 7100 },
      { "date": "2025-02-04", "profit": 5800 },
      { "date": "2025-02-05", "profit": 8300 },
      { "date": "2025-02-06", "profit": 7200 },
      { "date": "2025-02-07", "profit": 9100 }
    ],
    "discountedAmountSeries": [
      { "date": "2025-02-01", "discount": 850 },
      { "date": "2025-02-02", "discount": 920 },
      { "date": "2025-02-03", "discount": 1100 },
      { "date": "2025-02-04", "discount": 780 },
      { "date": "2025-02-05", "discount": 1350 },
      { "date": "2025-02-06", "discount": 980 },
      { "date": "2025-02-07", "discount": 1450 }
    ]
  },
  "topSellingCategories": [
    {
      "name": "Men",
      "value": 450,
      "percentage": 45.2
    },
    {
      "name": "Women",
      "value": 320,
      "percentage": 32.1
    },
    {
      "name": "Accessories",
      "value": 226,
      "percentage": 22.7
    }
  ],
  "bestSellingProducts": [
    {
      "id": "cm5prod123",
      "name": "BOUNCE SPORT RUNNING SHOES",
      "sku": "364U0w2",
      "totalOrders": 45,
      "stockStatus": "In Stock",
      "image": "/uploads/products/bounce-1.jpg"
    },
    {
      "id": "cm5prod456",
      "name": "Nike Air Max",
      "sku": "364U0w6",
      "totalOrders": 38,
      "stockStatus": "Low Stock",
      "image": "/uploads/products/nike-1.jpg"
    },
    {
      "id": "cm5prod789",
      "name": "AlAhly 2025 Jersey",
      "sku": "364U0w8",
      "totalOrders": 32,
      "stockStatus": "In Stock",
      "image": "/uploads/products/jersey-1.jpg"
    }
  ]
}
```

**Notes:**
- Metrics show current period vs previous 7 days
- Chart series show last 7 days of data
- Top selling categories limited to top 3
- Best selling products limited to top 5
- All monetary values in EGP

---

#### Get Recent Activity

**Endpoint:** `GET /admin/dashboard/recent-activity`  
**Auth Required:** Yes (Admin)  
**Description:** Get recent orders, customers, and low stock alerts.

**Success Response:**
```json
{
  "recentOrders": [
    {
      "id": "cm5order999",
      "orderNumber": "#998877",
      "customerName": "Ahmed Hassan",
      "total": 2450,
      "status": "ORDER_PLACED",
      "createdAt": "2025-02-08T19:00:00Z"
    },
    {
      "id": "cm5order998",
      "orderNumber": "#998876",
      "customerName": "Sara Mohamed",
      "total": 1850,
      "status": "PROCESSED",
      "createdAt": "2025-02-08T18:45:00Z"
    }
    // ... up to 5 recent orders
  ],
  "recentCustomers": [
    {
      "id": "cm5cust999",
      "fullName": "Mohamed Ali",
      "email": "mohamed@example.com",
      "createdAt": "2025-02-08T18:30:00Z"
    },
    {
      "id": "cm5cust998",
      "fullName": "Fatima Ahmed",
      "email": "fatima@example.com",
      "createdAt": "2025-02-08T17:20:00Z"
    }
    // ... up to 5 recent customers
  ],
  "lowStockProducts": [
    {
      "id": "cm5prod888",
      "name": "Adidas Ultraboost",
      "sku": "ADI999",
      "totalStock": 5
    },
    {
      "id": "cm5prod887",
      "name": "Puma RS-X",
      "sku": "PUM888",
      "totalStock": 3
    }
    // ... up to 5 low stock products
  ]
}
```

**Notes:**
- Recent orders: last 5 orders
- Recent customers: last 5 registered customers
- Low stock products: products with total stock ≤ 10

---

### File Upload

**All upload endpoints require admin authentication.**

#### Upload Product Image (Single)

**Endpoint:** `POST /upload/product-image`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Request:**
```
POST /upload/product-image
Content-Type: multipart/form-data

file: [binary image data]
```

**Success Response:**
```json
{
  "url": "/uploads/products/1707408234567-a1b2c3d4e5f6.jpg"
}
```

**Supported Formats:** JPEG, JPG, PNG, WEBP, GIF  
**Max Size:** 5MB

---

#### Upload Product Images (Multiple)

**Endpoint:** `POST /upload/product-images`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Request:**
```
POST /upload/product-images
Content-Type: multipart/form-data

files: [multiple binary image data]
```

**Success Response:**
```json
{
  "urls": [
    "/uploads/products/1707408234567-a1b2c3d4e5f6.jpg",
    "/uploads/products/1707408234568-b2c3d4e5f6g7.jpg",
    "/uploads/products/1707408234569-c3d4e5f6g7h8.jpg"
  ]
}
```

---

#### Upload Hero Image

**Endpoint:** `POST /upload/hero-image`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Success Response:**
```json
{
  "url": "/uploads/heroes/1707408234567-a1b2c3d4e5f6.jpg"
}
```

---

#### Upload Banner Image

**Endpoint:** `POST /upload/banner-image`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Success Response:**
```json
{
  "url": "/uploads/banners/1707408234567-a1b2c3d4e5f6.jpg"
}
```

---

#### Upload Vendor Logo

**Endpoint:** `POST /upload/vendor-logo`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Success Response:**
```json
{
  "url": "/uploads/vendors/1707408234567-a1b2c3d4e5f6.jpg"
}
```

---

#### Upload Category Icon

**Endpoint:** `POST /upload/category-icon`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Success Response:**
```json
{
  "url": "/uploads/categories/1707408234567-a1b2c3d4e5f6.jpg"
}
```

---

#### Upload Custom Order Images

**Endpoint:** `POST /upload/custom-order-images`  
**Auth Required:** Yes (Admin)  
**Content-Type:** `multipart/form-data`

**Success Response:**
```json
{
  "urls": [
    "/uploads/custom-orders/1707408234567-a1b2c3d4e5f6.jpg",
    "/uploads/custom-orders/1707408234568-b2c3d4e5f6g7.jpg"
  ]
}
```

---

## ⚠️ Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Access Denied: Insufficient Permissions"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

**409 Conflict**
```json
{
  "statusCode": 409,
  "message": "SKU already exists"
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 📋 Enums & Constants

### Gender
```typescript
enum Gender {
  UNISEX = "UNISEX",
  MEN = "MEN",
  WOMEN = "WOMEN",
  KIDS = "KIDS"
}
```

### Product Status
```typescript
enum ProductStatus {
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
  DRAFT = "DRAFT"
}
```

### Order Status
```typescript
enum OrderStatus {
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSED = "PROCESSED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}
```

### Customer Status
```typescript
enum CustomerStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED"
}
```

### Offer Type
```typescript
enum OfferType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
  BUNDLE = "BUNDLE",
  FREE_SHIPPING = "FREE_SHIPPING"
}
```

### Offer Scope
```typescript
enum OfferScope {
  ALL = "ALL",
  CATEGORY = "CATEGORY",
  SUB_CATEGORY = "SUB_CATEGORY",
  PRODUCT_LIST = "PRODUCT_LIST",
  PRODUCT_TYPE = "PRODUCT_TYPE"
}
```

### Sort By
```typescript
enum SortBy {
  FEATURED = "featured",
  BEST_SELLING = "best-selling",
  A_Z = "a-z",
  Z_A = "z-a",
  PRICE_LOW = "price-low",
  PRICE_HIGH = "price-high",
  DATE_OLD = "date-old",
  DATE_NEW = "date-new"
}
```

---

## 📝 Notes & Best Practices

### Authentication
- Customer tokens expire in 7 days (configurable)
- Admin tokens expire in 7 days (configurable)
- Always include `Authorization: Bearer {token}` header for protected routes
- Tokens are automatically validated by JWT middleware

### Pagination
- Default page size: 20 items
- Maximum page size: 100 items
- Page numbers start at 1
- Total count and total pages included in response

### Filtering & Sorting
- Multiple filters can be combined
- Filters use AND logic
- Case-insensitive search
- Sorting maintains filter context

### File Uploads
- All uploads require admin authentication
- Supported formats: JPEG, JPG, PNG, WEBP, GIF
- Maximum file size: 5MB
- Files auto-renamed with timestamp + random hash
- URLs returned are relative paths

### Stock Management
- Stock decremented atomically on order creation
- Stock validation happens twice: before transaction & inside transaction
- Race conditions prevented by transaction locking
- Low stock threshold: ≤ 10 units

### Order Processing
- Guest checkout auto-creates customer account
- Orders cannot be deleted if customer has order history
- Status changes create automatic history entries
- Delivery date auto-set when status = DELIVERED

### Data Consistency
- SKU must be unique across all products
- Category hierarchy: Category → SubCategory → ProductList
- Cannot delete parent entities if children exist
- Cannot delete products/customers with order history

### Localization
- All content has English (En) and Arabic (Ar) versions
- Language switching handled client-side
- Server stores both languages in same record

---

## 🔗 Additional Resources

- **Postman Collection:** Import `openapi.json` for complete API collection
- **Database Schema:** See `schema.prisma` for complete data model
- **Sample Data:** Run seed script to populate test data
- **Environment Variables:** Configure JWT secret, database URL, OTP settings

---

**Last Updated:** February 8, 2025  
**API Version:** 1.0  
**Base URL:** `http://localhost:4000/api` (development)
