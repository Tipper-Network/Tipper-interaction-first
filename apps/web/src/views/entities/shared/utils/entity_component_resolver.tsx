import { EntityType__Enum } from "@tipper/shared";
import { ComponentType } from "react";

// Import entity type-specific page components
import BusinessPage from "@/views/entities/entity_types/businesses/components/BusinessPage";
import AdminBusinessPage from "@/views/entities/admin/entity_types/admin_business_page";

// Define component interface
export interface EntityPageProps {
  entityId: string;
}

function normalizeEntityType(
  entityType: EntityType__Enum | string
): EntityType__Enum {
  return typeof entityType === "string"
    ? (entityType.toUpperCase() as EntityType__Enum)
    : entityType;
}

// Component registry - maps entity types to their page components
type EntityPageRegistry = {
  [key in EntityType__Enum]?: ComponentType<EntityPageProps>;
};

/**
 * Public pages (slug-based explore).
 * These should remain read-optimized and safe for public traffic.
 */
const publicEntityPages: EntityPageRegistry = {
  [EntityType__Enum.BUSINESS]: BusinessPage,
  // Add other entity types as they're implemented:
  // [EntityType__Enum.PERSONAL_BRAND]: PersonalBrandPage,
  // [EntityType__Enum.OTHER]: OtherEntityPage,
};

/**
 * Admin pages (id-based management).
 * These can include edit controls and admin-only affordances.
 */
const adminEntityPages: EntityPageRegistry = {
  // TODO: swap to BusinessAdminPage once implemented
  [EntityType__Enum.BUSINESS]: AdminBusinessPage,
};

function getFromRegistry(
  registry: EntityPageRegistry,
  entityType: EntityType__Enum | string
): ComponentType<EntityPageProps> {
  const normalizedType = normalizeEntityType(entityType);
  const EntityPage = registry[normalizedType];
  if (EntityPage) return EntityPage;
  return registry[EntityType__Enum.BUSINESS]!;
}

export function getEntityPublicPage(
  entityType: EntityType__Enum | string
): ComponentType<EntityPageProps> {
  return getFromRegistry(publicEntityPages, entityType);
}

export function getEntityAdminPage(
  entityType: EntityType__Enum | string
): ComponentType<EntityPageProps> {
  return getFromRegistry(adminEntityPages, entityType);
}

/**
 * Backwards-compatible alias.
 * Prefer `getEntityPublicPage` for explore and `getEntityAdminPage` for management/admin.
 */
export const getEntityPage = getEntityPublicPage;

/**
 * Checks if a specific entity type has custom page implemented
 */
export function hasEntityTypePage(
  entityType: EntityType__Enum | string
): boolean {
  const normalizedType = normalizeEntityType(entityType);
  return !!publicEntityPages[normalizedType];
}
