/*
  Warnings:

  - You are about to drop the column `owner_name` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `EntityCommunityMember` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `user_entity_position` on the `RequestClaim` table. All the data in the column will be lost.
  - You are about to drop the column `user_entity_position_id` on the `RequestClaim` table. All the data in the column will be lost.
  - You are about to drop the `EntityMemberPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityUserRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,entityMemberPositionId]` on the table `EntityMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityMemberPositionId` to the `EntityMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EntityMember" DROP CONSTRAINT "EntityMember_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityUserRole" DROP CONSTRAINT "EntityUserRole_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityUserRole" DROP CONSTRAINT "EntityUserRole_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestClaim" DROP CONSTRAINT "RequestClaim_user_entity_position_id_fkey";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "owner_name",
ADD COLUMN     "owner_id" TEXT;

-- AlterTable
ALTER TABLE "EntityCommunity" ADD COLUMN     "communityLevel" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "EntityCommunityMember" DROP COLUMN "role",
ADD COLUMN     "memberLevel" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "EntityMember" DROP COLUMN "entity_id",
DROP COLUMN "position",
DROP COLUMN "role",
ADD COLUMN     "entityMemberPositionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequestClaim" DROP COLUMN "user_entity_position",
DROP COLUMN "user_entity_position_id";

-- DropTable
DROP TABLE "EntityMemberPosition";

-- DropTable
DROP TABLE "EntityUserRole";

-- DropEnum
DROP TYPE "EntityRoleType";

-- DropEnum
DROP TYPE "EntityUserPositionType";

-- CreateTable
CREATE TABLE "EntityPosition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityPosition_entity_id_idx" ON "EntityPosition"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityPosition_entity_id_title_key" ON "EntityPosition"("entity_id", "title");

-- CreateIndex
CREATE INDEX "EntityMember_user_id_idx" ON "EntityMember"("user_id");

-- CreateIndex
CREATE INDEX "EntityMember_entityMemberPositionId_idx" ON "EntityMember"("entityMemberPositionId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMember_user_id_entityMemberPositionId_key" ON "EntityMember"("user_id", "entityMemberPositionId");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_entityMemberPositionId_fkey" FOREIGN KEY ("entityMemberPositionId") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityPosition" ADD CONSTRAINT "EntityPosition_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
