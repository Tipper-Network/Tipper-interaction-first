/*
  Warnings:

  - You are about to drop the column `user_id` on the `CommunityQNA` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `CommunityQNAResponses` table. All the data in the column will be lost.
  - You are about to drop the column `initiated_by_user_id` on the `EntityCommunity` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `EntityCommunityMember` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `FeedbackComment` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `FeedbackTicket` table. All the data in the column will be lost.
  - You are about to drop the column `changedBy_id` on the `FeedbackTicketStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `GroupChatMembers` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `GroupChatMessages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `PollVote` table. All the data in the column will be lost.
  - You are about to drop the column `entity_member_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `PostComments` table. All the data in the column will be lost.
  - You are about to drop the column `createdByUserId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Thought` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ThoughtComment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserCommunityVisit` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `EntityMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityMemberPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInterests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPersonas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserValues` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vote_box_id]` on the table `EntityCommunityInvite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[origin_invite_id]` on the table `EntityCommunityMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entity_community_id,profile_id]` on the table `EntityCommunityMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_chat_id,profile_id]` on the table `GroupChatMembers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_id,option_id]` on the table `PollVote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_id,vote_box_id]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profile_id` to the `CommunityQNA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `CommunityQNAResponses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationship_context` to the `EntityCommunityInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `why_initiating` to the `EntityCommunityInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `EntityCommunityMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_profile_id` to the `FeedbackComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_profile_id` to the `FeedbackTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changedBy_profile_id` to the `FeedbackTicketStatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `GroupChatMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `GroupChatMessages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `PollVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_operational_affiliation_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `PostComments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Thought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `ThoughtComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `UserCommunityVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommunityInviteVoteStatus" AS ENUM ('PENDING_VOTE', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OperationalRelationshipKind" AS ENUM ('OPERATIONAL_STAFF', 'CONTRACTOR', 'VOLUNTEER', 'ADVISOR');

-- CreateEnum
CREATE TYPE "CommercialRelationshipKind" AS ENUM ('SUBSCRIBER', 'SPONSOR', 'AMBASSADOR');

-- CreateEnum
CREATE TYPE "StrategicRelationshipKind" AS ENUM ('MEDIA_PARTNER', 'INVESTMENT_REPRESENTATIVE', 'VENDOR', 'PROJECT_COLLABORATOR', 'ALUMNI', 'APPLICANT', 'OTHER');

-- DropForeignKey
ALTER TABLE "CommunityQNA" DROP CONSTRAINT "CommunityQNA_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CommunityQNAResponses" DROP CONSTRAINT "CommunityQNAResponses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunity" DROP CONSTRAINT "EntityCommunity_initiated_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityMember" DROP CONSTRAINT "EntityCommunityMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityMember" DROP CONSTRAINT "EntityMember_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityMember" DROP CONSTRAINT "EntityMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityMemberPosition" DROP CONSTRAINT "EntityMemberPosition_entity_member_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityMemberPosition" DROP CONSTRAINT "EntityMemberPosition_entity_position_id_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackComment" DROP CONSTRAINT "FeedbackComment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicket" DROP CONSTRAINT "FeedbackTicket_author_id_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" DROP CONSTRAINT "FeedbackTicketStatusHistory_changedBy_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupChatMembers" DROP CONSTRAINT "GroupChatMembers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupChatMessages" DROP CONSTRAINT "GroupChatMessages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PollVote" DROP CONSTRAINT "PollVote_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_entity_member_id_fkey";

-- DropForeignKey
ALTER TABLE "PostComments" DROP CONSTRAINT "PostComments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Thought" DROP CONSTRAINT "Thought_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ThoughtComment" DROP CONSTRAINT "ThoughtComment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunityVisit" DROP CONSTRAINT "UserCommunityVisit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInterests" DROP CONSTRAINT "UserInterests_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInterests" DROP CONSTRAINT "UserInterests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInvite" DROP CONSTRAINT "UserInvite_invited_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonas" DROP CONSTRAINT "UserPersonas_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonas" DROP CONSTRAINT "UserPersonas_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserValues" DROP CONSTRAINT "UserValues_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserValues" DROP CONSTRAINT "UserValues_value_id_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_user_id_fkey";

-- DropIndex
DROP INDEX "CommunityQNA_community_id_user_id_idx";

-- DropIndex
DROP INDEX "EntityCommunityMember_entity_community_id_user_id_key";

-- DropIndex
DROP INDEX "EntityCommunityMember_user_id_idx";

-- DropIndex
DROP INDEX "FeedbackTicketStatusHistory_changedBy_id_idx";

-- DropIndex
DROP INDEX "GroupChatMembers_group_chat_id_user_id_key";

-- DropIndex
DROP INDEX "GroupChatMessages_user_id_group_chat_id_idx";

-- DropIndex
DROP INDEX "PollVote_user_id_idx";

-- DropIndex
DROP INDEX "PollVote_user_id_option_id_key";

-- DropIndex
DROP INDEX "Post_entity_member_id_idx";

-- DropIndex
DROP INDEX "PostComments_post_id_user_id_idx";

-- DropIndex
DROP INDEX "PostComments_user_id_idx";

-- DropIndex
DROP INDEX "Thought_community_id_user_id_idx";

-- DropIndex
DROP INDEX "Thought_user_id_idx";

-- DropIndex
DROP INDEX "ThoughtComment_thought_id_user_id_idx";

-- DropIndex
DROP INDEX "ThoughtComment_user_id_idx";

-- DropIndex
DROP INDEX "UserCommunityVisit_user_id_idx";

-- DropIndex
DROP INDEX "Vote_user_id_idx";

-- DropIndex
DROP INDEX "Vote_user_id_vote_box_id_key";

-- DropIndex
DROP INDEX "Vote_vote_box_id_user_id_idx";

-- AlterTable
ALTER TABLE "CommunityQNA" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommunityQNAResponses" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EntityCommunity" DROP COLUMN "initiated_by_user_id",
ADD COLUMN     "initiated_by_profile_id" TEXT;

-- AlterTable
ALTER TABLE "EntityCommunityInvite" ADD COLUMN     "decided_at" TIMESTAMP(3),
ADD COLUMN     "relationship_context" TEXT NOT NULL,
ADD COLUMN     "vote_box_id" TEXT,
ADD COLUMN     "vote_status" "CommunityInviteVoteStatus" NOT NULL DEFAULT 'PENDING_VOTE',
ADD COLUMN     "vote_threshold" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "what_invitee_does" TEXT,
ADD COLUMN     "why_initiating" TEXT NOT NULL,
ADD COLUMN     "why_invitee_wants_in" TEXT;

-- AlterTable
ALTER TABLE "EntityCommunityMember" DROP COLUMN "user_id",
ADD COLUMN     "origin_invite_id" TEXT,
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackComment" DROP COLUMN "author_id",
ADD COLUMN     "author_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackTicket" DROP COLUMN "author_id",
ADD COLUMN     "author_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeedbackTicketStatusHistory" DROP COLUMN "changedBy_id",
ADD COLUMN     "changedBy_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupChatMembers" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupChatMessages" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PollVote" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "entity_member_id",
ADD COLUMN     "profile_operational_affiliation_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PostComments" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "createdByUserId",
ADD COLUMN     "created_by_profile_id" TEXT;

-- AlterTable
ALTER TABLE "Thought" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ThoughtComment" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserCommunityVisit" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserInvite" ALTER COLUMN "invited_user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "EntityMember";

-- DropTable
DROP TABLE "EntityMemberPosition";

-- DropTable
DROP TABLE "UserInterests";

-- DropTable
DROP TABLE "UserPersonas";

-- DropTable
DROP TABLE "UserValues";

-- CreateTable
CREATE TABLE "ProfilePersonas" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "ProfilePersonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInterests" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "interest_id" TEXT NOT NULL,

    CONSTRAINT "ProfileInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileValues" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "value_id" TEXT NOT NULL,

    CONSTRAINT "ProfileValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileOperationalAffiliation" (
    "id" TEXT NOT NULL,
    "dominant_operational_kind" "OperationalRelationshipKind" NOT NULL DEFAULT 'OPERATIONAL_STAFF',
    "profile_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "anchor_entity_position_id" TEXT NOT NULL,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileOperationalAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileOperationalAffiliationPosition" (
    "id" TEXT NOT NULL,
    "operational_affiliation_id" TEXT NOT NULL,
    "entity_position_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileOperationalAffiliationPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCommercialAffiliation" (
    "id" TEXT NOT NULL,
    "commercial_kind" "CommercialRelationshipKind" NOT NULL,
    "profile_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "anchor_entity_position_id" TEXT NOT NULL,
    "membership_tier" TEXT,
    "subscription_id" TEXT,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileCommercialAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCommercialAffiliationPosition" (
    "id" TEXT NOT NULL,
    "commercial_affiliation_id" TEXT NOT NULL,
    "entity_position_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileCommercialAffiliationPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileStrategicAffiliation" (
    "id" TEXT NOT NULL,
    "strategic_kind" "StrategicRelationshipKind" NOT NULL DEFAULT 'OTHER',
    "profile_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "anchor_entity_position_id" TEXT NOT NULL,
    "reputation_score" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileStrategicAffiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileStrategicAffiliationPosition" (
    "id" TEXT NOT NULL,
    "strategic_affiliation_id" TEXT NOT NULL,
    "entity_position_id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ProfileStrategicAffiliationPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfilePersonas_profile_id_idx" ON "ProfilePersonas"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePersonas_profile_id_persona_id_key" ON "ProfilePersonas"("profile_id", "persona_id");

-- CreateIndex
CREATE INDEX "ProfileInterests_profile_id_idx" ON "ProfileInterests"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileInterests_profile_id_interest_id_key" ON "ProfileInterests"("profile_id", "interest_id");

-- CreateIndex
CREATE INDEX "ProfileValues_profile_id_idx" ON "ProfileValues"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileValues_profile_id_value_id_key" ON "ProfileValues"("profile_id", "value_id");

-- CreateIndex
CREATE INDEX "ProfileOperationalAffiliation_profile_id_idx" ON "ProfileOperationalAffiliation"("profile_id");

-- CreateIndex
CREATE INDEX "ProfileOperationalAffiliation_entity_id_idx" ON "ProfileOperationalAffiliation"("entity_id");

-- CreateIndex
CREATE INDEX "ProfileOperationalAffiliation_entity_id_dominant_operationa_idx" ON "ProfileOperationalAffiliation"("entity_id", "dominant_operational_kind");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileOperationalAffiliation_profile_id_anchor_entity_posi_key" ON "ProfileOperationalAffiliation"("profile_id", "anchor_entity_position_id");

-- CreateIndex
CREATE INDEX "ProfileOperationalAffiliationPosition_operational_affiliati_idx" ON "ProfileOperationalAffiliationPosition"("operational_affiliation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileOperationalAffiliationPosition_operational_affiliati_key" ON "ProfileOperationalAffiliationPosition"("operational_affiliation_id", "entity_position_id");

-- CreateIndex
CREATE INDEX "ProfileCommercialAffiliation_profile_id_idx" ON "ProfileCommercialAffiliation"("profile_id");

-- CreateIndex
CREATE INDEX "ProfileCommercialAffiliation_entity_id_idx" ON "ProfileCommercialAffiliation"("entity_id");

-- CreateIndex
CREATE INDEX "ProfileCommercialAffiliation_entity_id_commercial_kind_idx" ON "ProfileCommercialAffiliation"("entity_id", "commercial_kind");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileCommercialAffiliation_profile_id_anchor_entity_posit_key" ON "ProfileCommercialAffiliation"("profile_id", "anchor_entity_position_id");

-- CreateIndex
CREATE INDEX "ProfileCommercialAffiliationPosition_commercial_affiliation_idx" ON "ProfileCommercialAffiliationPosition"("commercial_affiliation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileCommercialAffiliationPosition_commercial_affiliation_key" ON "ProfileCommercialAffiliationPosition"("commercial_affiliation_id", "entity_position_id");

-- CreateIndex
CREATE INDEX "ProfileStrategicAffiliation_profile_id_idx" ON "ProfileStrategicAffiliation"("profile_id");

-- CreateIndex
CREATE INDEX "ProfileStrategicAffiliation_entity_id_idx" ON "ProfileStrategicAffiliation"("entity_id");

-- CreateIndex
CREATE INDEX "ProfileStrategicAffiliation_entity_id_strategic_kind_idx" ON "ProfileStrategicAffiliation"("entity_id", "strategic_kind");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileStrategicAffiliation_profile_id_anchor_entity_positi_key" ON "ProfileStrategicAffiliation"("profile_id", "anchor_entity_position_id");

-- CreateIndex
CREATE INDEX "ProfileStrategicAffiliationPosition_strategic_affiliation_i_idx" ON "ProfileStrategicAffiliationPosition"("strategic_affiliation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileStrategicAffiliationPosition_strategic_affiliation_i_key" ON "ProfileStrategicAffiliationPosition"("strategic_affiliation_id", "entity_position_id");

-- CreateIndex
CREATE INDEX "CommunityQNA_community_id_profile_id_idx" ON "CommunityQNA"("community_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityInvite_vote_box_id_key" ON "EntityCommunityInvite"("vote_box_id");

-- CreateIndex
CREATE INDEX "EntityCommunityInvite_inviter_membership_id_idx" ON "EntityCommunityInvite"("inviter_membership_id");

-- CreateIndex
CREATE INDEX "EntityCommunityInvite_vote_status_idx" ON "EntityCommunityInvite"("vote_status");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityMember_origin_invite_id_key" ON "EntityCommunityMember"("origin_invite_id");

-- CreateIndex
CREATE INDEX "EntityCommunityMember_profile_id_idx" ON "EntityCommunityMember"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityMember_entity_community_id_profile_id_key" ON "EntityCommunityMember"("entity_community_id", "profile_id");

-- CreateIndex
CREATE INDEX "FeedbackTicketStatusHistory_changedBy_profile_id_idx" ON "FeedbackTicketStatusHistory"("changedBy_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChatMembers_group_chat_id_profile_id_key" ON "GroupChatMembers"("group_chat_id", "profile_id");

-- CreateIndex
CREATE INDEX "GroupChatMessages_profile_id_group_chat_id_idx" ON "GroupChatMessages"("profile_id", "group_chat_id");

-- CreateIndex
CREATE INDEX "PollVote_profile_id_idx" ON "PollVote"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_profile_id_option_id_key" ON "PollVote"("profile_id", "option_id");

-- CreateIndex
CREATE INDEX "Post_profile_operational_affiliation_id_idx" ON "Post"("profile_operational_affiliation_id");

-- CreateIndex
CREATE INDEX "PostComments_post_id_profile_id_idx" ON "PostComments"("post_id", "profile_id");

-- CreateIndex
CREATE INDEX "PostComments_profile_id_idx" ON "PostComments"("profile_id");

-- CreateIndex
CREATE INDEX "Thought_profile_id_idx" ON "Thought"("profile_id");

-- CreateIndex
CREATE INDEX "Thought_community_id_profile_id_idx" ON "Thought"("community_id", "profile_id");

-- CreateIndex
CREATE INDEX "ThoughtComment_thought_id_profile_id_idx" ON "ThoughtComment"("thought_id", "profile_id");

-- CreateIndex
CREATE INDEX "ThoughtComment_profile_id_idx" ON "ThoughtComment"("profile_id");

-- CreateIndex
CREATE INDEX "UserCommunityVisit_profile_id_idx" ON "UserCommunityVisit"("profile_id");

-- CreateIndex
CREATE INDEX "Vote_vote_box_id_profile_id_idx" ON "Vote"("vote_box_id", "profile_id");

-- CreateIndex
CREATE INDEX "Vote_profile_id_idx" ON "Vote"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_profile_id_vote_box_id_key" ON "Vote"("profile_id", "vote_box_id");

-- AddForeignKey
ALTER TABLE "EntityCommunity" ADD CONSTRAINT "EntityCommunity_initiated_by_profile_id_fkey" FOREIGN KEY ("initiated_by_profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePersonas" ADD CONSTRAINT "ProfilePersonas_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePersonas" ADD CONSTRAINT "ProfilePersonas_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "ReferencePersonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterests" ADD CONSTRAINT "ProfileInterests_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterests" ADD CONSTRAINT "ProfileInterests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "ReferenceInterests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileValues" ADD CONSTRAINT "ProfileValues_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileValues" ADD CONSTRAINT "ProfileValues_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "ReferenceValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profile_operational_affiliation_id_fkey" FOREIGN KEY ("profile_operational_affiliation_id") REFERENCES "ProfileOperationalAffiliation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNA" ADD CONSTRAINT "CommunityQNA_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNAResponses" ADD CONSTRAINT "CommunityQNAResponses_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMembers" ADD CONSTRAINT "GroupChatMembers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMessages" ADD CONSTRAINT "GroupChatMessages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_created_by_profile_id_fkey" FOREIGN KEY ("created_by_profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thought" ADD CONSTRAINT "Thought_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtComment" ADD CONSTRAINT "ThoughtComment_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" ADD CONSTRAINT "FeedbackTicketStatusHistory_changedBy_profile_id_fkey" FOREIGN KEY ("changedBy_profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvite" ADD CONSTRAINT "UserInvite_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityInvite" ADD CONSTRAINT "EntityCommunityInvite_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_origin_invite_id_fkey" FOREIGN KEY ("origin_invite_id") REFERENCES "EntityCommunityInvite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileOperationalAffiliation" ADD CONSTRAINT "ProfileOperationalAffiliation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileOperationalAffiliation" ADD CONSTRAINT "ProfileOperationalAffiliation_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileOperationalAffiliation" ADD CONSTRAINT "ProfileOperationalAffiliation_anchor_entity_position_id_fkey" FOREIGN KEY ("anchor_entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileOperationalAffiliationPosition" ADD CONSTRAINT "ProfileOperationalAffiliationPosition_operational_affiliat_fkey" FOREIGN KEY ("operational_affiliation_id") REFERENCES "ProfileOperationalAffiliation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileOperationalAffiliationPosition" ADD CONSTRAINT "ProfileOperationalAffiliationPosition_entity_position_id_fkey" FOREIGN KEY ("entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCommercialAffiliation" ADD CONSTRAINT "ProfileCommercialAffiliation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCommercialAffiliation" ADD CONSTRAINT "ProfileCommercialAffiliation_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCommercialAffiliation" ADD CONSTRAINT "ProfileCommercialAffiliation_anchor_entity_position_id_fkey" FOREIGN KEY ("anchor_entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCommercialAffiliationPosition" ADD CONSTRAINT "ProfileCommercialAffiliationPosition_commercial_affiliatio_fkey" FOREIGN KEY ("commercial_affiliation_id") REFERENCES "ProfileCommercialAffiliation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCommercialAffiliationPosition" ADD CONSTRAINT "ProfileCommercialAffiliationPosition_entity_position_id_fkey" FOREIGN KEY ("entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStrategicAffiliation" ADD CONSTRAINT "ProfileStrategicAffiliation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStrategicAffiliation" ADD CONSTRAINT "ProfileStrategicAffiliation_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStrategicAffiliation" ADD CONSTRAINT "ProfileStrategicAffiliation_anchor_entity_position_id_fkey" FOREIGN KEY ("anchor_entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStrategicAffiliationPosition" ADD CONSTRAINT "ProfileStrategicAffiliationPosition_strategic_affiliation__fkey" FOREIGN KEY ("strategic_affiliation_id") REFERENCES "ProfileStrategicAffiliation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStrategicAffiliationPosition" ADD CONSTRAINT "ProfileStrategicAffiliationPosition_entity_position_id_fkey" FOREIGN KEY ("entity_position_id") REFERENCES "EntityPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunityVisit" ADD CONSTRAINT "UserCommunityVisit_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
