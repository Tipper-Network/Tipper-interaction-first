import React from "react";
import InvitationOnboardingPage from "./InvitationOnboardingPage";

type PageProps = { params: Promise<{ invitation_id: string }> };

const InvitationIdPage = async ({ params }: PageProps) => {
  const { invitation_id } = await params;
  return (
    <div>
      <InvitationOnboardingPage invitationId={invitation_id} />
    </div>
  );
};

export default InvitationIdPage;
