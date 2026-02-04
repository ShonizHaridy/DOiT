import { PrismaClient } from '../generated/prisma/client';
import { Gender, ProductStatus } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';


// Initialize Prisma adapter for PostgreSQL database connection
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter})

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.$transaction([
    prisma.orderStatusHistory.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.customOrder.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productList.deleteMany(),
    prisma.subCategory.deleteMany(),
    prisma.category.deleteMany(),
    prisma.address.deleteMany(),
    prisma.oTPCode.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.popupOffer.deleteMany(),
    prisma.heroSection.deleteMany(),
    prisma.vendor.deleteMany(),
    prisma.bannerAd.deleteMany(),
    prisma.featuredProducts.deleteMany(),
  ]);

  // ============================================
  // 1. CREATE ADMIN
  // ============================================
  const hashedPassword = await bcrypt.hash('Change@123', 10);
  
  const admin = await prisma.admin.create({
    data: {
      adminId: 'admin001',
      email: 'admin@doit.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin created');

  // ============================================
  // 2. CREATE CATEGORIES (3-TIER HIERARCHY)
  // ============================================
  
  // Men Category
  const menCategory = await prisma.category.create({
    data: {
      nameEn: 'Men',
      nameAr: 'رجال',
      icon: '/icons/men.svg',
      status: true,
      order: 1,
    },
  });

  const menFootwear = await prisma.subCategory.create({
    data: {
      categoryId: menCategory.id,
      nameEn: 'Footwear',
      nameAr: 'أحذية',
      icon: '/icons/shoes.svg',
      order: 1,
    },
  });

  const runningShoes = await prisma.productList.create({
    data: {
      subCategoryId: menFootwear.id,
      nameEn: 'Running',
      nameAr: 'جري',
      order: 1,
    },
  });

  const trainingShoes = await prisma.productList.create({
    data: {
      subCategoryId: menFootwear.id,
      nameEn: 'Training',
      nameAr: 'تدريب',
      order: 2,
    },
  });

  const lifestyleShoes = await prisma.productList.create({
    data: {
      subCategoryId: menFootwear.id,
      nameEn: 'Lifestyle',
      nameAr: 'نمط الحياة',
      order: 3,
    },
  });

  const menClothing = await prisma.subCategory.create({
    data: {
      categoryId: menCategory.id,
      nameEn: 'Clothing',
      nameAr: 'ملابس',
      icon: '/icons/clothing.svg',
      order: 2,
    },
  });

  const tshirts = await prisma.productList.create({
    data: {
      subCategoryId: menClothing.id,
      nameEn: 'T-Shirts',
      nameAr: 'تيشيرتات',
      order: 1,
    },
  });

  // Women Category
  const womenCategory = await prisma.category.create({
    data: {
      nameEn: 'Women',
      nameAr: 'نساء',
      icon: '/icons/women.svg',
      status: true,
      order: 2,
    },
  });

  // Accessories Category
  const accessoriesCategory = await prisma.category.create({
    data: {
      nameEn: 'Accessories',
      nameAr: 'إكسسوارات',
      icon: '/icons/accessories.svg',
      status: true,
      order: 3,
    },
  });

  const accessoriesSubCat = await prisma.subCategory.create({
    data: {
      categoryId: accessoriesCategory.id,
      nameEn: 'Sports Accessories',
      nameAr: 'إكسسوارات رياضية',
      order: 1,
    },
  });

  const footballList = await prisma.productList.create({
    data: {
      subCategoryId: accessoriesSubCat.id,
      nameEn: 'Football',
      nameAr: 'كرة قدم',
      order: 1,
    },
  });

  console.log('✅ Categories created');

  // ============================================
  // 3. CREATE PRODUCTS (matching frontend data)
  // ============================================

  const products = [
    {
      productListId: runningShoes.id,
      sku: '364U0w2',
      nameEn: 'BOUNCE SPORT RUNNING LACE SHOES',
      nameAr: 'حذاء جري باونس سبورت',
      descriptionEn: 'Designed to follow the contour of your foot. Cushioned to feel comfortable during every activity.',
      descriptionAr: 'مصمم ليتبع شكل قدمك. مبطن ليشعرك بالراحة أثناء كل نشاط.',
      detailsEn: ['Regular fit', 'Sandwich mesh upper', 'Textile lining', 'Bounce midsole'],
      detailsAr: ['ملاءمة عادية', 'جزء علوي شبكي', 'بطانة نسيجية', 'نعل أوسط باونس'],
      basePrice: 1630,
      discountPercentage: 30,
      vendor: 'Bounce',
      gender: Gender.UNISEX,
      type: 'RUNNING SHOES',
      status: ProductStatus.PUBLISHED,
      images: [
        'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
        'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
      ],
      variants: [
        { color: 'Black', size: 'EU- 35', quantity: 15 },
        { color: 'Black', size: 'EU- 36', quantity: 12 },
        { color: 'Black', size: 'EU- 37', quantity: 8 },
        { color: 'Pink', size: 'EU- 35', quantity: 10 },
        { color: 'Pink', size: 'EU- 36', quantity: 5 },
      ],
    },
    {
      productListId: trainingShoes.id,
      sku: '364U0w6',
      nameEn: 'M AIR MAX ALPHA TRAINER',
      nameAr: 'إم إير ماكس ألفا ترينر',
      descriptionEn: 'Training shoes designed for maximum performance.',
      descriptionAr: 'أحذية تدريب مصممة للأداء الأقصى.',
      basePrice: 1300,
      discountPercentage: 0,
      vendor: 'Nike',
      gender: Gender.MEN,
      type: 'TRAINING SHOES',
      status: ProductStatus.PUBLISHED,
      images: [
        'https://api.builder.io/api/v1/image/assets/TEMP/e4cdb57b233bfe0ca4d4ad0ed712ee077115a48e',
      ],
      variants: [
        { color: 'Black', size: 'EU- 40', quantity: 20 },
        { color: 'Black', size: 'EU- 41', quantity: 15 },
        { color: 'Black', size: 'EU- 42', quantity: 10 },
        { color: 'White', size: 'EU- 40', quantity: 8 },
      ],
    },
    {
      productListId: lifestyleShoes.id,
      sku: '364U0w7',
      nameEn: 'Nike Air',
      nameAr: 'نايك إير',
      descriptionEn: 'Classic lifestyle sneakers for everyday wear.',
      descriptionAr: 'أحذية رياضية كلاسيكية للارتداء اليومي.',
      basePrice: 1300,
      discountPercentage: 0,
      vendor: 'Nike',
      gender: Gender.MEN,
      type: 'LIFESTYLE',
      status: ProductStatus.PUBLISHED,
      images: [
        'https://api.builder.io/api/v1/image/assets/TEMP/f404ff2c4d6a963b490af535d922ee378ac94c95',
      ],
      variants: [
        { color: 'White', size: 'EU- 40', quantity: 25 },
        { color: 'White', size: 'EU- 41', quantity: 20 },
        { color: 'Gray', size: 'EU- 42', quantity: 15 },
      ],
    },
    {
      productListId: tshirts.id,
      sku: '364U0w8',
      nameEn: 'AlAhly 2025 Jersey',
      nameAr: 'قميص الأهلي 2025',
      descriptionEn: 'Official AlAhly 2025 season jersey.',
      descriptionAr: 'قميص الأهلي الرسمي موسم 2025.',
      basePrice: 1140,
      discountPercentage: 0,
      vendor: 'Adidas',
      gender: Gender.MEN,
      type: 'T shirt',
      status: ProductStatus.PUBLISHED,
      images: [
        'https://api.builder.io/api/v1/image/assets/TEMP/bf2779f77e2b25c6cb102a52f53c73ebe112ca51',
      ],
      variants: [
        { color: 'Red', size: 'S', quantity: 30 },
        { color: 'Red', size: 'M', quantity: 25 },
        { color: 'Red', size: 'L', quantity: 20 },
        { color: 'Red', size: 'XL', quantity: 15 },
      ],
    },
    {
      productListId: footballList.id,
      sku: '364U0w9',
      nameEn: 'Football NIKEINCYTE',
      nameAr: 'كرة قدم نايك إنسايت',
      descriptionEn: 'Professional football for matches and training.',
      descriptionAr: 'كرة قدم احترافية للمباريات والتدريب.',
      basePrice: 2280,
      discountPercentage: 0,
      vendor: 'Nike',
      gender: Gender.UNISEX,
      type: 'Football',
      status: ProductStatus.PUBLISHED,
      images: [
        'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
      ],
      variants: [
        { color: 'Multicolor', size: 'NS', quantity: 50 },
      ],
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        productListId: productData.productListId,
        sku: productData.sku,
        nameEn: productData.nameEn,
        nameAr: productData.nameAr,
        descriptionEn: productData.descriptionEn,
        descriptionAr: productData.descriptionAr,
        detailsEn: productData.detailsEn,
        detailsAr: productData.detailsAr,
        basePrice: productData.basePrice,
        discountPercentage: productData.discountPercentage,
        vendor: productData.vendor,
        gender: productData.gender,
        type: productData.type,
        status: productData.status,
        viewCount: Math.floor(Math.random() * 1000),
      },
    });

    // Create images
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: productData.images[i],
          order: i,
        },
      });
    }

    // Create variants
    for (const variant of productData.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
        },
      });
    }
  }

  console.log('✅ Products created');

  // ============================================
  // 4. CREATE CONTENT (Hero, Vendors, Banners)
  // ============================================

  await prisma.heroSection.create({
    data: {
      headlineEn: 'ESSENTIAL ITEMS FOR',
      headlineAr: 'عناصر أساسية لـ',
      descriptionEn: 'Latest collection of premium sports gear',
      descriptionAr: 'أحدث مجموعة من معدات الرياضة الممتازة',
      price: 990,
      mainImageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/d4b46b377792716f1e32ad2493ef3e2f3db252f4',
      variantImages: [
        'https://api.builder.io/api/v1/image/assets/TEMP/77d8fb1cf2c903768853cb93d418f9b091d41b79',
        'https://api.builder.io/api/v1/image/assets/TEMP/d3b087dd878a1582f7976ed6994275cef4c307d2',
      ],
      ctaTextEn: 'ADD TO CART',
      ctaTextAr: 'أضف إلى السلة',
      order: 1,
      status: true,
    },
  });

  const vendors = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bounce'];
  for (let i = 0; i < vendors.length; i++) {
    await prisma.vendor.create({
      data: {
        name: vendors[i],
        logoUrl: `/brands/brand${i + 1}.jpg`,
        order: i,
        status: true,
      },
    });
  }

  await prisma.bannerAd.createMany({
    data: [
      {
        imageUrl: '/banners/black-friday.jpg',
        titleEn: 'BLACK FRIDAY',
        titleAr: 'الجمعة السوداء',
        link: '/offers/black-friday',
        order: 1,
        status: true,
      },
      {
        imageUrl: '/banners/exclusive.jpg',
        titleEn: 'EXCLUSIVE OFFERS',
        titleAr: 'عروض حصرية',
        link: '/offers/exclusive',
        order: 2,
        status: true,
      },
    ],
  });

  await prisma.featuredProducts.create({
    data: {
      autoChoose: true,
    },
  });

  console.log('✅ Content created');

  // ============================================
  // 5. CREATE SAMPLE CUSTOMER & ORDER
  // ============================================

  const customer = await prisma.customer.create({
    data: {
      email: 'customer@example.com',
      fullName: 'John Doe',
      phoneNumber: '+201234567890',
      status: 'ACTIVE',
    },
  });

  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      label: 'Home',
      fullAddress: '421 Gamal Abdelnasser St. Panorama Tower, Cairo, Egypt',
    },
  });

  console.log('✅ Sample customer created');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- Categories: 3');
  console.log('- SubCategories: ~4');
  console.log('- Product Lists: ~7');
  console.log('- Products: 5');
  console.log('- Product Variants: ~20');
  console.log('- Admin: 1');
  console.log('- Sample Customer: 1');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });