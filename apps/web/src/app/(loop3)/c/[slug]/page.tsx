import CommunityBoardClient from "./community_board_client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CommunityBoardPage({ params }: PageProps) {
  const { slug } = await params;
  return <CommunityBoardClient slug={slug} />;
}
