/*
  Warnings:

  - You are about to drop the column `vote_box_id` on the `EntityMedia` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostTarget" AS ENUM ('MEMBERS', 'VISITORS', 'BROWSERS', 'ALL');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ANNOUNCEMENT', 'EVENT', 'OFFER', 'POLL', 'UPDATE', 'STORY');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('FEATURE', 'COMPLAINT', 'SUGGESTION', 'EVENT_IDEA', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING_APPROVAL', 'IN_PROGRESS', 'OPEN', 'PLANNED', 'COMPLETED', 'CLOSED', 'REJECTED', 'DUPLICATE');

-- DropForeignKey
ALTER TABLE "EntityMedia" DROP CONSTRAINT "EntityMedia_vote_box_id_fkey";

-- DropIndex
DROP INDEX "EntityMedia_vote_box_id_key";

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "enterprise_id" TEXT;

-- AlterTable
ALTER TABLE "EntityMedia" DROP COLUMN "vote_box_id";

-- CreateTable
CREATE TABLE "EntityMember" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "position" "EntityUserPositionType" NOT NULL,
    "role" "EntityRoleType" NOT NULL,

    CONSTRAINT "EntityMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "visibility" "PostTarget" NOT NULL DEFAULT 'ALL',
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "boosted_until" TIMESTAMP(3),
    "pinned_until" TIMESTAMP(3),
    "entity_id" TEXT NOT NULL,
    "entity_member_id" TEXT NOT NULL,
    "vote_box_id" TEXT NOT NULL,
    "published_by_enterprise_id" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostMedia" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote_box_id" TEXT,

    CONSTRAINT "PostComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackTicket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "voteBoxId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "type" "TicketType" NOT NULL,
    "priority" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "voteBoxId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enterprise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_vote_box_id_key" ON "Post"("vote_box_id");

-- CreateIndex
CREATE INDEX "Post_entity_id_idx" ON "Post"("entity_id");

-- CreateIndex
CREATE INDEX "Post_entity_member_id_idx" ON "Post"("entity_member_id");

-- CreateIndex
CREATE INDEX "Post_published_by_enterprise_id_idx" ON "Post"("published_by_enterprise_id");

-- CreateIndex
CREATE INDEX "PostMedia_post_id_idx" ON "PostMedia"("post_id");

-- CreateIndex
CREATE INDEX "PostComments_post_id_user_id_idx" ON "PostComments"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "PostComments_user_id_idx" ON "PostComments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostComments_vote_box_id_key" ON "PostComments"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTicket_voteBoxId_key" ON "FeedbackTicket"("voteBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackComment_voteBoxId_key" ON "FeedbackComment"("voteBoxId");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMember" ADD CONSTRAINT "EntityMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_entity_member_id_fkey" FOREIGN KEY ("entity_member_id") REFERENCES "EntityMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_published_by_enterprise_id_fkey" FOREIGN KEY ("published_by_enterprise_id") REFERENCES "Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_voteBoxId_fkey" FOREIGN KEY ("voteBoxId") REFERENCES "VoteBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "FeedbackTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_voteBoxId_fkey" FOREIGN KEY ("voteBoxId") REFERENCES "VoteBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackComment" ADD CONSTRAINT "FeedbackComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
