import InviteLandingClient from "./invite_landing_client";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function InviteLandingPage({ params }: PageProps) {
  const { token } = await params;
  return <InviteLandingClient token={token} />;
}
