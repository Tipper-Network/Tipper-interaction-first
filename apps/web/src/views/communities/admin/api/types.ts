import { RequestClaimStatus__Enum } from "@tipper/shared";

export type AdminCommunityClaim = {
  id: string;
  claim_status: RequestClaimStatus__Enum;
  created_at: string;
  entity_email: string;
  entity_phone: string;
  instagram_url?: string | null;
  verification_type: string;
  additional_notes?: string | null;
  user: {
    id: string;
    email: string;
    profile?: {
      first_name: string;
      last_name: string;
      avatarUrl: string;
    } | null;
  };
};
