import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createGroupChat, fetchGroupChats } from "../api/group_chat_api";

const LIMIT = 10;

export const useInfiniteGroupChats = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["group_chats", communityId],
    enabled: !!communityId, // only run if communityId exists
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await fetchGroupChats(communityId, pageParam, LIMIT);
    },
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useCreateGroupChat = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupChatName }: { groupChatName: string }) =>
      createGroupChat(communityId, groupChatName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group_chats", communityId],
      });
    },
  });
};
