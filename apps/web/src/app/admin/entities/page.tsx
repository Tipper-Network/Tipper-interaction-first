"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useInfiniteClaims } from "@/views/entities/admin/hooks/admin_entities_hooks";
import { useRouter } from "next/navigation";

const AdminEntitiesPage = () => {
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
  } = useInfiniteClaims({
    statuses: ["PENDING"],
    filterMode: "include",
  });

  const stats = {
    totalEntities: 100,
    verifiedEntities: 60,
    pendingEntities: 20,
    totalMembers: 5000,
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return (
          <Badge
            variant="default"
            className="bg-tertiary-tint text-tertiary-shade"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="text-primary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "unclaimed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Unclaimed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const entitiesData = data ? data.pages.flatMap((page) => page.claims) : [];

  if (isLoading) {
    return <div>Loading entities...</div>;
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load entities";

    // If it's a 403 error (Forbidden), redirect to landing page with reason
    if (errorMessage.includes("Forbidden") || errorMessage.includes("403")) {
      router.push(
        "/?reason=not_admin&redirect=" +
          encodeURIComponent(window.location.pathname)
      );
      return null;
    }

    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Claims</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {errorMessage}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Entities
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and monitor entity accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-primary text-xs md:text-sm"
          >
            <Clock className="h-3 w-3 mr-1" />
            {stats.pendingEntities} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Total Entities
            </CardTitle>
            <Building2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {stats.totalEntities}
            </div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Verified
            </CardTitle>
            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-tertiary">
              {stats.verifiedEntities}
            </div>
            <p className="text-xs text-muted-foreground">Active entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-primary">
              {stats.pendingEntities}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Total Members
            </CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">
              {stats.totalMembers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all entities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific entities or filter by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entities..."
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Entities Directory</h2>
          <Badge variant="outline">{stats.totalEntities} entities</Badge>
        </div>

        <div className="grid gap-3 md:gap-4">
          {entitiesData.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Entities Claims Found
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are currently no entities claims. New claims will appear
                  here.
                </p>
              </CardContent>
            </Card>
          )}

          {entitiesData.map((entity) => {
            return (
              <Card
                key={entity.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 mb-3 md:flex-row md:items-center md:gap-3">
                        <h3 className="text-base md:text-lg font-semibold">
                          {entity.entity.name || "Unnamed Entity"}
                        </h3>
                        {getStatusBadge(entity.claim_status)}
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs md:text-sm">
                        {/* Placeholder data */}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                          <span>Members info not available</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                          <span>Last active info not available</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2 md:ml-4">
                      {entity.claim_status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full md:w-auto"
                          onClick={() =>
                            // router.push(`/admin/entities/${entity.id}`)
                            router.push(
                              `/admin/entities/${entity.id}?entity_id=${entity.entity_id}`
                            )
                          }
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminEntitiesPage;
