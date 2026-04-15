-- CreateTable
CREATE TABLE "Plate" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "full_plate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "plate_type" TEXT NOT NULL,
    "numerology_sum" INTEGER NOT NULL,
    "line_qr_url" TEXT NOT NULL,
    "contact_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plate_full_plate_key" ON "Plate"("full_plate");

-- CreateIndex
CREATE INDEX "Plate_category_idx" ON "Plate"("category");

-- CreateIndex
CREATE INDEX "Plate_plate_type_idx" ON "Plate"("plate_type");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
