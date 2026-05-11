import { fetchEntityBySlug } from "@/views/entities/shared/api/entities_api";
import { getEntityPublicPage } from "@/views/entities/shared/utils/entity_component_resolver";
import { EntityType__Enum } from "@tipper/shared";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    "entity-type": string;
    slug: string;
  }>;
};

/**
 * Server component for entity public page in explore section
 * Uses entity component resolver to render the correct entity type page
 */
const EntityPublicPage = async ({ params }: PageProps) => {
  const { "entity-type": entityTypeParam, slug } = await params;

  // Get entity ID by slug
  let entityData;
  try {
    entityData = await fetchEntityBySlug(slug);
    if (!entityData || !entityData.id) {
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch entity by slug:", error);
    notFound();
  }

  const entityId = entityData.id;

  // Determine entity type - use entity data if available, otherwise use URL param
  const normalizedEntityType = entityData?.entity_type
    ? (entityData.entity_type.toUpperCase() as EntityType__Enum)
    : (entityTypeParam?.toUpperCase() as EntityType__Enum) ||
      EntityType__Enum.BUSINESS;

  // Get the appropriate page component for this entity type
  const EntityPage = getEntityPublicPage(normalizedEntityType);

  return <EntityPage entityId={entityId} />;
};

export default EntityPublicPage;
