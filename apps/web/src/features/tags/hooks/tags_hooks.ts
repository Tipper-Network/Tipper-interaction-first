import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminFetchSuggestedTags,
  adminUpdateTagStatus,
  fetchTags,
  suggestTag,
} from "../api/tags_api";
import { TagStatus__Enum, TagType__Enum } from "@/lib/shared/enums/tags_enums";

export function useTags(input?: {
  status?: TagStatus__Enum;
  type?: TagType__Enum;
  q?: string;
}) {
  return useQuery({
    queryKey: ["tags", input ?? {}],
    queryFn: () => fetchTags(input),
    staleTime: 1000,
  });
}

export function useSuggestTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suggestTag,
    onSuccess: () => {
      // active tags list might not include suggested, but still safe to invalidate
      qc.invalidateQueries({ queryKey: ["tags"] });
      qc.invalidateQueries({ queryKey: ["admin-tags"] });
    },
  });
}

export function useAdminSuggestedTags() {
  return useQuery({
    queryKey: ["admin-tags"],
    queryFn: adminFetchSuggestedTags,
    staleTime: 1000 * 10,
  });
}

export function useAdminUpdateTagStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminUpdateTagStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tags"] });
      qc.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
