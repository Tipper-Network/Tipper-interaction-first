import SpaceCheckinClient from "./space_checkin_client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SpaceCheckinPage({ params }: PageProps) {
  const { slug } = await params;
  return <SpaceCheckinClient slug={slug} />;
}
