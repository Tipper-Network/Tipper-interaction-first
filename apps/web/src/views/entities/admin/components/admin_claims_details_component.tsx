"use client";

import Image from "next/image";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useClaimDetails } from "../hooks/admin_entities_hooks";
import Link from "next/link";
import InstagramUrlLink from "@/components/button_external_links/InstagramUrlLink";

interface ClaimPageDetailsProps {
  claim_id: string;
}

const AdminClaimDetailsComponent = ({ claim_id }: ClaimPageDetailsProps) => {
  const { data: claim, isLoading, isError } = useClaimDetails(claim_id);
  if (isLoading) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading claim details...
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="p-6 text-destructive">
        Failed to load claim details. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Email
          </p>
          <p className="text-base text-foreground">
            {claim.entity_email || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Phone
          </p>
          <p className="text-base text-foreground">
            {claim.entity_phone || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Instagram URL
          </p>
          {claim.instagram_url ? (
            <InstagramUrlLink instagram_url={claim.instagram_url} />
          ) : (
            <p className="text-base text-foreground">N/A</p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Additional Notes
          </p>
          <p className="text-base text-foreground">
            {claim.additional_notes || "None"}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Claim ID
          </p>
          <p className="text-sm font-mono text-foreground">{claim.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Community ID
          </p>
          <p className="text-sm font-mono text-foreground">
            {claim.community_id}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity ID
          </p>
          <p className="text-sm font-mono text-foreground">{claim.entity_id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            User ID
          </p>
          <p className="text-sm font-mono text-foreground">{claim.user_id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Status
          </p>
          <p className="text-sm text-foreground capitalize">
            {claim.claim_status}
          </p>
        </div>
      </div>

      {claim.urls && claim.urls.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-3">Claim Media</h2>
            <div className="flex flex-wrap gap-4">
              {claim.urls.map((url: string, index: number) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Claim media ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminClaimDetailsComponent;
