"use client";

import { useInfiniteCommunities } from "@/views/communities/hooks/community_hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Clock,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { EntityCommunityStatus__Enum } from "@tipper/shared";

const AdminCommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteCommunities({
    statuses: [EntityCommunityStatus__Enum.PENDING_APPROVAL],
    filterMode: "include",
  });

  // Calculate total pending communities
  const totalPending =
    data?.pages.reduce((total, page) => total + (page.items?.length || 0), 0) ||
    0;
  const communitiesData = data?.pages.flatMap((page) => page.items || []) || [];

  const getStatusBadge = (status: EntityCommunityStatus__Enum) => {
    switch (status) {
      case EntityCommunityStatus__Enum.CLAIMED:
        return (
          <Badge
            variant="default"
            className="bg-tertiary-tint text-tertiary-shade"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case EntityCommunityStatus__Enum.UNCLAIMED:
        return (
          <Badge variant="secondary" className="text-primary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-muted-foreground">Loading communities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error loading communities. Please try again.";

    // If it's a 403 error (Forbidden), redirect to landing page with reason
    if (errorMessage.includes("Forbidden") || errorMessage.includes("403")) {
      router.push(
        "/?reason=not_admin&redirect=" +
          encodeURIComponent(window.location.pathname)
      );
      return null;
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Communities
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {errorMessage}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Communities
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and review community submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-primary text-xs md:text-sm"
          >
            <Clock className="h-3 w-3 mr-1" />
            {totalPending} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-primary">
              {totalPending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Total Communities
            </CardTitle>
            <Building2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {communitiesData.length}
            </div>
            <p className="text-xs text-muted-foreground">In review queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Approval Rate
            </CardTitle>
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-tertiary">
              85%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific communities or filter by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pending Communities</h2>
          <Badge variant="outline">{totalPending} items</Badge>
        </div>

        <div className="grid gap-3 md:gap-4">
          {communitiesData.map((community) => (
            <Card
              key={community.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 mb-3 md:flex-row md:items-center md:gap-3">
                      <h3 className="text-base md:text-lg font-semibold capitalize">
                        {community.community_name || "Unnamed Community"}
                      </h3>
                      {getStatusBadge(
                        community.business_community_status || "UNCLAIMED"
                      )}
                    </div>

                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">
                          {community.industry_type || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">
                          {community.city || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">Created recently</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Users className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">0 members</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium">
                          Description
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {community.community_description ||
                          "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2 md:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                      asChild
                    >
                      <Link
                        href={`/admin/communities/${community.id}?entity_id=${community.entity_id}`}
                      >
                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Review
                      </Link>
                    </Button>

                    {/* {(community.business_community_status === "UNCLAIMED" ||
                      !community.business_community_status) && (
                      <Button size="sm" className="w-full md:w-auto" 
                      onClick={() => handleApprove(community.id)}
                      >
                        Approve
                      </Button>
                    )} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {communitiesData.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Communities Found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are currently no communities pending verification. New
                submissions will appear here for review.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="w-full max-w-md"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading more...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Load More Communities
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommunityPage;
