import { EntityCommunityStatus__Enum } from "@tipper/shared";
export interface CreateEntityCommunityFromInvitationDto {
  name: string;
  description?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  entityEmail: string; // Backend expects entityEmail, not businessEmail
  entityPhoneNumber?: string; // Backend expects entityPhoneNumber, not businessPhoneNumber
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  instagram_url?: string;
  invitationId?: string;
  operates_online?: boolean;
}

export interface FetchCommunitiesOptions {
  page?: number;
  limit?: number;
  statuses?: EntityCommunityStatus__Enum[];
  filterMode?: "include" | "exclude";
}
