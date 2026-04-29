/*
  Warnings:

  - You are about to drop the `EntityCommunityMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EntityCommunityMemberRole" AS ENUM ('MEMBER', 'MODERATOR', 'COORDINATOR', 'LEADER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "EntityCommunityMembers" DROP CONSTRAINT "EntityCommunityMembers_entity_community_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityMembers" DROP CONSTRAINT "EntityCommunityMembers_user_id_fkey";

-- DropTable
DROP TABLE "EntityCommunityMembers";

-- CreateTable
CREATE TABLE "EntityCommunityMember" (
    "id" TEXT NOT NULL,
    "role" "EntityCommunityMemberRole" NOT NULL DEFAULT 'MEMBER',
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "lastVisitedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EntityCommunityMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityCommunityMember_entity_community_id_idx" ON "EntityCommunityMember"("entity_community_id");

-- CreateIndex
CREATE INDEX "EntityCommunityMember_user_id_idx" ON "EntityCommunityMember"("user_id");

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
