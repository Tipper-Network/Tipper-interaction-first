/*
  Warnings:

  - You are about to drop the `BusinessTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityArchetypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityInterests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityValues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Personas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vibes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entity_community_id,user_id]` on the table `EntityCommunityMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_business_type_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityArchetypesEntries" DROP CONSTRAINT "EntityArchetypesEntries_archetype_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityVibes" DROP CONSTRAINT "EntityCommunityVibes_vibe_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityInterestsEntries" DROP CONSTRAINT "EntityInterestsEntries_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityValuesEntries" DROP CONSTRAINT "EntityValuesEntries_value_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInterests" DROP CONSTRAINT "UserInterests_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonas" DROP CONSTRAINT "UserPersonas_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "UserValues" DROP CONSTRAINT "UserValues_value_id_fkey";

-- DropTable
DROP TABLE "BusinessTypes";

-- DropTable
DROP TABLE "EntityArchetypes";

-- DropTable
DROP TABLE "EntityInterests";

-- DropTable
DROP TABLE "EntityValues";

-- DropTable
DROP TABLE "Interests";

-- DropTable
DROP TABLE "Personas";

-- DropTable
DROP TABLE "Values";

-- DropTable
DROP TABLE "Vibes";

-- CreateTable
CREATE TABLE "ReferencePersonas" (
    "id" TEXT NOT NULL,
    "icon_url" TEXT,
    "persona_name" TEXT NOT NULL,
    "persona_description" TEXT NOT NULL,

    CONSTRAINT "ReferencePersonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceValues" (
    "id" TEXT NOT NULL,
    "value_name" TEXT NOT NULL,
    "value_description" TEXT NOT NULL,

    CONSTRAINT "ReferenceValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceInterests" (
    "id" TEXT NOT NULL,
    "interest_name" TEXT NOT NULL,
    "interest_category" TEXT NOT NULL,

    CONSTRAINT "ReferenceInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceEntityArchetypes" (
    "id" TEXT NOT NULL,
    "icon_url" TEXT,
    "archetype_name" TEXT NOT NULL,
    "archetype_description" TEXT NOT NULL,

    CONSTRAINT "ReferenceEntityArchetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceEntityValues" (
    "id" TEXT NOT NULL,
    "value_name" TEXT NOT NULL,
    "value_description" TEXT NOT NULL,

    CONSTRAINT "ReferenceEntityValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceEntityInterests" (
    "id" TEXT NOT NULL,
    "interest_name" TEXT NOT NULL,
    "interest_category" TEXT NOT NULL,

    CONSTRAINT "ReferenceEntityInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceBusinessTypes" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "industry_description" TEXT NOT NULL,
    "business_type" TEXT NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "ReferenceBusinessTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceVibes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,

    CONSTRAINT "ReferenceVibes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferencePersonas_persona_name_key" ON "ReferencePersonas"("persona_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceValues_value_name_key" ON "ReferenceValues"("value_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceInterests_interest_name_key" ON "ReferenceInterests"("interest_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceEntityArchetypes_archetype_name_key" ON "ReferenceEntityArchetypes"("archetype_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceEntityValues_value_name_key" ON "ReferenceEntityValues"("value_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceEntityInterests_interest_name_key" ON "ReferenceEntityInterests"("interest_name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceBusinessTypes_industry_business_type_key" ON "ReferenceBusinessTypes"("industry", "business_type");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceVibes_name_key" ON "ReferenceVibes"("name");

-- CreateIndex
CREATE INDEX "ReferenceVibes_name_idx" ON "ReferenceVibes"("name");

-- CreateIndex
CREATE INDEX "EntityCommunityMembers_entity_community_id_idx" ON "EntityCommunityMembers"("entity_community_id");

-- CreateIndex
CREATE INDEX "EntityCommunityMembers_user_id_idx" ON "EntityCommunityMembers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityMembers_entity_community_id_user_id_key" ON "EntityCommunityMembers"("entity_community_id", "user_id");

-- AddForeignKey
ALTER TABLE "EntityCommunityVibes" ADD CONSTRAINT "EntityCommunityVibes_vibe_id_fkey" FOREIGN KEY ("vibe_id") REFERENCES "ReferenceVibes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "ReferenceBusinessTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityInterestsEntries" ADD CONSTRAINT "EntityInterestsEntries_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "ReferenceEntityInterests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityValuesEntries" ADD CONSTRAINT "EntityValuesEntries_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "ReferenceEntityValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityArchetypesEntries" ADD CONSTRAINT "EntityArchetypesEntries_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "ReferenceEntityArchetypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonas" ADD CONSTRAINT "UserPersonas_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "ReferencePersonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterests" ADD CONSTRAINT "UserInterests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "ReferenceInterests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserValues" ADD CONSTRAINT "UserValues_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "ReferenceValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
