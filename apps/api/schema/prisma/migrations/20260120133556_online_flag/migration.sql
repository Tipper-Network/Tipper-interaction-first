-- DropIndex
DROP INDEX "Entity_slug_instagram_url_idx";

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "operates_online" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagEntity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entityId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TagEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "TagEntity_tagId_entityId_idx" ON "TagEntity"("tagId", "entityId");

-- CreateIndex
CREATE INDEX "Entity_slug_instagram_url_email_phone_idx" ON "Entity"("slug", "instagram_url", "email", "phone");

-- AddForeignKey
ALTER TABLE "TagEntity" ADD CONSTRAINT "TagEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagEntity" ADD CONSTRAINT "TagEntity_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
