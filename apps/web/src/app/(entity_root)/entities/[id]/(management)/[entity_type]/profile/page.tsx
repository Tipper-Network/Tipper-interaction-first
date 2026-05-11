import { EntityProfileClient } from "./entity-profile-client";
import { EntityType__Enum } from "@tipper/shared";
import { notFound } from "next/navigation";
import { fetchEntityDetails } from "@/views/entities/shared/api/entities_api";
type PageProps = {
  params: Promise<{ id: string; entity_type: string }>;
};

/**
 * Server component that handles params and data fetching
 * Fetches entity data on the server and passes it to the client component
 */
const EntityProfilePage = async ({ params }: PageProps) => {
  // Await params on the server
  const { id, entity_type } = await params;
  const entityId = id;

  // Normalize entity_type from URL param
  const urlEntityType =
    (entity_type?.toUpperCase() as EntityType__Enum) ||
    EntityType__Enum.BUSINESS;

  // Fetch entity data on the server
  let finalEntityType = urlEntityType;

  const entity = await fetchEntityDetails(entityId);

  // If entity not found or fetch failed, show 404
  if (!entity) {
    notFound();
  }

  // Use entity_type from entity data if available, otherwise use URL param
  if (entity?.entity_type) {
    finalEntityType = entity.entity_type.toUpperCase() as EntityType__Enum;
  }

  // Pass data to client component for rendering
  return (
    <EntityProfileClient entityId={entityId} entityType={finalEntityType} />
  );
};

export default EntityProfilePage;
