import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchCommunities,
  fetchCommunityDetails,
} from "../api/communities_api";
import { EntityCommunityStatus__Enum } from "@/lib/shared/enum_types";
const LIMIT = 10;

interface UseInfiniteCommunitiesOptions {
  statuses?: EntityCommunityStatus__Enum[];
  filterMode?: "include" | "exclude";
}

export const useInfiniteCommunities = ({
  statuses = [],
  filterMode = "exclude",
}: UseInfiniteCommunitiesOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["communities", { statuses, filterMode }],
    initialPageParam: 1,
    refetchOnMount: true,
    queryFn: async ({ pageParam }) => {
      return await fetchCommunities({
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

export function useCommunityDetails(community_id: string) {
  return useQuery({
    queryKey: ["community", community_id],
    queryFn: () => fetchCommunityDetails(community_id),
    enabled: !!community_id,
    staleTime: 1000 * 60 * 5,
  });
}
