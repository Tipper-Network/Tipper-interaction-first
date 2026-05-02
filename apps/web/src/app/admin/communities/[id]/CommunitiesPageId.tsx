"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import AdminEntityDetailsComponent from "@/features/entities/admin/components/admin_entity_details_component";
import { changeCommunityStatus } from "@/features/communities/admin/api/admin_communities_api";
import { EntityCommunityStatus__Enum } from "@/lib/shared/enum_types";
import AdminCommunityDetailsComponent from "@/features/communities/admin/components/admin_community_page_details";
import AdminCommunityClaims from "@/features/communities/admin/components/admin_community_claims";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BackButton from "@/components/back_button";
import { useCommunityDetails } from "@/features/communities/hooks/community_hooks";
import { StatusBadge } from "@/components/StatusBadge";

const AdminCommunityDetailsPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entity_id = searchParams.get("entity_id");
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: communityData } = useCommunityDetails(id);
  const [status, setStatus] = useState<EntityCommunityStatus__Enum>(
    EntityCommunityStatus__Enum.PENDING_APPROVAL
  );

  // Update status when community data loads
  useEffect(() => {
    if (communityData?.community?.community_status) {
      setStatus(
        communityData.community.community_status as EntityCommunityStatus__Enum
      );
    }
  }, [communityData]);

  const handleApprove = async (community_id: string) => {
    setIsProcessing(true);
    try {
      const response = await changeCommunityStatus(
        community_id,
        EntityCommunityStatus__Enum.UNCLAIMED
      );
      // Redirect back to communities list
      setStatus(response.status as EntityCommunityStatus__Enum);
      router.push("/admin/communities");
    } catch (error) {
      console.error("Error approving community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (community_id: string) => {
    setIsProcessing(true);
    try {
      // Add rejection logic here
      // Redirect back to communities list
      const response = await changeCommunityStatus(
        community_id,
        EntityCommunityStatus__Enum.REJECTED
      );
      setStatus(response.status as EntityCommunityStatus__Enum);
      router.push("/admin/communities");
    } catch (error) {
      console.error("Error rejecting community:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton buttonText="Communities" />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Community Review
            </h1>
            <p className="text-muted-foreground">
              Review community details and make approval decisions
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Review Actions</CardTitle>
          <CardDescription>
            Approve or reject this community submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {status === EntityCommunityStatus__Enum.UNCLAIMED ? (
              <Button
                disabled
                className="bg-tertiary hover:bg-tertiary-shade hover:text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approved
              </Button>
            ) : status === EntityCommunityStatus__Enum.REJECTED ? (
              <Button disabled variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Rejected
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleApprove(id)}
                  disabled={isProcessing}
                  className="bg-tertiary hover:bg-tertiary-shade hover:text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Approve Community"}
                </Button>
                <Button
                  onClick={() => handleReject(id)}
                  disabled={isProcessing}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Reject Community"}
                </Button>
              </>
            )}
            <Button variant="outline" disabled={isProcessing}>
              <FileText className="h-4 w-4 mr-2" />
              Request More Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Community Information
            </CardTitle>
            <CardDescription>Basic details about the community</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminCommunityDetailsComponent community_id={id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Entity Information
            </CardTitle>
            <CardDescription>Associated entity details</CardDescription>
          </CardHeader>
          <CardContent>
            {entity_id ? (
              <AdminEntityDetailsComponent entityId={entity_id} />
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mr-2" />
                No entity information available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Community ID
              </span>
              <span className="font-mono text-sm">{id}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Entity ID</span>
              <span className="font-mono text-sm">{entity_id || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={status} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Submitted</span>
              <span className="text-sm">2 days ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-tertiary" />
              <span className="text-sm">Community name provided</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-tertiary" />
              <span className="text-sm">Description included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-tertiary" />
              <span className="text-sm">Entity linked</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">Verification pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Details
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Contact Owner
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Community Claim Requests</CardTitle>
          <CardDescription>
            Review every claim submitted for this community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCommunityClaims community_id={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommunityDetailsPage;
