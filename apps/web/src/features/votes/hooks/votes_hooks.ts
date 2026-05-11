import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castVote } from "../api/votes_api";

export const useCastVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
    mutationFn: castVote,
  });
};
