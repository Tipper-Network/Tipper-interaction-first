import {
  EntityType__Enum,
  // EntityUserPositionType__Enum,
  VerificationType__Enum,
} from "@tipper/shared";
import { RequestClaimStatus__Enum } from "@tipper/shared";
import { MediaType__Enum } from "@tipper/shared";

export interface fetchEntitiesOptions {
  page?: number;
  limit?: number;
  statuses?: string[];
  filterMode?: "include" | "exclude";
  entity_type?: string;
}

export interface SubmitClaimInput {
  entity_type: EntityType__Enum;
  entity_id: string;
  community_id: string;
  entity_email: string;
  entity_phone: string;
  instagram_url?: string;
  verification_type: VerificationType__Enum;
  additional_notes?: string;
  claim_status?: RequestClaimStatus__Enum; // default to PENDING
  // user_entity_position: EntityUserPositionType__Enum; // OWNER, MANAGER, STAFF
  mediaFiles: File[];
  mediaTypes: { type: MediaType__Enum }[]; // IMAGE, VIDEO, AUDIO, DOCUMENT, OTHER
}

export interface UpdateEntityPayload {
  name?: string;
  description?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  instagram_url?: string;
  logo_url?: string;
  latitude?: number;
  longitude?: number;
  owner_name?: string;
  owner_phone_number?: string;
  schedule?: Record<string, string[]>;
  entity_type?: EntityType__Enum;
  operates_online?: boolean;
  metadata?: Record<string, any>;
}
