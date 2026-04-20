-- CreateTable
CREATE TABLE "PromoBanner" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "highlight" TEXT NOT NULL,
    "subheadline" TEXT,
    "plate_code" TEXT NOT NULL,
    "plate_region" TEXT NOT NULL,
    "image_url" TEXT,
    "footer_title" TEXT NOT NULL,
    "footer_tagline" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "line_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromoBanner_is_active_idx" ON "PromoBanner"("is_active");

-- CreateIndex
CREATE INDEX "PromoBanner_sort_order_idx" ON "PromoBanner"("sort_order");
