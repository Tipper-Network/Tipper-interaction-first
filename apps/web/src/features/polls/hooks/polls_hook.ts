import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createPoll, fetchCommunityPolls } from "../api/poll_api";

const LIMIT = 10;

export const useInfiniteCommunityPolls = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["community-polls", communityId],
    enabled: !!communityId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchCommunityPolls(communityId, pageParam, LIMIT);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useCreatePoll = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-polls", communityId],
      });
    },
    mutationFn: createPoll,
  });
};
