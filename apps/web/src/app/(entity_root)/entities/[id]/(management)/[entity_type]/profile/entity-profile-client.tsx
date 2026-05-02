"use client";

import { getEntityAdminPage } from "@/features/entities/shared/utils/entity_component_resolver";
import { EntityType__Enum } from "@/lib/shared/enum_types";

interface EntityProfileClientProps {
  entityId: string;
  entityType: EntityType__Enum;
}

/**
 * Client component that renders the appropriate entity page based on entity type
 * This component handles the client-side rendering logic
 */
export function EntityProfileClient({
  entityId,
  entityType,
}: EntityProfileClientProps) {
  // Get the appropriate page component for this entity type
  const EntityPage = getEntityAdminPage(entityType);

  return <EntityPage entityId={entityId} />;
}
