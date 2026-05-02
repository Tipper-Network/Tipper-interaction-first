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
import AdminClaimDetailsComponent from "@/features/entities/admin/components/admin_claims_details_component";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { changeClaimStatus } from "@/features/entities/admin/api/admin_entities_api";
import { RequestClaimStatus__Enum } from "@/lib/shared/enum_types";

const AdminEntityDetailsPage = ({ id }: { id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entity_id = searchParams.get("entity_id");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (claim_id: string) => {
    setIsProcessing(true);
    try {
      await changeClaimStatus(claim_id, RequestClaimStatus__Enum.APPROVED);
      router.push("/admin/entities");
    } catch (error) {
      console.error("Error approving entity claim:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (claim_id: string) => {
    setIsProcessing(true);
    try {
      await changeClaimStatus(claim_id, RequestClaimStatus__Enum.DENIED);

      router.push("/admin/entities");
    } catch (error) {
      console.error("Error rejecting entity claim:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/communities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Entity Claims
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Entity Claim Review
            </h1>
            <p className="text-muted-foreground">
              Review Claim details and make approval decisions
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-primary">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Actions</CardTitle>
          <CardDescription>
            Approve or reject this Entity Claim submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handleApprove(id)}
              disabled={isProcessing}
              className="bg-tertiary hover:bg-tertiary-shade hover:text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Approve community claim"}
            </Button>
            <Button
              onClick={() => handleReject(id)}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Reject community claim"}
            </Button>
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
              Claim Information
            </CardTitle>
            <CardDescription>details about the claim</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminClaimDetailsComponent claim_id={id} />
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
              <Badge variant="secondary">Pending</Badge>
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
    </div>
  );
};

export default AdminEntityDetailsPage;
