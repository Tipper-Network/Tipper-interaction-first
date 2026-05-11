"use client";
import React from "react";
import { useCommunityDetails } from "../../hooks/community_hooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

const AdminCommunityDetailsComponent = ({
  community_id,
}: {
  community_id: string;
}) => {
  const { data, isLoading, isError } = useCommunityDetails(community_id);

  console.log("comm id ", community_id);
  console.log("Data ", data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-muted-foreground">Loading community details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to load community data.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <p>No community data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Community Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2 capitalize">
            {data.community_name || "Community Name"}
          </h2>
          <Badge variant="secondary" className="mb-3">
            <Building2 className="h-3 w-3 mr-1" />
            Community
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Description</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.community_description || "No description provided"}
        </p>
      </div>

      <Separator />

      {/* Additional Info */}
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Members:</span>
          <span className="text-sm font-medium">0</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Created:</span>
          <span className="text-sm font-medium">Recently</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Location:</span>
          <span className="text-sm font-medium">Not specified</span>
        </div>
      </div>

      {/* Status */}
      <div className="pt-2">
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          Pending Review
        </Badge>
      </div>
    </div>
  );
};

export default AdminCommunityDetailsComponent;
