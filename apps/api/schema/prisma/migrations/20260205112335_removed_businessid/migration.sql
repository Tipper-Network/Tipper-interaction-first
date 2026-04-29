/*
  Warnings:

  - You are about to drop the column `business_type_id` on the `Entity` table. All the data in the column will be lost.
  - Added the required column `entity_type` to the `RequestClaim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EntityType" ADD VALUE 'PROFESSIONAL_ASSOCIATION';
ALTER TYPE "EntityType" ADD VALUE 'GROUP';

-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_business_type_id_fkey";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "business_type_id",
ADD COLUMN     "owner_name" TEXT,
ADD COLUMN     "owner_phone_number" TEXT;

-- AlterTable
ALTER TABLE "RequestClaim" ADD COLUMN     "entity_type" "EntityType" NOT NULL;
