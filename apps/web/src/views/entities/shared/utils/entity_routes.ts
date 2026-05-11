import { EntityType__Enum } from "@tipper/shared";

/**
 * Builds the entity profile URL with entity_type
 * @param entityId - The entity ID
 * @param entityType - The entity type (optional, defaults to BUSINESS)
 * @returns The profile URL path
 */
export function getEntityProfileUrl(
  entityId: string,
  entityType?: EntityType__Enum | string
): string {
  const normalizedType =
    entityType?.toLowerCase() || EntityType__Enum.BUSINESS.toLowerCase();
  return `/entities/${entityId}/${normalizedType}/profile`;
}

/**
 * Builds the entity onboarding URL
 * @param entityId - The entity ID
 * @returns The onboarding URL path
 */
export function getEntityOnboardingUrl(entityId: string): string {
  return `/entities/${entityId}/onboarding`;
}

/**
 * Builds the entity setup identity URL
 * @param entityId - The entity ID
 * @returns The setup identity URL path
 */
export function getEntitySetupIdentityUrl(entityId: string): string {
  return `/entities/${entityId}/setup_identity`;
}

/**
 * Builds the entity claim request URL
 * @param entityId - The entity ID
 * @param communityId - The community ID
 * @returns The claim request URL path with query parameters
 */
export function getEntityClaimRequestUrl(
  entityId: string,
  communityId: string
): string {
  const params = new URLSearchParams({
    community_id: communityId,
    entity_id: entityId,
  });
  return `/entities/claim_request?${params.toString()}`;
}
