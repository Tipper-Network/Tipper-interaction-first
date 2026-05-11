import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCommunityQNA,
  fetchCommunityQNAS,
} from "../api/community_qna_api";
const LIMIT = 10;

export const useInfiniteCommunityQNAS = (community_id: string) => {
  return useInfiniteQuery({
    queryKey: ["community-qnas", community_id],
    enabled: !!community_id,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchCommunityQNAS(community_id, pageParam, LIMIT);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useCreateCommunityQNA = (community_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-qnas", community_id],
      });
    },
    mutationFn: async ({
      question,
      tags,
    }: {
      question: string;
      tags: string[];
    }) => {
      return await createCommunityQNA(community_id, question, tags);
    },
  });
};
