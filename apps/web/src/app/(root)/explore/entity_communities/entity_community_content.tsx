"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
const CommunityGrid = dynamic(
  () => import("@/features/communities/components/community_grid"),
  { ssr: false }
);

import { useInfiniteCommunities } from "@/features/communities/hooks/community_hooks";
import { EntityCommunityStatus__Enum } from "@/lib/shared/enum_types";
import { useMemo } from "react";

// import { EntityCommunityStatus__Enum } from "@/backend/src/utils/types/entity_community_enums";
const EntityCommunityPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteCommunities({
    statuses: [
      EntityCommunityStatus__Enum.PENDING_APPROVAL,
      EntityCommunityStatus__Enum.REJECTED,
    ],
    filterMode: "exclude",
  });

  // Flatten all pages and deduplicate by id or slug
  const allCommunities = useMemo(() => {
    if (!data?.pages) return [];
    const flattened = data.pages.flatMap((page) => page.items || []);
    // Deduplicate by id (or slug if id is not available)
    const uniqueMap = new Map();
    for (const community of flattened) {
      const key = community.id || community.slug;
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, community);
      }
    }
    return Array.from(uniqueMap.values());
  }, [data?.pages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Loading Local Hub cummunities ...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading Local Hub communities.</p>
      </div>
    );
  }

  {
    /* {allCommunities.length > 0 ? (
        <div className="mb-8 w-full">
          <CommunityGrid communities={allCommunities} />
        </div>
      ) : (
        <div className="text-center py-12 w-full">
          <p className="text-muted-foreground">
            No local hubs and communities found.
          </p>
        </div>
      )} */
  }

  return (
    <div className="w-full flex flex-col justify-center items-start ">
      {data?.pages.map((page, i) => (
        <div key={i} className="mb-8">
          {page.items?.length ? (
            <CommunityGrid communities={page.items} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No local hubs and communities found.
              </p>
            </div>
          )}
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="w-full max-w-md"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : "Load More Local Hub Communities"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntityCommunityPage;
