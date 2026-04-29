-- AlterEnum
ALTER TYPE "PartnershipInvitationStatus" ADD VALUE 'NOT_FOUND';

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "colors" JSONB,
    "qrStyle" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_entityId_key" ON "Brand"("entityId");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
