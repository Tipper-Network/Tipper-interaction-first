"use client";

import { use } from "react";
import EntityProfileSetup from "@/views/entities/shared/components/onboarding/entity_profile_setup";

interface Props {
  params: Promise<{ id: string }>;
}

const EntityOnboardingPage = ({ params }: Props) => {
  const { id } = use(params);

  return (
    <>
      <EntityProfileSetup entityId={id} />
    </>
  );
};

export default EntityOnboardingPage;
