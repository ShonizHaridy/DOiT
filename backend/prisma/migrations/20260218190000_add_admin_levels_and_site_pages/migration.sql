-- CreateEnum
CREATE TYPE "AdminLevel" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- AlterTable
ALTER TABLE "admins"
ADD COLUMN "adminLevel" "AdminLevel" NOT NULL DEFAULT 'ADMIN';

-- Ensure at least one super admin exists.
UPDATE "admins"
SET "adminLevel" = 'SUPER_ADMIN'
WHERE "adminId" = 'admin001'
   OR "email" = 'admin@doit.com';

UPDATE "admins"
SET "adminLevel" = 'SUPER_ADMIN'
WHERE "id" = (
  SELECT "id"
  FROM "admins"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
AND NOT EXISTS (
  SELECT 1
  FROM "admins"
  WHERE "adminLevel" = 'SUPER_ADMIN'
);

-- CreateTable
CREATE TABLE "site_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "showInFooter" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_pages_slug_key" ON "site_pages"("slug");

-- CreateIndex
CREATE INDEX "site_pages_status_showInFooter_order_idx" ON "site_pages"("status", "showInFooter", "order");

-- Seed default informational pages used by footer.
INSERT INTO "site_pages" (
  "id",
  "slug",
  "titleEn",
  "titleAr",
  "contentEn",
  "contentAr",
  "showInFooter",
  "order",
  "status",
  "createdAt",
  "updatedAt"
) VALUES
(
  'sitepage_shipping',
  'shipping',
  'Shipping Policy',
  'سياسة الشحن',
  '## Order Processing Times

Orders are typically processed within 3-5 working days inside Cairo, and within 5-7 working days outside Cairo.

## Tracking Your Order

Once your order is shipped, you will receive a shipping confirmation email with tracking information.

## Delivery

You will receive a phone call from the shipping company to arrange a convenient delivery time.

## Damages and Lost Packages

If you receive a damaged package, contact us immediately and we will help resolve it quickly.',
  '## أوقات معالجة الطلبات

عادة ما تتم معالجة الطلبات خلال 3-5 أيام عمل داخل القاهرة، وخلال 5-7 أيام عمل خارج القاهرة.

## تتبع طلبك

بمجرد شحن طلبك، ستتلقى بريدًا إلكترونيًا لتأكيد الشحن مع معلومات التتبع.

## التسليم

ستتلقى مكالمة من شركة الشحن لتحديد الوقت الأنسب للتسليم.

## الأضرار والطرود المفقودة

إذا استلمت طردًا تالفًا، يرجى التواصل معنا فورًا وسنساعدك على حل المشكلة بسرعة.',
  true,
  10,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'sitepage_privacy',
  'privacy',
  'Privacy Policy',
  'سياسة الخصوصية',
  '## Information We Collect

We collect only the information required to process orders and improve your shopping experience.

## How We Use Information

Your information is used for order fulfillment, customer support, and service-related communication.

## Data Protection

We apply reasonable security measures to protect your personal data from unauthorized access.

## Contact Us

If you have questions about this policy, contact our support team.',
  '## المعلومات التي نجمعها

نجمع فقط المعلومات اللازمة لإتمام الطلبات وتحسين تجربة التسوق.

## كيفية استخدام المعلومات

تُستخدم معلوماتك لإتمام الطلبات وخدمة العملاء والتواصل المرتبط بالخدمة.

## حماية البيانات

نطبق إجراءات أمنية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به.

## تواصل معنا

إذا كان لديك أي أسئلة حول هذه السياسة، يرجى التواصل مع فريق الدعم.',
  true,
  20,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'sitepage_terms',
  'terms',
  'Terms of Service',
  'شروط الخدمة',
  '## Acceptance of Terms

By using this website, you agree to these terms and applicable laws.

## Orders and Payments

All orders are subject to availability and confirmation. Prices and offers may change without prior notice.

## Limitation of Liability

We are not liable for indirect or incidental damages resulting from use of the site.

## Changes to Terms

We may update these terms from time to time. Continued use means acceptance of updates.',
  '## قبول الشروط

باستخدام هذا الموقع، فإنك توافق على هذه الشروط والقوانين المعمول بها.

## الطلبات والدفع

تخضع جميع الطلبات للتوفر والتأكيد. قد تتغير الأسعار والعروض دون إشعار مسبق.

## تحديد المسؤولية

لسنا مسؤولين عن الأضرار غير المباشرة أو العرضية الناتجة عن استخدام الموقع.

## تحديث الشروط

قد نقوم بتحديث هذه الشروط من وقت لآخر، واستمرارك في الاستخدام يعني قبولك للتحديثات.',
  true,
  30,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'sitepage_returns',
  'returns',
  'Return & Refund Policy',
  'سياسة الإرجاع والاسترداد',
  '## Return Window

Eligible items can be returned within the announced return period from delivery date.

## Item Condition

Returned items must be unused, in original condition, and with original packaging.

## Refund Process

Approved refunds are processed through the original payment method within the normal banking timeline.

## Support

For return requests, contact support with your order number.',
  '## فترة الإرجاع

يمكن إرجاع المنتجات المؤهلة خلال فترة الإرجاع المعلنة من تاريخ التسليم.

## حالة المنتج

يجب أن تكون المنتجات المرتجعة غير مستخدمة وبحالتها الأصلية مع التغليف الأصلي.

## آلية الاسترداد

تتم معالجة الاسترداد المعتمد عبر وسيلة الدفع الأصلية وفق المدة البنكية المعتادة.

## الدعم

لطلب الإرجاع، تواصل مع الدعم مع رقم الطلب.',
  true,
  40,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'sitepage_stores',
  'stores',
  'Locate Our Stores',
  'العثور على متاجرنا',
  '## Find a Store

You can visit our partner stores and official points of sale.

## Opening Hours

Store working hours may vary by location and season.

## Before You Visit

We recommend calling ahead to confirm product availability.',
  '## ابحث عن متجر

يمكنك زيارة متاجرنا الشريكة ونقاط البيع الرسمية.

## مواعيد العمل

قد تختلف ساعات العمل حسب الموقع والموسم.

## قبل الزيارة

نوصي بالاتصال مسبقًا للتأكد من توفر المنتجات.',
  true,
  50,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
