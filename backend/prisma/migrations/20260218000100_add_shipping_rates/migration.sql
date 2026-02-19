-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" TEXT NOT NULL,
    "governorate" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_rates_governorate_key" ON "shipping_rates"("governorate");

-- CreateIndex
CREATE INDEX "shipping_rates_status_idx" ON "shipping_rates"("status");
