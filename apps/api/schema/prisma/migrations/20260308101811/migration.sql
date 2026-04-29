/*
  Warnings:

  - You are about to drop the column `entityId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `EntityTag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `EntityTag` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `FeedbackComment` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `FeedbackComment` table. All the data in the column will be lost.
  - You are about to drop the column `voteBoxId` on the `FeedbackComment` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `FeedbackTicket` table. All the data in the column will be lost.
  - You are about to drop the column `communityId` on the `FeedbackTicket` table. All the data in the column will be lost.
  - You are about to drop the column `duplicateOfId` on the `FeedbackTicket` table. All the data in the column will be lost.
  - You are about to drop the column `voteBoxId` on the `FeedbackTicket` table. All the data in the column will be lost.
  - You are about to drop the column `changedById` on the `FeedbackTicketStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `FeedbackTicketStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `offeringId` on the `OfferingTag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `OfferingTag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `ThoughtTag` table. All the data in the column will be lost.
  - You are about to drop the column `thoughtId` on the `ThoughtTag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entity_id]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entity_community_id,user_id]` on the table `EntityCommunityMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `FeedbackComment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `FeedbackTicket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `EntityMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `EntityTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `EntityTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `FeedbackComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_id` to the `FeedbackComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_box_id` to the `FeedbackComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `FeedbackTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `community_id` to the `FeedbackTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_box_id` to the `FeedbackTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changedBy_id` to the `FeedbackTicketStatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_id` to the `FeedbackTicketStatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offering_id` to the `OfferingTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `OfferingTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `ThoughtTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thought_id` to the `ThoughtTag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'REGISTERED', 'JOINED');

-- CreateEnum
CREATE TYPE "UserInviteSource" AS ENUM ('QR', 'EMAIL', 'SMS', 'WHATSAPP', 'TELEGRAM', 'OTHER');

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_entityId_fkey";

-- DropForeignKey
ALTER TABLE "EntityMember" DROP CONSTRAINT "EntityMember_entityMemberPositionId_fkey";

-- DropForeignKey
ALTER TABLE "EntityTag" DROP CONSTRAINT "EntityTag_entityId_fkey";

-- DropForeignKey
ALTER TABLE "EntityTag" DROP CONSTRAINT "EntityTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackComment" DROP CONSTRAINT "FeedbackComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackComment" DROP CONSTRAINT "FeedbackComment_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackComment" DROP CONSTRAINT "FeedbackComment_voteBoxId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicket" DROP CONSTRAINT "FeedbackTicket_authorId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicket" DROP CONSTRAINT "FeedbackTicket_communityId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicket" DROP CONSTRAINT "FeedbackTicket_duplicateOfId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicket" DROP CONSTRAINT "FeedbackTicket_voteBoxId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" DROP CONSTRAINT "FeedbackTicketStatusHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" DROP CONSTRAINT "FeedbackTicketStatusHistory_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "OfferingTag" DROP CONSTRAINT "OfferingTag_offeringId_fkey";

-- DropForeignKey
ALTER TABLE "OfferingTag" DROP CONSTRAINT "OfferingTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ThoughtTag" DROP CONSTRAINT "ThoughtTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ThoughtTag" DROP CONSTRAINT "ThoughtTag_thoughtId_fkey";

-- DropIndex
DROP INDEX "Brand_entityId_key";

-- DropIndex
DROP INDEX "EntityTag_tagId_entityId_idx";

-- DropIndex
DROP INDEX "FeedbackComment_voteBoxId_key";

-- DropIndex
DROP INDEX "FeedbackTicket_voteBoxId_key";

-- DropIndex
DROP INDEX "FeedbackTicketStatusHistory_changedById_idx";

-- DropIndex
DROP INDEX "FeedbackTicketStatusHistory_ticketId_idx";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "entityId",
ADD COLUMN     "entity_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EntityCommunity" ADD COLUMN     "governanceConfig" JSONB,
ADD COLUMN     "governanceStage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isAutonomous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minLevelToCustomize" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "EntityMember" ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "membershipTier" TEXT,
ADD COLUMN     "reputationScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "EntityTag" DROP COLUMN "entityId",
DROP COLUMN "tagId",
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackComment" DROP COLUMN "authorId",
DROP COLUMN "ticketId",
DROP COLUMN "voteBoxId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "ticket_id" TEXT NOT NULL,
ADD COLUMN     "vote_box_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackTicket" DROP COLUMN "authorId",
DROP COLUMN "communityId",
DROP COLUMN "duplicateOfId",
DROP COLUMN "voteBoxId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "community_id" TEXT NOT NULL,
ADD COLUMN     "duplicateOf_id" TEXT,
ADD COLUMN     "vote_box_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackTicketStatusHistory" DROP COLUMN "changedById",
DROP COLUMN "ticketId",
ADD COLUMN     "changedBy_id" TEXT NOT NULL,
ADD COLUMN     "ticket_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OfferingTag" DROP COLUMN "offeringId",
DROP COLUMN "tagId",
ADD COLUMN     "offering_id" TEXT NOT NULL,
ADD COLUMN     "tag_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ThoughtTag" DROP COLUMN "tagId",
DROP COLUMN "thoughtId",
ADD COLUMN     "tag_id" TEXT NOT NULL,
ADD COLUMN     "thought_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EntityCommunityMemberPosition" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "EntityCommunityMemberPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCommunityPosition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_community_id" TEXT NOT NULL,
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "hierarchyLevel" INTEGER NOT NULL DEFAULT 1,
    "minReputation" INTEGER NOT NULL DEFAULT 0,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isStaffPosition" BOOLEAN NOT NULL DEFAULT false,
    "governanceWeight" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityCommunityPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMemberPosition" (
    "id" TEXT NOT NULL,
    "entity_member_id" TEXT NOT NULL,
    "entity_position_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "EntityMemberPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInviteToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserInviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInvite" (
    "id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "invited_user_id" TEXT NOT NULL,
    "root_inviter_user_id" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "scanned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "UserInviteSource" NOT NULL,

    CONSTRAINT "UserInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCommunityInvite" (
    "id" TEXT NOT NULL,
    "invite_id" TEXT NOT NULL,
    "inviter_membership_id" TEXT NOT NULL,

    CONSTRAINT "EntityCommunityInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityCommunityMemberPosition_member_id_idx" ON "EntityCommunityMemberPosition"("member_id");

-- CreateIndex
CREATE INDEX "EntityCommunityMemberPosition_position_id_idx" ON "EntityCommunityMemberPosition"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityMemberPosition_member_id_position_id_key" ON "EntityCommunityMemberPosition"("member_id", "position_id");

-- CreateIndex
CREATE INDEX "EntityCommunityPosition_entity_community_id_idx" ON "EntityCommunityPosition"("entity_community_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityPosition_entity_community_id_name_key" ON "EntityCommunityPosition"("entity_community_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMemberPosition_entity_member_id_entity_position_id_key" ON "EntityMemberPosition"("entity_member_id", "entity_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserInviteToken_user_id_key" ON "UserInviteToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserInviteToken_token_key" ON "UserInviteToken"("token");

-- CreateIndex
CREATE INDEX "UserInviteToken_user_id_idx" ON "UserInviteToken"("user_id");

-- CreateIndex
CREATE INDEX "UserInvite_token_id_idx" ON "UserInvite"("token_id");

-- CreateIndex
CREATE INDEX "UserInvite_root_inviter_user_id_idx" ON "UserInvite"("root_inviter_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityInvite_invite_id_key" ON "EntityCommunityInvite"("invite_id");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_entity_id_key" ON "Brand"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityMember_entity_community_id_user_id_key" ON "EntityCommunityMember"("entity_community_id", "user_id");

-- CreateIndex
CREATE INDEX "EntityTag_tag_id_entity_id_idx" ON "EntityTag"("tag_id", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackComment_vote_box_id_key" ON "FeedbackComment"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTicket_vote_box_id_key" ON "FeedbackTicket"("vote_box_id");

-- CreateIndex
CREATE INDEX "FeedbackTicketStatusHistory_ticket_id_idx" ON "FeedbackTicketStatusHistory"("ticket_id");

-- CreateIndex
CREATE INDEX "FeedbackTicketStatusHistory_changedBy_id_idx" ON "FeedbackTicketStatusHistory"("changedBy_id");

-- AddForeignKey
ALTER TABLE "EntityTag" ADD CONSTRAINT "EntityTag_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityTag" ADD CONSTRAINT "EntityTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingTag" ADD CONSTRAINT "OfferingTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferingTag" ADD CONSTRAINT "OfferingTag_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtTag" ADD CONSTRAINT "ThoughtTag_thought_id_fkey" FOREIGN KEY ("thought_id") REFERENCES "Thought"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtTag" ADD CONSTRAINT "ThoughtTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_duplicateOf_id_fkey" FOREIGN KEY ("duplicateOf_id") REFERENCES "FeedbackTicket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" ADD CONSTRAINT "FeedbackTicketStatusHistory_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "FeedbackTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" ADD CONSTRAINT "FeedbackTicketStatusHistory_changedBy_id_fkey" FOREIGN KEY ("changedBy_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "FeedbackTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMemberPosition" ADD CONSTRAINT "EntityCommunityMemberPosition_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "EntityCommunityMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMemberPosition" ADD CONSTRAINT "EntityCommunityMemberPosition_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "EntityCommunityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityPosition" ADD CONSTRAINT "EntityCommunityPosition_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMemberPosition" ADD CONSTRAINT "EntityMemberPosition_entity_member_id_fkey" FOREIGN KEY ("entity_member_id") REFERENCES "EntityMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMemberPosition" ADD CONSTRAINT "EntityMemberPosition_entity_position_id_fkey" FOREIGN KEY ("entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInviteToken" ADD CONSTRAINT "UserInviteToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "UserInviteToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_root_inviter_user_id_fkey" FOREIGN KEY ("root_inviter_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityInvite" ADD CONSTRAINT "EntityCommunityInvite_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "UserInvite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityInvite" ADD CONSTRAINT "EntityCommunityInvite_inviter_membership_id_fkey" FOREIGN KEY ("inviter_membership_id") REFERENCES "EntityCommunityMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
