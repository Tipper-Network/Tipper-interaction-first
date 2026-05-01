/*
  Warnings:

  - The values [QR,DIRECT,INVITE,MANUAL,ADMIN] on the enum `VisitSource` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `communityLevel` on the `EntityCommunity` table. All the data in the column will be lost.
  - You are about to drop the column `governanceConfig` on the `EntityCommunity` table. All the data in the column will be lost.
  - You are about to drop the column `governanceStage` on the `EntityCommunity` table. All the data in the column will be lost.
  - You are about to drop the column `minLevelToCustomize` on the `EntityCommunity` table. All the data in the column will be lost.
  - You are about to drop the column `memberLevel` on the `EntityCommunityMember` table. All the data in the column will be lost.
  - You are about to drop the column `visitCount` on the `EntityCommunityMember` table. All the data in the column will be lost.
  - You are about to drop the column `governanceWeight` on the `EntityCommunityPosition` table. All the data in the column will be lost.
  - You are about to drop the column `hierarchyLevel` on the `EntityCommunityPosition` table. All the data in the column will be lost.
  - You are about to drop the column `minReputation` on the `EntityCommunityPosition` table. All the data in the column will be lost.
  - You are about to drop the column `entityMemberPositionId` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `membershipTier` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `reputationScore` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `EntityMember` table. All the data in the column will be lost.
  - You are about to drop the column `offeringType` on the `Offering` table. All the data in the column will be lost.
  - You are about to drop the column `permissionScope` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,entity_member_position_id]` on the table `EntityMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_member_position_id` to the `EntityMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offering_type` to the `Offering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_scope` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisitSource_new" AS ENUM ('INVITE_QR', 'DIRECT_QR', 'BROWSER', 'PROMO_LINK');
ALTER TABLE "public"."UserCommunityVisit" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "UserCommunityVisit" ALTER COLUMN "source" TYPE "VisitSource_new" USING ("source"::text::"VisitSource_new");
ALTER TYPE "VisitSource" RENAME TO "VisitSource_old";
ALTER TYPE "VisitSource_new" RENAME TO "VisitSource";
DROP TYPE "public"."VisitSource_old";
ALTER TABLE "UserCommunityVisit" ALTER COLUMN "source" SET DEFAULT 'DIRECT_QR';
COMMIT;

-- AlterEnum
ALTER TYPE "VoteType" ADD VALUE 'NEUTRAL';

-- DropIndex
DROP INDEX "EntityMember_entityMemberPositionId_idx";

-- DropIndex
DROP INDEX "EntityMember_user_id_entityMemberPositionId_key";

-- AlterTable
ALTER TABLE "EntityCommunity" DROP COLUMN "communityLevel",
DROP COLUMN "governanceConfig",
DROP COLUMN "governanceStage",
DROP COLUMN "minLevelToCustomize",
ADD COLUMN     "community_level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "governance_config" JSONB,
ADD COLUMN     "governance_stage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "min_level_to_customize" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "EntityCommunityMember" DROP COLUMN "memberLevel",
DROP COLUMN "visitCount",
ADD COLUMN     "member_level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "visit_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EntityCommunityPosition" DROP COLUMN "governanceWeight",
DROP COLUMN "hierarchyLevel",
DROP COLUMN "minReputation",
ADD COLUMN     "governance_weight" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hierarchy_level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "min_reputation" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EntityMember" DROP COLUMN "entityMemberPositionId",
DROP COLUMN "membershipTier",
DROP COLUMN "reputationScore",
DROP COLUMN "subscriptionId",
ADD COLUMN     "entity_member_position_id" TEXT NOT NULL,
ADD COLUMN     "membership_tier" TEXT,
ADD COLUMN     "reputation_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription_id" TEXT;

-- AlterTable
ALTER TABLE "Offering" DROP COLUMN "offeringType",
ADD COLUMN     "offering_type" "OfferingType" NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "permissionScope",
ADD COLUMN     "permission_scope" "PermissionScope" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "avatarUrl",
ADD COLUMN     "avatar_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "user_level" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserCommunityVisit" ALTER COLUMN "source" SET DEFAULT 'DIRECT_QR';

-- AlterTable
ALTER TABLE "VoteBox" ADD COLUMN     "neutral_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "EntityMember_entity_member_position_id_idx" ON "EntityMember"("entity_member_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMember_user_id_entity_member_position_id_key" ON "EntityMember"("user_id", "entity_member_position_id");
