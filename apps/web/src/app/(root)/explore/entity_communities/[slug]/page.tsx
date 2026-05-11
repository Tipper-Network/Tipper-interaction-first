import CommunityPageMain from "@/views/communities/components/community_details_page/community_page_main";
import { getCommunityIdBySlug } from "@/views/communities/api/communities_api";
import ShareButton from "@/features/share/components/share_button";

type PageProps = {
  params: Promise<{ slug: string }>; // m atches your [id] segment
};

const CommunityDetailPage = async ({ params }: PageProps) => {
  const getParams = await params;
  const communitySlug = getParams.slug;
  const { id: communityId } = await getCommunityIdBySlug(communitySlug);

  return (
    <div className="min-h-screen bg-background ">
      <CommunityPageMain communityId={communityId || ""} />
    </div>
  );
};

export default CommunityDetailPage;
