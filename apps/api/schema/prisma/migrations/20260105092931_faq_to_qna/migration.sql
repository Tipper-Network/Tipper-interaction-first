/*
  Warnings:

  - You are about to drop the column `downvotes_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes_count` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQResponses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQResponsesVotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQVotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostVotes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vote_box_id]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `GroupChat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `GroupChatMessages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vote_box_id]` on the table `PostMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN', 'HELPFUL', 'NOT_HELPFUL');

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_community_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQResponses" DROP CONSTRAINT "FAQResponses_faq_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQResponses" DROP CONSTRAINT "FAQResponses_parent_response_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQResponses" DROP CONSTRAINT "FAQResponses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQResponsesVotes" DROP CONSTRAINT "FAQResponsesVotes_faq_response_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQResponsesVotes" DROP CONSTRAINT "FAQResponsesVotes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQVotes" DROP CONSTRAINT "FAQVotes_faq_id_fkey";

-- DropForeignKey
ALTER TABLE "FAQVotes" DROP CONSTRAINT "FAQVotes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PostVotes" DROP CONSTRAINT "PostVotes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "PostVotes" DROP CONSTRAINT "PostVotes_user_id_fkey";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "vote_box_id" TEXT;

-- AlterTable
ALTER TABLE "EntityCommunityMembers" ADD COLUMN     "last_visited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GroupChat" ADD COLUMN     "vote_box_id" TEXT;

-- AlterTable
ALTER TABLE "GroupChatMessages" ADD COLUMN     "vote_box_id" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "downvotes_count",
DROP COLUMN "upvotes_count",
ADD COLUMN     "vote_box_id" TEXT;

-- AlterTable
ALTER TABLE "PostMedia" ADD COLUMN     "vote_box_id" TEXT;

-- DropTable
DROP TABLE "FAQ";

-- DropTable
DROP TABLE "FAQResponses";

-- DropTable
DROP TABLE "FAQResponsesVotes";

-- DropTable
DROP TABLE "FAQVotes";

-- DropTable
DROP TABLE "PostVotes";

-- DropEnum
DROP TYPE "FAQVoteTypes";

-- DropEnum
DROP TYPE "PostVoteTypes";

-- CreateTable
CREATE TABLE "VoteBox" (
    "id" TEXT NOT NULL,
    "upvotes_count" INTEGER NOT NULL DEFAULT 0,
    "downvotes_count" INTEGER NOT NULL DEFAULT 0,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "not_helpful_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoteBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_box_id" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityQNA" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY['']::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "responses_count" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "vote_box_id" TEXT,
    "community_id" TEXT NOT NULL,

    CONSTRAINT "CommunityQNA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityQNAResponses" (
    "id" TEXT NOT NULL,
    "community_qna_id" TEXT NOT NULL,
    "parent_response_id" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_box_id" TEXT,

    CONSTRAINT "CommunityQNAResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_vote_box_id_user_id_idx" ON "Vote"("vote_box_id", "user_id");

-- CreateIndex
CREATE INDEX "Vote_user_id_idx" ON "Vote"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_user_id_vote_box_id_key" ON "Vote"("user_id", "vote_box_id");

-- CreateIndex
CREATE INDEX "CommunityQNA_community_id_user_id_idx" ON "CommunityQNA"("community_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityQNA_vote_box_id_key" ON "CommunityQNA"("vote_box_id");

-- CreateIndex
CREATE INDEX "CommunityQNAResponses_community_qna_id_parent_response_id_idx" ON "CommunityQNAResponses"("community_qna_id", "parent_response_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityQNAResponses_vote_box_id_key" ON "CommunityQNAResponses"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_vote_box_id_key" ON "Comments"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChat_vote_box_id_key" ON "GroupChat"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChatMessages_vote_box_id_key" ON "GroupChatMessages"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_vote_box_id_key" ON "Post"("vote_box_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostMedia_vote_box_id_key" ON "PostMedia"("vote_box_id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNA" ADD CONSTRAINT "CommunityQNA_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNA" ADD CONSTRAINT "CommunityQNA_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNA" ADD CONSTRAINT "CommunityQNA_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNAResponses" ADD CONSTRAINT "CommunityQNAResponses_community_qna_id_fkey" FOREIGN KEY ("community_qna_id") REFERENCES "CommunityQNA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNAResponses" ADD CONSTRAINT "CommunityQNAResponses_parent_response_id_fkey" FOREIGN KEY ("parent_response_id") REFERENCES "CommunityQNAResponses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNAResponses" ADD CONSTRAINT "CommunityQNAResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityQNAResponses" ADD CONSTRAINT "CommunityQNAResponses_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMessages" ADD CONSTRAINT "GroupChatMessages_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
