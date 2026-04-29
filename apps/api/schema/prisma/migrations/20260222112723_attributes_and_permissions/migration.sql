-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('ENTITY_MEMBER', 'ENTITY_COMMUNITY_MEMBER', 'EVENT_MEMBER', 'OTHER');

-- CreateEnum
CREATE TYPE "AttributeScope" AS ENUM ('ENTITY', 'ENTITY_COMMUNITY', 'PARTNERSHIP', 'EVENT', 'GLOBAL');

-- DropForeignKey
ALTER TABLE "EntityCommunityMember" DROP CONSTRAINT "EntityCommunityMember_entity_community_id_fkey";

-- DropForeignKey
ALTER TABLE "EntityCommunityMember" DROP CONSTRAINT "EntityCommunityMember_user_id_fkey";

-- AlterTable
ALTER TABLE "FeedbackTicket" ADD COLUMN     "duplicateOfId" TEXT;

-- AlterTable
ALTER TABLE "Partnership" ADD COLUMN     "partnershipType" "PartnershipType";

-- CreateTable
CREATE TABLE "FeedbackTicketStatusHistory" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "oldStatus" "TicketStatus",
    "newStatus" "TicketStatus" NOT NULL,
    "changedById" TEXT NOT NULL,
    "note" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackTicketStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipAttribute" (
    "id" TEXT NOT NULL,
    "membership_type" "MembershipType" NOT NULL,
    "attribute_key" TEXT NOT NULL,
    "attribute_value" TEXT NOT NULL,
    "attribute_id" TEXT,
    "entity_community_member_id" TEXT,
    "entity_member_id" TEXT,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "MembershipAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "attributeScope" "AttributeScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackTicketStatusHistory_ticketId_idx" ON "FeedbackTicketStatusHistory"("ticketId");

-- CreateIndex
CREATE INDEX "FeedbackTicketStatusHistory_changedById_idx" ON "FeedbackTicketStatusHistory"("changedById");

-- CreateIndex
CREATE INDEX "MembershipAttribute_membership_type_entity_member_id_idx" ON "MembershipAttribute"("membership_type", "entity_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipAttribute_membership_type_entity_member_id_attrib_key" ON "MembershipAttribute"("membership_type", "entity_member_id", "attribute_key");

-- AddForeignKey
ALTER TABLE "FeedbackTicket" ADD CONSTRAINT "FeedbackTicket_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "FeedbackTicket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" ADD CONSTRAINT "FeedbackTicketStatusHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "FeedbackTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTicketStatusHistory" ADD CONSTRAINT "FeedbackTicketStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMember" ADD CONSTRAINT "EntityCommunityMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAttribute" ADD CONSTRAINT "MembershipAttribute_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAttribute" ADD CONSTRAINT "MembershipAttribute_entity_community_member_id_fkey" FOREIGN KEY ("entity_community_member_id") REFERENCES "EntityCommunityMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipAttribute" ADD CONSTRAINT "MembershipAttribute_entity_member_id_fkey" FOREIGN KEY ("entity_member_id") REFERENCES "EntityMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
