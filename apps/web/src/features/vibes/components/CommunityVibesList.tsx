"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, X, Plus, Sparkles } from "lucide-react";
import {
  useCommunityVibes,
  useUserVibes,
  useRemoveVibeFromCommunity,
} from "../hooks/vibes_hooks";
import VibesModal from "./VibesModal";

interface CommunityVibesListProps {
  communityId: string;
  showAddButton?: boolean;
  className?: string;
}

export function CommunityVibesList({
  communityId,
  showAddButton = true,
  className = "",
}: CommunityVibesListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: communityVibesData, isLoading } =
    useCommunityVibes(communityId);
  const { data: userVibes } = useUserVibes(communityId);
  const removeVibeMutation = useRemoveVibeFromCommunity(communityId);

  // Create a set of vibe IDs that the user has added
  const userVibeIds = new Set(userVibes?.map((uv) => uv.vibe.id) || []);

  const vibes = useMemo(() => {
    if (!communityVibesData?.vibes) return [];
    return communityVibesData.vibes.map((item: any) => ({
      id: item.vibe?.id ?? Math.random(),
      vibe_name: item.vibe?.name ?? "Unknown",
      vibe_category: item.vibe?.category ?? "Uncategorized",
      user_count: item.user_count || 0,
    }));
  }, [communityVibesData]);

  const handleRemoveVibe = async (vibeId: string) => {
    try {
      await removeVibeMutation.mutateAsync(vibeId);
    } catch (error) {
      console.error("Error removing vibe:", error);
    }
  };

  const handleVibesAdded = () => {
    // Refetch will happen automatically via React Query invalidation
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Community Vibes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 bg-muted rounded-full w-20"></div>
              <div className="h-8 bg-muted rounded-full w-24"></div>
              <div className="h-8 bg-muted rounded-full w-16"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVoters = communityVibesData?.total_voters || 0;

  return (
    <div
      className={`bg-background border border-border rounded-2xl p-6 shadow-sm pt-10 ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="h3-bold text-foreground">Vibes</h3>
          {totalVoters > 0 && (
            <p className="text-sm text-muted-foreground">
              {totalVoters} {totalVoters === 1 ? "user" : "users"} voted
            </p>
          )}
        </div>
        {showAddButton && (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="ghost"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {vibes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from(new Set(vibes.map((v: any) => v.vibe_category))).map(
            (category) => (
              <div key={category} className="border-border border-b pb-4">
                <h4 className="p-medium-14 text-muted-foreground mb-3 uppercase tracking-wide">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vibes
                    .filter((v) => v.vibe_category === category)
                    .map((vibe) => {
                      const isUserVibe = userVibeIds.has(vibe.id);
                      return (
                        <div
                          key={vibe.id}
                          className="group flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-full hover:bg-muted/50 transition-colors"
                        >
                          <Sparkles className="h-3 w-3 text-muted-foreground" />
                          <span className="p-medium-14 text-foreground text-wrap max-w-[200px]">
                            {vibe.vibe_name}
                          </span>
                          {vibe.user_count > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({vibe.user_count})
                            </span>
                          )}
                          {isUserVibe && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveVibe(vibe.id);
                              }}
                              disabled={removeVibeMutation.isPending}
                              className="h-5 w-5 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="p-medium-16 text-muted-foreground mb-2">
            No vibes added yet
          </p>
          <p className="p-regular-14 text-muted-foreground mb-4">
            Add vibes to help others understand the community atmosphere
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors p-medium-14"
          >
            Add Your First Vibe
          </Button>
        </div>
      )}

      {/* Vibes Modal */}
      <VibesModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        communityId={communityId}
        existingVibes={userVibes?.map((uv) => ({
          id: uv.vibe.id,
          vibe_name: uv.vibe.name,
          vibe_category: uv.vibe.category || undefined,
        }))}
        onVibesAdded={handleVibesAdded}
      />
    </div>
  );
}
