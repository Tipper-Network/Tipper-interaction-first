/*
  Warnings:

  - You are about to drop the column `logo_url` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagEntity` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TagType" ADD VALUE 'SERVICE';
ALTER TYPE "TagType" ADD VALUE 'OTHER';

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_vote_box_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_community_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_vote_box_id_fkey";

-- DropForeignKey
ALTER TABLE "PostMedia" DROP CONSTRAINT "PostMedia_post_id_fkey";

-- DropForeignKey
ALTER TABLE "PostMedia" DROP CONSTRAINT "PostMedia_vote_box_id_fkey";

-- DropForeignKey
ALTER TABLE "TagEntity" DROP CONSTRAINT "TagEntity_entityId_fkey";

-- DropForeignKey
ALTER TABLE "TagEntity" DROP CONSTRAINT "TagEntity_tagId_fkey";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "logo_url";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "description";

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostMedia";

-- DropTable
DROP TABLE "TagEntity";

-- CreateTable
CREATE TABLE "EntityTag" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thought" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "vote_box_id" TEXT,

    CONSTRAINT "Thought_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThoughtMedia" (
    "id" TEXT NOT NULL,
    "thought_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote_box_id" TEXT,

    CONSTRAINT "ThoughtMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThoughtComment" (
    "id" TEXT NOT NULL,
    "thought_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote_box_id" TEXT,

    CONSTRAINT "ThoughtComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityTag_tagId_entityId_idx" ON "EntityTag"("tagId", "entityId");

-- CreateIndex
CREATE INDEX "Thought_community_id_idx" ON "Thought"("community_id");

-- CreateIndex
CREATE INDEX "Thought_user_id_idx" ON "Thought"("user_id");

-- CreateIndex
CREATE INDEX "Thought_community_id_user_id_idx" ON "Thought"("community_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Thought_vote_box_id_key" ON "Thought"("vote_box_id");

-- CreateIndex
CREATE INDEX "ThoughtMedia_thought_id_idx" ON "ThoughtMedia"("thought_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThoughtMedia_vote_box_id_key" ON "ThoughtMedia"("vote_box_id");

-- CreateIndex
CREATE INDEX "ThoughtComment_thought_id_user_id_idx" ON "ThoughtComment"("thought_id", "user_id");

-- CreateIndex
CREATE INDEX "ThoughtComment_user_id_idx" ON "ThoughtComment"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThoughtComment_vote_box_id_key" ON "ThoughtComment"("vote_box_id");

-- CreateIndex
CREATE INDEX "OfferingMedia_offering_id_idx" ON "OfferingMedia"("offering_id");

-- AddForeignKey
ALTER TABLE "EntityTag" ADD CONSTRAINT "EntityTag_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityTag" ADD CONSTRAINT "EntityTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thought" ADD CONSTRAINT "Thought_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thought" ADD CONSTRAINT "Thought_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thought" ADD CONSTRAINT "Thought_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtMedia" ADD CONSTRAINT "ThoughtMedia_thought_id_fkey" FOREIGN KEY ("thought_id") REFERENCES "Thought"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtMedia" ADD CONSTRAINT "ThoughtMedia_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtComment" ADD CONSTRAINT "ThoughtComment_thought_id_fkey" FOREIGN KEY ("thought_id") REFERENCES "Thought"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtComment" ADD CONSTRAINT "ThoughtComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtComment" ADD CONSTRAINT "ThoughtComment_vote_box_id_fkey" FOREIGN KEY ("vote_box_id") REFERENCES "VoteBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
