import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchClaimDetails,
  fetchClaims,
  fetchClaimsByEntityID,
} from "../api/admin_entities_api";
const LIMIT = 10;

interface UseInfiniteClaimsOptions {
  statuses?: string[];
  filterMode?: "include" | "exclude";
}

export const useInfiniteClaims = ({
  statuses = [],
  filterMode = "exclude",
}: UseInfiniteClaimsOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["claims", { statuses, filterMode }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchClaims({
        page: pageParam,
        limit: LIMIT,
        statuses,
        filterMode,
      });
    },
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export function useClaimDetails(claim_id: string) {
  return useQuery({
    queryKey: ["claim", claim_id],
    queryFn: () => fetchClaimDetails(claim_id),
    enabled: !!claim_id,
    staleTime: 1000 * 60 * 5,
  });
}

export const useEntityClaimByID = (entity_id: string) => {
  return useQuery({
    queryKey: ["entityClaimByID", entity_id],
    queryFn: () => fetchClaimsByEntityID(entity_id),
    enabled: !!entity_id,
    staleTime: 1000 * 60 * 5,
  });
};
