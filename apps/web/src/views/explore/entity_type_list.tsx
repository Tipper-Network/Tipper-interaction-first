"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
const EntityGrid = dynamic(
  () => import("@/views/entities/shared/utils/entity_grid"),
  { ssr: false }
);
import { useInfiniteEntities } from "@/views/entities/shared/hooks/entities_hooks";
import { EntityType__Enum } from "@tipper/shared";

interface EntityTypeListProps {
  entityType: EntityType__Enum;
}

export const EntityTypeList = ({ entityType }: EntityTypeListProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useInfiniteEntities({
    statuses: ["UNCLAIMED"],
    filterMode: "exclude",
    entity_type: entityType,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading spaces...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-destructive">Error loading spaces.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {data?.pages.map((page, i) => (
        <div key={i} className="mb-8">
          {page.items?.length ? (
            <EntityGrid entities={page.items} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No spaces found.</p>
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
            {isFetchingNextPage ? "Loading more..." : "Load More Spaces"}
          </Button>
        </div>
      )}
    </div>
  );
};
