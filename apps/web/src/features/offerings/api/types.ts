import { MediaType__Enum } from "@tipper/shared";
import {
  OfferingFormat__Enum,
  OfferingStatus__Enum,
  OfferingType__Enum,
} from "@tipper/shared";

export type OfferingMedia = {
  id: string;
  key: string;
  type: MediaType__Enum;
  url?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Offering = {
  id: string;
  entity_id: string;
  offeringType: OfferingType__Enum;
  label: string;
  description?: string | null;
  format: OfferingFormat__Enum;
  status: OfferingStatus__Enum;
  isSearchable: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  offeringMedia: OfferingMedia[];
};

export type CreateOfferingInput = {
  offeringType: OfferingType__Enum;
  label: string;
  description?: string;
  /**
   * Backend currently requires `format`.
   * For "media-first" flows, you can just send `"PDF"` and let media drive the UI.
   */
  format: OfferingFormat__Enum;
  status?: OfferingStatus__Enum;
  isSearchable?: boolean;
  isPublic?: boolean;
};

export type UpdateOfferingInput = Partial<CreateOfferingInput>;
