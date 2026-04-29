/*
  Warnings:

  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `RequestClaimMedia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `label` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EntityMediaRole" AS ENUM ('LOGO', 'COVER', 'GALLERY', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('AMENITY', 'FOOD', 'PRODUCT', 'FEATURE', 'EXPERIENCE', 'GENRE');

-- CreateEnum
CREATE TYPE "TagStatus" AS ENUM ('ACTIVE', 'DEPRECATED', 'SUGGESTED', 'REJECTED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "OfferingType" AS ENUM ('MENU', 'SERVICES', 'INVENTORY', 'AMENITY', 'EXPERIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "OfferingFormat" AS ENUM ('PDF', 'IMAGES', 'STRUCTURED', 'LINK');

-- CreateEnum
CREATE TYPE "OfferingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- DropIndex
DROP INDEX "Tag_name_idx";

-- AlterTable
ALTER TABLE "RequestClaimMedia" DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "TagStatus" NOT NULL,
ADD COLUMN     "type" "TagType" NOT NULL,
ADD COLUMN     "vote_box_id" TEXT;

-- DropEnum
DROP TYPE "ClaimMediaType";

-- CreateTable
CREATE TABLE "EntityMedia" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "role" "EntityMediaRole" NOT NULL,
    "vote_box_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingTag" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferingTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offering" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "offeringType" "OfferingType" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "format" "OfferingFormat" NOT NULL,
    "status" "OfferingStatus" NOT NULL,
    "isSearchable" BOOLEAN NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferingMedia" (
    "id" TEXT NOT NULL,
    "offering_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityMedia_entity_id_idx" ON "EntityMedia"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMedia_vote_box_id_key" ON "EntityMedia"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_vote_box_id_key" ON "Tag"("vote_box_id");

-- AddForeignKey
ALTER TABLE "EntityMedia" ADD CONSTRAINT "EntityMedia_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMedia" ADD CONSTRAINT "EntityMedia_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingTag" ADD CONSTRAINT "OfferingTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingTag" ADD CONSTRAINT "OfferingTag_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingMedia" ADD CONSTRAINT "OfferingMedia_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
