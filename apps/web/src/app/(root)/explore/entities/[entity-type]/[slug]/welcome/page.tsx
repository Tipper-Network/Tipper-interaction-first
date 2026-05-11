import { notFound } from "next/navigation";
import EntityWelcomePage from "@/views/welcome/components/entity_welcome_page";
import { fetchEntityBySlug } from "@/views/entities/shared/api/entities_api";

type PageProps = {
  params: Promise<{
    "entity-type": string;
    slug: string;
  }>;
};

/**
 * Welcome page for entities - accessed via QR code scan
 * Displays a link tree-style page with links to different entity sections
 */
const WelcomePage = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Get entity data by slug
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

  return <EntityWelcomePage entity={entityData} />;
};

export default WelcomePage;
