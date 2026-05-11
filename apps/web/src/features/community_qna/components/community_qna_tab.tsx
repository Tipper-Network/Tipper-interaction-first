"use client";

import React, { useState, useMemo } from "react";
import { useInfiniteCommunityQNAS } from "../hooks/community_qna_hook";
import CommunityQNAPreviewCard from "./community_qna_preview_card";
import CommunityQNAItem from "./community_qna_item";
import CommunityQNASearchBar from "./community_qna_search_bar";
import CommunityQNAFilters from "./community_qna_filters";
import CreateCommunityQNAButton from "./create_community_qna_button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CommunityQNATabProps {
  community_id: string;
  hasJoined: boolean;
}

const CommunityQNATab: React.FC<CommunityQNATabProps> = ({
  community_id,
  hasJoined,
}) => {
  const [selectedCommunityQNAId, setSelectedCommunityQNAId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<
    "newest" | "most_voted" | "most_answered" | "unanswered"
  >("newest");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCommunityQNAS(community_id);

  // Flatten all CommunityQNAs from all pages
  const allCommunityQNAs =
    data?.pages?.flatMap((page) => page?.community_qnas ?? []) ?? [];

  // Filter and sort CommunityQNAs
  const filteredCommunityQNAs = useMemo(() => {
    let filtered = [...allCommunityQNAs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (communityQNA) =>
          communityQNA.question.toLowerCase().includes(query) ||
          communityQNA.tags?.some((tag: string) =>
            tag.toLowerCase().includes(query)
          )
      );
    }

    // Tag filter
    if (activeTags.length > 0) {
      filtered = filtered.filter((communityQNA) =>
        activeTags.some((tag) => communityQNA.tags?.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "most_voted":
          return (
            b.upvotes_count -
            b.downvotes_count -
            (a.upvotes_count - a.downvotes_count)
          );
        case "most_answered":
          return b.responses_count - a.responses_count;
        case "unanswered":
          return a.responses_count - b.responses_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allCommunityQNAs, searchQuery, activeTags, sortOption]);

  // Extract unique tags from all CommunityQNAs
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    allCommunityQNAs.forEach((communityQNA) => {
      communityQNA.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allCommunityQNAs]);

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading)
    return <p className="text-muted-foreground">Loading CommunityQNAs...</p>;
  if (isError)
    return <p className="text-destructive">Failed to load CommunityQNAs.</p>;

  // If a CommunityQNA is selected, show detail view
  if (selectedCommunityQNAId) {
    const selectedCommunityQNA = allCommunityQNAs.find(
      (communityQNA) => communityQNA.id === selectedCommunityQNAId
    );
    if (selectedCommunityQNA) {
      return (
        <CommunityQNAItem
          communityQNA={selectedCommunityQNA}
          community_id={community_id}
          onBack={() => setSelectedCommunityQNAId(null)}
          disabled={!hasJoined}
        />
      );
    }
  }
  console.log("filteredCommunityQNAs", filteredCommunityQNAs);
  return (
    <div className="w-full">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="lg:h3-bold text-xl font-bold text-foreground">
          Community CommunityQNAs
        </h3>
        <div className="min-w-fit">
          <CreateCommunityQNAButton
            communityId={community_id}
            disabled={!hasJoined}
          />
        </div>
      </div>

      {/* Search Bar */}
      {/* <CommunityQNASearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={handleClearSearch}
      /> */}

      {/* Filters */}
      {/* <CommunityQNAFilters
        activeTags={activeTags}
        availableTags={availableTags}
        sortOption={sortOption}
        onTagToggle={handleTagToggle}
        onSortChange={setSortOption}
      /> */}

      {/* CommunityQNAs List */}
      {filteredCommunityQNAs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery || activeTags.length > 0
              ? "No CommunityQNAs match your filters."
              : "No CommunityQNAs yet. Be the first to ask a question!"}
          </p>
          {!searchQuery && activeTags.length === 0 && hasJoined && (
            <CreateCommunityQNAButton communityId={community_id} />
          )}
        </div>
      ) : (
        <>
          {filteredCommunityQNAs.map((communityQNA: any) => {
            return (
              <CommunityQNAPreviewCard
                key={communityQNA.id}
                communityQNA={communityQNA}
                onClick={() => setSelectedCommunityQNAId(communityQNA.id)}
              />
            );
          })}

          {/* Load More */}
          {hasNextPage && (
            <div className="text-center mt-6">
              <Card className="p-4 bg-gray-50 border-dashed hover:bg-gray-100 transition-colors cursor-pointer">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="w-full text-secondary font-medium disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading more CommunityQNAs..."
                    : "Load More CommunityQNAs"}
                </Button>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommunityQNATab;
