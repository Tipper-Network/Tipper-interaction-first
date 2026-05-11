"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCommunityClaims } from "../../admin/api/admin_communities_api";
import { AdminCommunityClaim } from "../api/types";
import { AlertCircle, Mail, Phone } from "lucide-react";

interface AdminCommunityClaimsProps {
  community_id: string;
}

const statusBadgeVariant: Record<
  AdminCommunityClaim["claim_status"],
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  DENIED: "destructive",
};

export default function AdminCommunityClaims({
  community_id,
}: AdminCommunityClaimsProps) {
  const [claims, setClaims] = useState<AdminCommunityClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCommunityClaims(community_id);
        setClaims(res.claims || []);
      } catch (err: any) {
        setError(err.message || "Failed to load claims");
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [community_id]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No claims have been submitted for this community yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => {
        const claimantName =
          claim.user.profile?.first_name || claim.user.profile?.last_name
            ? `${claim.user.profile?.first_name ?? ""} ${
                claim.user.profile?.last_name ?? ""
              }`.trim()
            : claim.user.email;

        return (
          <div
            key={claim.id}
            className="border border-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{claimantName}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted {new Date(claim.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant={statusBadgeVariant[claim.claim_status]}>
                {claim.claim_status}
              </Badge>
            </div>

            <div className="text-sm space-y-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {claim.entity_email}
              </div>
              {claim.entity_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  {claim.entity_phone}
                </div>
              )}
              {claim.instagram_url && (
                <p>
                  Instagram:{" "}
                  <span className="text-primary">{claim.instagram_url}</span>
                </p>
              )}
              {claim.additional_notes && <p>Notes: {claim.additional_notes}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
