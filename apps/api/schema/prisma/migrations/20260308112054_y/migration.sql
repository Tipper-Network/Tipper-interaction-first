/*
  Warnings:

  - You are about to drop the `EntityCommunityVibes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VisitSource" AS ENUM ('QR', 'DIRECT', 'INVITE', 'MANUAL', 'ADMIN');

-- DropForeignKey
ALTER TABLE "EntityCommunityVibes" DROP CONSTRAINT "EntityCommunityVibes_entity_community_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityVibes" DROP CONSTRAINT "EntityCommunityVibes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityVibes" DROP CONSTRAINT "EntityCommunityVibes_vibe_id_fkey";

-- DropTable
DROP TABLE "EntityCommunityVibes";

-- CreateTable
CREATE TABLE "UserCommunityVisit" (
    "id" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "VisitSource" NOT NULL DEFAULT 'DIRECT',
    "user_id" TEXT NOT NULL,
    "entity_community_id" TEXT NOT NULL,
    "feel_id" TEXT,
    "vibe_id" TEXT,

    CONSTRAINT "UserCommunityVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceFeels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT,

    CONSTRAINT "ReferenceFeels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCommunityVisit_user_id_idx" ON "UserCommunityVisit"("user_id");

-- CreateIndex
CREATE INDEX "UserCommunityVisit_entity_community_id_idx" ON "UserCommunityVisit"("entity_community_id");

-- CreateIndex
CREATE INDEX "UserCommunityVisit_feel_id_idx" ON "UserCommunityVisit"("feel_id");

-- CreateIndex
CREATE INDEX "UserCommunityVisit_vibe_id_idx" ON "UserCommunityVisit"("vibe_id");

-- CreateIndex
CREATE INDEX "UserCommunityVisit_visited_at_idx" ON "UserCommunityVisit"("visited_at");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceFeels_name_key" ON "ReferenceFeels"("name");

-- AddForeignKey
ALTER TABLE "UserCommunityVisit" ADD CONSTRAINT "UserCommunityVisit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunityVisit" ADD CONSTRAINT "UserCommunityVisit_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunityVisit" ADD CONSTRAINT "UserCommunityVisit_feel_id_fkey" FOREIGN KEY ("feel_id") REFERENCES "ReferenceFeels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunityVisit" ADD CONSTRAINT "UserCommunityVisit_vibe_id_fkey" FOREIGN KEY ("vibe_id") REFERENCES "ReferenceVibes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
