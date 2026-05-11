import ClaimRequestComponent from "@/views/entities/shared/components/claim_request/claim_request_component";

interface Props {
  searchParams: Promise<{ community_id?: string; entity_id?: string }>;
}

const ClaimRequestPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const community_id = params.community_id?.trim();
  const entity_id = params.entity_id?.trim();

  if (!community_id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Missing Community ID
          </h1>
          <p className="text-muted-foreground">
            Please access this page through a valid business listing.
          </p>
        </div>    
      </div>
    );
  }

  if (!entity_id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Missing Entity ID
          </h1>
          <p className="text-muted-foreground">
            Please access this page through a valid business listing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClaimRequestComponent entity_id={entity_id} community_id={community_id} />
  );
};

export default ClaimRequestPage;
