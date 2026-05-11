import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCommunityThoughts,
  fetchThoughtComments,
  fetchThoughtMedia,
  createThought,
  createThoughtComment,
} from "../api/thoughts_api";

const LIMIT = 10;

export const useInfiniteCommunityThoughts = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["community-thoughts", communityId],
    enabled: !!communityId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchCommunityThoughts(communityId, pageParam, LIMIT);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useInfiniteThoughtsComments = (thoughtId: string) => {
  return useInfiniteQuery({
    queryKey: ["thought-comments", thoughtId],
    enabled: !!thoughtId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchThoughtComments(thoughtId, pageParam, LIMIT);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useThoughtMedia = (thoughtId: string) => {
  return useQuery({
    queryKey: ["thought-media", thoughtId],
    enabled: !!thoughtId,
    queryFn: () => fetchThoughtMedia(thoughtId),
  });
};

// Mutation hook for creating thoughts
export const useCreateThought = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThought,
    onSuccess: () => {
      // Invalidate and refetch thoughts for this community
      queryClient.invalidateQueries({
        queryKey: ["community-thoughts", communityId],
      });
    },
  });
};

// Mutation hook for creating comments
export const useCreateThoughtComment = (thoughtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      createThoughtComment({ thoughtId, content }),
    onSuccess: () => {
      // Invalidate and refetch comments for this thought
      queryClient.invalidateQueries({
        queryKey: ["thought-comments", thoughtId],
      });
    },
  });
};
