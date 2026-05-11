export enum TipperRole__Enum {
  NPC = "NPC",
  NOOB = "NOOB",
  EXPLORER = "EXPLORER",
  INITIATE = "INITIATE",
  APPRENTICE = "APPRENTICE",
  SQUIRE = "SQUIRE",
  TIPPER = "TIPPER",
  AGENT = "AGENT",
  PROTAGONIST = "PROTAGONIST",
  ADMIN = "ADMIN",
  GAME_CHANGER = "GAME_CHANGER",
  THE_GAME_CHANGER = "THE_GAME_CHANGER",
}

export enum Role__Enum {
  USER = "USER",
  VERIFIED = "VERIFIED",
  ADMIN = "ADMIN",
}

// ======================== NOTE THE  DIFFERENT TYPES OF PEOPLE ON TIPPER ========================
// the people that are building Tipper centric careers ( like content creators , influencers, entrepreneurs,etc..)
// the people who are buinding their careers on Tipper
// the people who are using Tipper to build their careers



//  ==============================================Partnership Invitation
export enum PartnershipInvitationSource__Enum {
  OUTBOUND_INVITE = "OUTBOUND_INVITE",
  INBOUND_REQUEST = "INBOUND_REQUEST",
}

export enum PartnershipInvitationStatus__Enum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  NOT_FOUND = "NOT_FOUND",
}

export enum PartnershipInvitationIntent__Enum {
  // 1. Acquisition & Network Growth
  ONBOARD_BUSINESS = "ONBOARD_BUSINESS", // “You should be on Tipper”
  NETWORK_CREDIBILITY = "NETWORK_CREDIBILITY", // “Your presence strengthens us”
  ECOSYSTEM_DEPENDENCY = "ECOSYSTEM_DEPENDENCY", // “This only works if you’re in”
  SHARED_VALUES = "SHARED_VALUES", // “You belong to this culture”

  // 2. Collaboration & Value Creation
  FORM_PARTNERSHIP = "FORM_PARTNERSHIP", // “Let’s formalize something”
  CO_CREATE = "CO_CREATE", // “Let’s build together”
  COLLAB_INTEREST = "COLLAB_INTEREST", // “Let’s explore ideas”
  SERVICE_COMPLEMENT = "SERVICE_COMPLEMENT", // “You complete my offering”

  // 3. Distribution & Growth
  AUDIENCE_EXCHANGE = "AUDIENCE_EXCHANGE", // “Our customers overlap”
  CROSS_PROMOTION = "CROSS_PROMOTION", // “Let’s amplify each other”
  MARKET_EXPANSION = "MARKET_EXPANSION", // “This helps us grow geographically”

  // 4. Operations & Reality
  COMMUNITY_BUILDING = "COMMUNITY_BUILDING", // “Let’s grow a community together”
  SUPPLIER_RELATION = "SUPPLIER_RELATION", // “We work together operationally”

  RESOURCE_ACCESS = "RESOURCE_ACCESS", // “We need access to what you control”
  ENDORSEMENT = "ENDORSEMENT", // “Your support validates this”

  OTHER = "OTHER",
}

export enum PartnershipStatus__Enum {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  ENDED = "ENDED",
}

export enum VerificationType__Enum {
  IN_PERSON = "IN_PERSON",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  DOCUMENT = "DOCUMENT",
}

export enum VoteSegment__Enum {
  POST = "POST",
  COMMUNITY_QNA = "COMMUNITY_QNA",
  COMMUNITY_QNA_RESPONSE = "COMMUNITY_QNA_RESPONSE",
  POST_COMMENT = "POST_COMMENT",
  POST_MEDIA = "POST_MEDIA",
  GROUP_CHAT = "GROUP_CHAT",
  GROUP_CHAT_MESSAGE = "GROUP_CHAT_MESSAGE",
  TAG = "TAG",
  THOUGHT = "THOUGHT",
  THOUGHT_MEDIA = "THOUGHT_MEDIA",
  THOUGHT_COMMENT = "THOUGHT_COMMENT",
}

export enum VoteType__Enum {
  UP = "UP",
  DOWN = "DOWN",
  NEUTRAL = "NEUTRAL",
  HELPFUL = "HELPFUL",
  NOT_HELPFUL = "NOT_HELPFUL",
}

export enum EntityCommunityStatus__Enum {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  UNCLAIMED = "UNCLAIMED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  CLAIMED = "CLAIMED",
  REJECTED = "REJECTED",
}

export enum EntityStatus__Enum {
  UNCLAIMED = "UNCLAIMED",
  CLAIMED = "CLAIMED",
  FULLY_SETUP = "FULLY_SETUP",
}

export enum RequestClaimStatus__Enum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
}
