import { EntityType__Enum } from "@tipper/shared";

export const ENTITY_TYPE_LABELS: Partial<Record<EntityType__Enum, string>> = {
  [EntityType__Enum.BUSINESS]: "Business Spaces",

  // [EntityType__Enum.ACADEMIC_INSTITUTION]: "Academic Institution Spaces",
  // [EntityType__Enum.PROFESSIONAL_ASSOCIATION]: "Professional Association Spaces",
  // [EntityType__Enum.NON_GOVERNMENTAL_ORGANIZATION]: "NGO Spaces",
  // [EntityType__Enum.SOCIAL_ORGANIZATION]: "Social Organization Spaces",
  // [EntityType__Enum.CIVIC_ORGANIZATION]: "Civic Organization Spaces",
  // [EntityType__Enum.PERSONAL_BRAND]: "Creator Spaces",
  // [EntityType__Enum.GROUP]: "Group Spaces",
  // [EntityType__Enum.GUILD]: "Guild Spaces",
  [EntityType__Enum.OTHER]: "Other Spaces",
};

// Get all entity types that are NOT in ENTITY_TYPE_LABELS (excluding OTHER itself)
// This will be used to populate the "Other Spaces" tab
export const OTHER_ENTITY_TYPES = Object.values(EntityType__Enum).filter(
  (type) => !ENTITY_TYPE_LABELS[type] && type !== EntityType__Enum.OTHER
) as EntityType__Enum[];

export const ACTIVE_ENTITY_TYPES = Object.values(EntityType__Enum).filter(
  (type) => ENTITY_TYPE_LABELS[type]
) as EntityType__Enum[];

// Helper function to format entity type name for display
const formatEntityTypeName = (entityType: string): string => {
  return entityType
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to get entity type display name
export const getEntityTypeDisplayName = (entityType: string): string => {
  const typeMap: Record<string, string> = {
    BUSINESS: "Businesses",
    SOCIAL_ORGANIZATION: "Social Organizations",
    NON_GOVERNMENTAL_ORGANIZATION: "Non-Governmental Organizations",
    CIVIC_ORGANIZATION: "Civic Organizations",
    GUILD: "Guilds",
    PERSONAL_BRAND: "Personal Brands",
    PROFESSIONAL_ASSOCIATION: "Professional Associations",
    GROUP: "Groups",
    ACADEMIC_INSTITUTION: "Academic Institutions",
    OTHER: "Other",
  };
  return typeMap[entityType] || formatEntityTypeName(entityType);
};
