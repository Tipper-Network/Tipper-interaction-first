"use client";

import React, { useState } from "react";
import { useInfiniteCommunityThoughts } from "../hooks/thoughts_hooks";
import ThoughtItem from "./thought_item";
import ThoughtPreviewCard from "./thought_preview_card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ThoughtCreateButton from "./create_thought_button";

interface ThoughtsTabProps {
  community_id: string;
  hasJoined: boolean;
}

const ThoughtsTab: React.FC<ThoughtsTabProps> = ({
  community_id,
  hasJoined,
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCommunityThoughts(community_id);

  const [selectedThoughtId, setSelectedThoughtId] = useState<string | null>(
    null
  );

  if (isLoading) return <p>Loading thoughts...</p>;
  if (isError) return <p>Failed to load thoughts.</p>;

  // Flatten all thoughts from all pages into a single array
  const allThoughts = data?.pages?.flatMap((page) => page?.items ?? []) ?? [];

  if (allThoughts.length === 0) {
    return (
      <div className="flex justify-between items-center">
        <div className="gap-2 mb-6 ">
          <span className="text-xl font-bold mb-4">Community Thoughts</span>
          {/* <p className="text-muted-foreground w-full">No thoughts found.</p> */}
        </div>
        <div className=" min-w-fit">
          <ThoughtCreateButton
            communityId={community_id}
            disabled={!hasJoined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h3 className="lg:h3-bold text-xl font-bold text-foreground">
          Community Thoughts
        </h3>
        <div className="min-w-fit">
          <ThoughtCreateButton
            communityId={community_id}
            disabled={!hasJoined}
          />
        </div>
      </div>

      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page?.items?.map((thought: any) => (
            <div key={thought.id}>
              {selectedThoughtId === thought.id ? (
                <ThoughtItem
                  thought={thought}
                  onBack={() => setSelectedThoughtId(null)}
                  disabled={!hasJoined}
                />
              ) : (
                <ThoughtPreviewCard
                  thought={thought}
                  onClick={() => setSelectedThoughtId(thought.id)}
                />
              )}
            </div>
          ))}
        </React.Fragment>
      ))}

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
                ? "Loading more thoughts..."
                : "Load More Thoughts"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ThoughtsTab;
