import React from "react";
import PartnershipsPageComponent from "@/features/partnerships/components/partnerships_page";

type PageProps = {
  params: Promise<{ id: string }>; // matches your [id] segment
};
const PartnershipsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <PartnershipsPageComponent entityId={id} />
    </div>
  );
};

export default PartnershipsPage;
