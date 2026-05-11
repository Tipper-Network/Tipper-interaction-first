import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchEntities,
  fetchEntityDetails,
  getUserEntityClaims,
  getUserEntities,
} from "../api/entities_api";
import { EntityType__Enum } from "@tipper/shared";

const LIMIT = 10;

interface UseInfiniteEntitiesOptions {
  statuses?: string[];
  filterMode?: "include" | "exclude";
  entity_type?: EntityType__Enum;
}

export const useInfiniteEntities = ({
  statuses = [],
  filterMode = "exclude",
  entity_type,
}: UseInfiniteEntitiesOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["entities", { statuses, filterMode, entity_type }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchEntities({
        page: pageParam,
        limit: LIMIT,
        statuses,
        filterMode,
        entity_type,
      });
    },
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export function useEntityDetails(
  entityId: string,
  staleTime: number = 1000 * 60 * 5
) {
  return useQuery({
    queryKey: ["entity", entityId],
    queryFn: () => fetchEntityDetails(entityId),
    enabled: !!entityId,
    staleTime: staleTime,
  });
}

export const useUserEntityClaims = () => {
  return useQuery({
    queryKey: ["user-claims"],
    queryFn: getUserEntityClaims,
    // Query will still run but getUserEntityClaims handles unauthenticated users gracefully
    retry: false,
  });
};

export const useUserEntities = () => {
  return useQuery({
    queryKey: ["user-entities"],
    queryFn: getUserEntities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
