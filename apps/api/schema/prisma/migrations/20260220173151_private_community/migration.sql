-- CreateEnum
CREATE TYPE "EntityCommunityPrivacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "EntityCommunityMembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'LEFT', 'BANNED', 'REJECTED');

-- AlterTable
ALTER TABLE "EntityCommunityMember" ADD COLUMN     "status" "EntityCommunityMembershipStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ThoughtTag" (
    "id" TEXT NOT NULL,
    "thoughtId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThoughtTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThoughtTag" ADD CONSTRAINT "ThoughtTag_thoughtId_fkey" FOREIGN KEY ("thoughtId") REFERENCES "Thought"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThoughtTag" ADD CONSTRAINT "ThoughtTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
