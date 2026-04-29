/*
  Warnings:

  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MembershipAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('ENTITY', 'ENTITY_COMMUNITY', 'PARTNERSHIP', 'EVENT', 'GLOBAL');

-- DropForeignKey
ALTER TABLE "MembershipAttribute" DROP CONSTRAINT "MembershipAttribute_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "MembershipAttribute" DROP CONSTRAINT "MembershipAttribute_entity_community_member_id_fkey";

-- DropForeignKey
ALTER TABLE "MembershipAttribute" DROP CONSTRAINT "MembershipAttribute_entity_member_id_fkey";

-- AlterTable
ALTER TABLE "RequestClaim" ADD COLUMN     "user_entity_position_id" INTEGER;

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "MembershipAttribute";

-- DropEnum
DROP TYPE "AttributeScope";

-- DropEnum
DROP TYPE "MembershipType";

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "permissionScope" "PermissionScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMemberPosition" (
    "id" SERIAL NOT NULL,
    "positionName" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityMemberPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestClaim" ADD CONSTRAINT "RequestClaim_user_entity_position_id_fkey" FOREIGN KEY ("user_entity_position_id") REFERENCES "EntityMemberPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
