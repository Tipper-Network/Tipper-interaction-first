/*
  Warnings:

  - You are about to drop the column `city` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Entity` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "neighborhood",
DROP COLUMN "street",
ADD COLUMN     "address" JSONB;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
