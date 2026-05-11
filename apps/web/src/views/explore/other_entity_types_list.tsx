"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useQueries } from "@tanstack/react-query";
import { fetchEntities } from "@/views/entities/shared/api/entities_api";
import { EntityType__Enum } from "@tipper/shared";
// import OthersEntityGrid from "../entities/shared/utils/others_entity_grid";
const OthersEntityGrid = dynamic(
  () => import("@/views/entities/shared/utils/others_entity_grid"),
  { ssr: false }
);

const LIMIT = 10;

export const OtherEntityTypesList = ({
  otherEntityTypes,
}: {
  otherEntityTypes: EntityType__Enum[];
}) => {
  // Fetch all "other" entity types in parallel
  const queries = useQueries({
    queries: otherEntityTypes.map((entityType) => ({
      queryKey: [
        "entities",
        {
          statuses: ["UNCLAIMED"],
          filterMode: "exclude",
          entity_type: entityType,
        },
      ],
      queryFn: async () => {
        return await fetchEntities({
          page: 1,
          limit: LIMIT,
          statuses: ["UNCLAIMED"],
          filterMode: "exclude",
          entity_type: entityType,
        });
      },
      staleTime: 1000 * 30, // 30 seconds
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const allData = queries.map((query) => query.data).filter(Boolean);

  // Combine all entities from different types into a single array
  const allEntities = allData.flatMap((page) => page?.items ?? []);

  // Deduplicate entities by id to prevent showing the same entity twice
  const uniqueEntities = Array.from(
    new Map(allEntities.map((entity) => [entity.id, entity])).values()
  );

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
      {uniqueEntities.length > 0 ? (
        <OthersEntityGrid entities={uniqueEntities} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No spaces found.</p>
        </div>
      )}
    </div>
  );
};
