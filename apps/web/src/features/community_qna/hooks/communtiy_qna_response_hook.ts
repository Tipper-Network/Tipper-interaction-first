import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCommunityQNAResponses,
  createCommunityQNAResponse,
  replyToCommunityQNAResponse,
} from "../api/community_qna_response_api";

export const useCommunityQNAResponses = (
  community_id: string,
  communityQNA_id: string
) => {
  return useQuery({
    queryKey: ["community-qna-responses", community_id, communityQNA_id],
    enabled: !!communityQNA_id && !!community_id,
    queryFn: async () => {
      return await fetchCommunityQNAResponses(community_id, communityQNA_id);
    },
    staleTime: 1000,
  });
};

export const useCreateCommunityQNAResponse = (
  communityQNA_id: string,
  community_id: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-qna-responses", community_id, communityQNA_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["community-qnas", community_id],
      });
    },
    mutationFn: async (response: string) => {
      return await createCommunityQNAResponse(
        community_id,
        communityQNA_id,
        response
      );
    },
  });
};

export const useReplyToCommunityQNAResponse = (
  communityQNA_id: string,
  community_id: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-qna-responses", community_id, communityQNA_id],
      });
    },
    mutationFn: async ({
      response_id,
      response,
    }: {
      response_id: string;
      response: string;
    }) => {
      return await replyToCommunityQNAResponse(
        community_id,
        communityQNA_id,
        response_id,
        response
      );
    },
  });
};
