/*
  Warnings:

  - Added the required column `user_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "products_updated_at_idx" ON "products"("updated_at");

-- CreateIndex
CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_user_id_idx" ON "products"("user_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_updated_at_idx" ON "users"("updated_at");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "users_first_name_idx" ON "users"("first_name");

-- CreateIndex
CREATE INDEX "users_last_name_idx" ON "users"("last_name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
