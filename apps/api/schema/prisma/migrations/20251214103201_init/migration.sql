-- CreateEnum
CREATE TYPE "EntityCommunityStatus" AS ENUM ('PENDING_APPROVAL', 'PENDING_VERIFICATION', 'UNCLAIMED', 'CLAIMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('BUSINESS', 'SOCIAL_ORGANIZATION', 'NON_GOVERNMENTAL_ORGANIZATION', 'CIVIC_ORGANIZATION', 'GUILD', 'PERSONAL_BRAND', 'OTHER');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('UNCLAIMED', 'CLAIMED', 'FULLY_SETUP');

-- CreateEnum
CREATE TYPE "RequestClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "ClaimMediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('IN_PERSON', 'EMAIL', 'PHONE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PostVoteTypes" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "FAQVoteTypes" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'VERIFIED', 'ADMIN');

-- CreateEnum
CREATE TYPE "EntityUserPositionType" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "EntityRoleType" AS ENUM ('SUPER_ADMIN', 'ADMINISTRATOR', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR', 'SUBSCRIBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PartnershipInvitationSource" AS ENUM ('OUTBOUND_INVITE', 'INBOUND_REQUEST');

-- CreateEnum
CREATE TYPE "PartnershipInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PartnershipInvitationIntent" AS ENUM ('ONBOARD_BUSINESS', 'FORM_PARTNERSHIP', 'COLLAB_INTEREST', 'CO_CREATE', 'AUDIENCE_EXCHANGE', 'SERVICE_COMPLEMENT', 'MARKET_EXPANSION', 'SHARED_VALUES', 'ECOSYSTEM_DEPENDENCY', 'NETWORK_CREDIBILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "PartnershipStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ENDED');

-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('SPONSORSHIP', 'STRATEGIC_ALLIANCE', 'PRODUCT_PARTNERSHIP', 'DISTRIBUTION_PARTNERSHIP', 'MARKETING_PARTNERSHIP', 'COLLABORATION', 'COMMUNITY_BUILDING', 'EVENT_PARTNERSHIP', 'CONTENT_CREATION', 'TECHNICAL_SUPPORT', 'LEARNING_AND_DEVELOPMENT', 'OTHER_TYPE');

-- CreateTable
CREATE TABLE "EntityCommunity" (
    "id" TEXT NOT NULL,
    "community_name" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "initiated_by_user_id" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "users_count" INTEGER NOT NULL DEFAULT 0,
    "community_status" "EntityCommunityStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',

    CONSTRAINT "EntityCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCommunityMembers" (
    "id" TEXT NOT NULL,
    "entity_community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EntityCommunityMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTypes" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "industry_description" TEXT NOT NULL,
    "business_type" TEXT NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "BusinessTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "entity_type" "EntityType" NOT NULL DEFAULT 'BUSINESS',
    "description" TEXT,
    "city" TEXT,
    "neighborhood" TEXT,
    "street" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "instagram_url" TEXT,
    "logo_url" TEXT,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "metadata" JSONB,
    "business_type_id" TEXT,
    "schedule" JSONB,
    "entity_status" "EntityStatus" NOT NULL DEFAULT 'UNCLAIMED',

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestClaim" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "claim_status" "RequestClaimStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_email" TEXT NOT NULL,
    "entity_phone" TEXT NOT NULL,
    "instagram_url" TEXT,
    "additional_notes" TEXT,
    "user_entity_position" "EntityUserPositionType",
    "verification_type" "VerificationType" NOT NULL,

    CONSTRAINT "RequestClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestClaimMedia" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ClaimMediaType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestClaimMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityInterestsEntries" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "interest_id" TEXT NOT NULL,

    CONSTRAINT "EntityInterestsEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityValuesEntries" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "value_id" TEXT NOT NULL,

    CONSTRAINT "EntityValuesEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityArchetypesEntries" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "archetype_id" TEXT NOT NULL,

    CONSTRAINT "EntityArchetypesEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "federated_identity_user" BOOLEAN NOT NULL DEFAULT false,
    "user_role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "date_of_birth" TIMESTAMP(3),
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "interests_setup" BOOLEAN NOT NULL DEFAULT false,
    "profile_setup" BOOLEAN NOT NULL DEFAULT false,
    "personas_setup" BOOLEAN NOT NULL DEFAULT false,
    "values_setup" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPersonas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,

    CONSTRAINT "UserPersonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInterests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interest_id" TEXT NOT NULL,

    CONSTRAINT "UserInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserValues" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value_id" TEXT NOT NULL,

    CONSTRAINT "UserValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "upvotes_count" INTEGER NOT NULL DEFAULT 0,
    "downvotes_count" INTEGER NOT NULL DEFAULT 0,

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
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostVotes" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "vote_type" "PostVoteTypes" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChat" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "groupchat_name" TEXT NOT NULL,
    "members_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChatMembers" (
    "id" TEXT NOT NULL,
    "group_chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupChatMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChatMessages" (
    "id" TEXT NOT NULL,
    "group_chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL DEFAULT 'unknown',
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupChatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "poll_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVote" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "voted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personas" (
    "id" TEXT NOT NULL,
    "icon_url" TEXT,
    "persona_name" TEXT NOT NULL,
    "persona_description" TEXT NOT NULL,

    CONSTRAINT "Personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Values" (
    "id" TEXT NOT NULL,
    "value_name" TEXT NOT NULL,
    "value_description" TEXT NOT NULL,

    CONSTRAINT "Values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interests" (
    "id" TEXT NOT NULL,
    "interest_name" TEXT NOT NULL,
    "interest_category" TEXT NOT NULL,

    CONSTRAINT "Interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityArchetypes" (
    "id" TEXT NOT NULL,
    "icon_url" TEXT,
    "archetype_name" TEXT NOT NULL,
    "archetype_description" TEXT NOT NULL,

    CONSTRAINT "EntityArchetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityValues" (
    "id" TEXT NOT NULL,
    "value_name" TEXT NOT NULL,
    "value_description" TEXT NOT NULL,

    CONSTRAINT "EntityValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityInterests" (
    "id" TEXT NOT NULL,
    "interest_name" TEXT NOT NULL,
    "interest_category" TEXT NOT NULL,

    CONSTRAINT "EntityInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY['']::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "upvotes_count" INTEGER NOT NULL DEFAULT 0,
    "downvotes_count" INTEGER NOT NULL DEFAULT 0,
    "responses_count" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQVotes" (
    "id" TEXT NOT NULL,
    "faq_id" TEXT NOT NULL,
    "vote_type" "FAQVoteTypes" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQResponses" (
    "id" TEXT NOT NULL,
    "faq_id" TEXT NOT NULL,
    "parent_response_id" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "upvotes_count" INTEGER NOT NULL DEFAULT 0,
    "downvotes_count" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "FAQResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQResponsesVotes" (
    "id" TEXT NOT NULL,
    "faq_response_id" TEXT NOT NULL,
    "vote_type" "FAQVoteTypes" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQResponsesVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vibes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,

    CONSTRAINT "Vibes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCommunityVibes" (
    "id" TEXT NOT NULL,
    "entity_community_id" TEXT NOT NULL,
    "vibe_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityCommunityVibes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityUserRole" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "user_id" TEXT,
    "user_entity_position" "EntityUserPositionType" NOT NULL DEFAULT 'STAFF',
    "user_platform_role" "EntityRoleType" NOT NULL DEFAULT 'VIEWER',
    "name" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipInvitation" (
    "id" TEXT NOT NULL,
    "inviter_entity_id" TEXT NOT NULL,
    "invitee_entity_id" TEXT,
    "invitee_name" TEXT,
    "invitee_email" TEXT,
    "invitee_phone" TEXT,
    "invitee_instagram_handle" TEXT NOT NULL,
    "note" TEXT,
    "status" "PartnershipInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "source" "PartnershipInvitationSource" NOT NULL,
    "intent" "PartnershipInvitationIntent" NOT NULL DEFAULT 'ONBOARD_BUSINESS',
    "reward_months" INTEGER NOT NULL DEFAULT 0,
    "accepted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partnership" (
    "id" TEXT NOT NULL,
    "entity_a_id" TEXT NOT NULL,
    "entity_b_id" TEXT NOT NULL,
    "status" "PartnershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "details" JSONB,
    "origin_invitation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunity_entity_id_key" ON "EntityCommunity"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunity_slug_key" ON "EntityCommunity"("slug");

-- CreateIndex
CREATE INDEX "EntityCommunity_entity_id_slug_idx" ON "EntityCommunity"("entity_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessTypes_industry_business_type_key" ON "BusinessTypes"("industry", "business_type");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_slug_key" ON "Entity"("slug");

-- CreateIndex
CREATE INDEX "Entity_slug_instagram_url_idx" ON "Entity"("slug", "instagram_url");

-- CreateIndex
CREATE INDEX "RequestClaim_user_id_idx" ON "RequestClaim"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestClaim_user_id_community_id_entity_id_key" ON "RequestClaim"("user_id", "community_id", "entity_id");

-- CreateIndex
CREATE INDEX "RequestClaimMedia_claim_id_idx" ON "RequestClaimMedia"("claim_id");

-- CreateIndex
CREATE INDEX "EntityInterestsEntries_entity_id_idx" ON "EntityInterestsEntries"("entity_id");

-- CreateIndex
CREATE INDEX "EntityInterestsEntries_interest_id_idx" ON "EntityInterestsEntries"("interest_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityInterestsEntries_entity_id_interest_id_key" ON "EntityInterestsEntries"("entity_id", "interest_id");

-- CreateIndex
CREATE INDEX "EntityValuesEntries_entity_id_idx" ON "EntityValuesEntries"("entity_id");

-- CreateIndex
CREATE INDEX "EntityValuesEntries_value_id_idx" ON "EntityValuesEntries"("value_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityValuesEntries_entity_id_value_id_key" ON "EntityValuesEntries"("entity_id", "value_id");

-- CreateIndex
CREATE INDEX "EntityArchetypesEntries_entity_id_idx" ON "EntityArchetypesEntries"("entity_id");

-- CreateIndex
CREATE INDEX "EntityArchetypesEntries_archetype_id_idx" ON "EntityArchetypesEntries"("archetype_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityArchetypesEntries_entity_id_archetype_id_key" ON "EntityArchetypesEntries"("entity_id", "archetype_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE INDEX "Profile_user_id_idx" ON "Profile"("user_id");

-- CreateIndex
CREATE INDEX "UserPersonas_user_id_idx" ON "UserPersonas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPersonas_user_id_persona_id_key" ON "UserPersonas"("user_id", "persona_id");

-- CreateIndex
CREATE INDEX "UserInterests_user_id_idx" ON "UserInterests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserInterests_user_id_interest_id_key" ON "UserInterests"("user_id", "interest_id");

-- CreateIndex
CREATE INDEX "UserValues_user_id_idx" ON "UserValues"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserValues_user_id_value_id_key" ON "UserValues"("user_id", "value_id");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_email_idx" ON "EmailVerificationToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_email_token_key" ON "EmailVerificationToken"("email", "token");

-- CreateIndex
CREATE INDEX "Post_community_id_idx" ON "Post"("community_id");

-- CreateIndex
CREATE INDEX "Post_user_id_idx" ON "Post"("user_id");

-- CreateIndex
CREATE INDEX "Post_community_id_user_id_idx" ON "Post"("community_id", "user_id");

-- CreateIndex
CREATE INDEX "PostMedia_post_id_idx" ON "PostMedia"("post_id");

-- CreateIndex
CREATE INDEX "Comments_post_id_user_id_idx" ON "Comments"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "Comments_user_id_idx" ON "Comments"("user_id");

-- CreateIndex
CREATE INDEX "PostVotes_post_id_user_id_idx" ON "PostVotes"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "PostVotes_user_id_idx" ON "PostVotes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostVotes_user_id_post_id_key" ON "PostVotes"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "GroupChat_community_id_idx" ON "GroupChat"("community_id");

-- CreateIndex
CREATE INDEX "GroupChatMembers_group_chat_id_idx" ON "GroupChatMembers"("group_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChatMembers_group_chat_id_user_id_key" ON "GroupChatMembers"("group_chat_id", "user_id");

-- CreateIndex
CREATE INDEX "GroupChatMessages_user_id_group_chat_id_idx" ON "GroupChatMessages"("user_id", "group_chat_id");

-- CreateIndex
CREATE INDEX "GroupChatMessages_group_chat_id_idx" ON "GroupChatMessages"("group_chat_id");

-- CreateIndex
CREATE INDEX "PollOption_poll_id_idx" ON "PollOption"("poll_id");

-- CreateIndex
CREATE INDEX "PollVote_user_id_idx" ON "PollVote"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_user_id_option_id_key" ON "PollVote"("user_id", "option_id");

-- CreateIndex
CREATE UNIQUE INDEX "Personas_persona_name_key" ON "Personas"("persona_name");

-- CreateIndex
CREATE UNIQUE INDEX "Values_value_name_key" ON "Values"("value_name");

-- CreateIndex
CREATE UNIQUE INDEX "Interests_interest_name_key" ON "Interests"("interest_name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityArchetypes_archetype_name_key" ON "EntityArchetypes"("archetype_name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityValues_value_name_key" ON "EntityValues"("value_name");

-- CreateIndex
CREATE UNIQUE INDEX "EntityInterests_interest_name_key" ON "EntityInterests"("interest_name");

-- CreateIndex
CREATE INDEX "FAQ_community_id_user_id_idx" ON "FAQ"("community_id", "user_id");

-- CreateIndex
CREATE INDEX "FAQVotes_faq_id_user_id_idx" ON "FAQVotes"("faq_id", "user_id");

-- CreateIndex
CREATE INDEX "FAQVotes_user_id_idx" ON "FAQVotes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "FAQVotes_user_id_faq_id_key" ON "FAQVotes"("user_id", "faq_id");

-- CreateIndex
CREATE INDEX "FAQResponses_faq_id_parent_response_id_idx" ON "FAQResponses"("faq_id", "parent_response_id");

-- CreateIndex
CREATE INDEX "FAQResponsesVotes_faq_response_id_user_id_idx" ON "FAQResponsesVotes"("faq_response_id", "user_id");

-- CreateIndex
CREATE INDEX "FAQResponsesVotes_user_id_idx" ON "FAQResponsesVotes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "FAQResponsesVotes_user_id_faq_response_id_key" ON "FAQResponsesVotes"("user_id", "faq_response_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vibes_name_key" ON "Vibes"("name");

-- CreateIndex
CREATE INDEX "Vibes_name_idx" ON "Vibes"("name");

-- CreateIndex
CREATE INDEX "EntityCommunityVibes_entity_community_id_idx" ON "EntityCommunityVibes"("entity_community_id");

-- CreateIndex
CREATE INDEX "EntityCommunityVibes_vibe_id_idx" ON "EntityCommunityVibes"("vibe_id");

-- CreateIndex
CREATE INDEX "EntityCommunityVibes_user_id_idx" ON "EntityCommunityVibes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCommunityVibes_entity_community_id_vibe_id_user_id_key" ON "EntityCommunityVibes"("entity_community_id", "vibe_id", "user_id");

-- CreateIndex
CREATE INDEX "EntityUserRole_entity_id_idx" ON "EntityUserRole"("entity_id");

-- CreateIndex
CREATE INDEX "EntityUserRole_user_id_idx" ON "EntityUserRole"("user_id");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_inviter_entity_id_idx" ON "PartnershipInvitation"("inviter_entity_id");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_invitee_entity_id_idx" ON "PartnershipInvitation"("invitee_entity_id");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_invitee_instagram_handle_idx" ON "PartnershipInvitation"("invitee_instagram_handle");

-- CreateIndex
CREATE INDEX "PartnershipInvitation_invitee_email_idx" ON "PartnershipInvitation"("invitee_email");

-- CreateIndex
CREATE INDEX "Partnership_origin_invitation_id_idx" ON "Partnership"("origin_invitation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_entity_a_id_entity_b_id_key" ON "Partnership"("entity_a_id", "entity_b_id");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_origin_invitation_id_key" ON "Partnership"("origin_invitation_id");

-- AddForeignKey
ALTER TABLE "EntityCommunity" ADD CONSTRAINT "EntityCommunity_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunity" ADD CONSTRAINT "EntityCommunity_initiated_by_user_id_fkey" FOREIGN KEY ("initiated_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMembers" ADD CONSTRAINT "EntityCommunityMembers_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityMembers" ADD CONSTRAINT "EntityCommunityMembers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "BusinessTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestClaim" ADD CONSTRAINT "RequestClaim_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestClaim" ADD CONSTRAINT "RequestClaim_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestClaim" ADD CONSTRAINT "RequestClaim_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestClaimMedia" ADD CONSTRAINT "RequestClaimMedia_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "RequestClaim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityInterestsEntries" ADD CONSTRAINT "EntityInterestsEntries_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityInterestsEntries" ADD CONSTRAINT "EntityInterestsEntries_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "EntityInterests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityValuesEntries" ADD CONSTRAINT "EntityValuesEntries_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityValuesEntries" ADD CONSTRAINT "EntityValuesEntries_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "EntityValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityArchetypesEntries" ADD CONSTRAINT "EntityArchetypesEntries_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityArchetypesEntries" ADD CONSTRAINT "EntityArchetypesEntries_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "EntityArchetypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonas" ADD CONSTRAINT "UserPersonas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonas" ADD CONSTRAINT "UserPersonas_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "Personas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterests" ADD CONSTRAINT "UserInterests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterests" ADD CONSTRAINT "UserInterests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "Interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserValues" ADD CONSTRAINT "UserValues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserValues" ADD CONSTRAINT "UserValues_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "Values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVotes" ADD CONSTRAINT "PostVotes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVotes" ADD CONSTRAINT "PostVotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMembers" ADD CONSTRAINT "GroupChatMembers_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMembers" ADD CONSTRAINT "GroupChatMembers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMessages" ADD CONSTRAINT "GroupChatMessages_group_chat_id_fkey" FOREIGN KEY ("group_chat_id") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChatMessages" ADD CONSTRAINT "GroupChatMessages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "EntityCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQVotes" ADD CONSTRAINT "FAQVotes_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQVotes" ADD CONSTRAINT "FAQVotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQResponses" ADD CONSTRAINT "FAQResponses_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "FAQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQResponses" ADD CONSTRAINT "FAQResponses_parent_response_id_fkey" FOREIGN KEY ("parent_response_id") REFERENCES "FAQResponses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQResponses" ADD CONSTRAINT "FAQResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQResponsesVotes" ADD CONSTRAINT "FAQResponsesVotes_faq_response_id_fkey" FOREIGN KEY ("faq_response_id") REFERENCES "FAQResponses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQResponsesVotes" ADD CONSTRAINT "FAQResponsesVotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityVibes" ADD CONSTRAINT "EntityCommunityVibes_entity_community_id_fkey" FOREIGN KEY ("entity_community_id") REFERENCES "EntityCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityVibes" ADD CONSTRAINT "EntityCommunityVibes_vibe_id_fkey" FOREIGN KEY ("vibe_id") REFERENCES "Vibes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCommunityVibes" ADD CONSTRAINT "EntityCommunityVibes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityUserRole" ADD CONSTRAINT "EntityUserRole_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityUserRole" ADD CONSTRAINT "EntityUserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInvitation" ADD CONSTRAINT "PartnershipInvitation_inviter_entity_id_fkey" FOREIGN KEY ("inviter_entity_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInvitation" ADD CONSTRAINT "PartnershipInvitation_invitee_entity_id_fkey" FOREIGN KEY ("invitee_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_entity_a_id_fkey" FOREIGN KEY ("entity_a_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_entity_b_id_fkey" FOREIGN KEY ("entity_b_id") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_origin_invitation_id_fkey" FOREIGN KEY ("origin_invitation_id") REFERENCES "PartnershipInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
