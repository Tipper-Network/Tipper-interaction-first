import React from "react";
import BusinessPageId from "./EntitiesPageId";

type PageProps = { params: Promise<{ id: string }> };
const page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <BusinessPageId id={id} />
    </div>
  );
};

export default page;
