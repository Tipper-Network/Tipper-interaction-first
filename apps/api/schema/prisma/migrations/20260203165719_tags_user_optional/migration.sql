-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "createdByUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
