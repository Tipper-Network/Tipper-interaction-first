import React from "react";
import CommunitiesPageId from "./CommunitiesPageId";
type PageProps = { params: Promise<{ id: string }> };
const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <CommunitiesPageId id={id} />
    </div>
  );
};

export default page;
