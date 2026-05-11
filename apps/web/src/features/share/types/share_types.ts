export type UserInviteToken = {
  id: string;
  token: string;
  is_active: boolean;
  created_at: string;
};

export enum UserInviteStatus_Enum {
  PENDING = "PENDING",
  REGISTERED = "REGISTERED",
  JOINED = "JOINED",
}

enum UserInviteSource_Enum {
  QR = "QR",
  EMAIL = "EMAIL",
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
  TELEGRAM = "TELEGRAM",
  OTHER = "OTHER",
}

export type UserInvite = {
  id: string;
  token_id: string;
  invited_user_id: string;
  root_inviter_user_id: string;
  status: UserInviteStatus_Enum;
  source: UserInviteSource_Enum;
  scanned_at: string | null;
  created_at: string;
  entity_community_invite?: EntityCommunityInvite | null;
};

export type EntityCommunityInvite = {
  id: string;
  invite_id: string;
  inviter_membership_id: string;
};

export const SHARE_TOKEN_KEY = "shareToken" as const;
export const SHARE_TOKEN_STORAGE_KEY = "tipper_share_token" as const;
