"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";
import { useUserEntities } from "@/views/entities/shared/hooks/entities_hooks";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { getEntityOnboardingUrl } from "@/views/entities/shared/utils/entity_routes";
import { EntityStatus__Enum } from "@tipper/shared";

interface EntityOnboardingRedirectProps {
  entityId: string;
}

/**
 * Component that redirects users to onboarding if:
 * 1. User has a role in the entity (approved claim)
 * 2. Entity status is CLAIMED (profile setup not done)
 * 3. User is not already on the onboarding page
 *
 * Note: Identity setup (archetypes/values/interests) uses banner, not redirect
 */
export default function EntityOnboardingRedirect({
  entityId,
}: EntityOnboardingRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { data: entity, refetch } = useEntityDetails(entityId);
  const { data: userEntities } = useUserEntities();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect if user is logged in
    if (!user || !entity || !userEntities) return;

    // Prevent multiple redirects
    if (hasRedirected.current) return;

    // Check if user has a role in this entity (meaning their claim was approved)
    const userHasRole = userEntities.some(
      (userEntity) => userEntity.entity.id === entityId
    );

    if (!userHasRole) return;

    // Only redirect if profile setup is incomplete (CLAIMED status)
    // Identity setup (archetypes/values/interests) will use banner, not redirect
    if (entity.entity_status !== EntityStatus__Enum.CLAIMED) return;

    // Don't redirect if already on onboarding or setup pages
    if (
      pathname?.includes("/onboarding") ||
      pathname?.includes("/setup_identity")
    )
      return;

    // Don't redirect if user is on profile management pages (they might be updating the profile)
    if (pathname?.includes("/profile") && !pathname?.includes("/onboarding"))
      return;

    // Refetch entity data to ensure we have the latest status before redirecting
    refetch().then((result) => {
      const freshEntity = result.data;
      if (freshEntity?.entity_status === EntityStatus__Enum.CLAIMED) {
        hasRedirected.current = true;
        router.push(getEntityOnboardingUrl(entityId));
      }
    });
  }, [user, entity, userEntities, entityId, pathname, router, refetch]);

  // Reset redirect flag when entity status changes or pathname changes significantly
  useEffect(() => {
    if (entity?.entity_status !== EntityStatus__Enum.CLAIMED) {
      hasRedirected.current = false;
    }
  }, [entity?.entity_status]);

  return null;
}
