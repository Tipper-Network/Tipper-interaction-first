"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInviteToken, getActiveInviteToken } from "../api/share_api";
import type { UserInviteToken } from "../types/share_types";

const INVITE_TOKEN_QUERY_KEY = ["invite-token"] as const;

/**
 * Fetches the active invite token for the authed user.
 * If none exists, exposes a `create` mutation to create one server-side.
 *
 * Usage:
 * ```tsx
 * const { token, isLoading, isError, create } = useInviteToken();
 * ```
 */
export function useInviteToken() {
  const queryClient = useQueryClient();

  const query = useQuery<UserInviteToken | null>({
    queryKey: INVITE_TOKEN_QUERY_KEY,
    queryFn: getActiveInviteToken,
    staleTime: 1000 * 60 * 10, // 10 min — token doesn't change often
    retry: 1,
  });

  const createMutation = useMutation<UserInviteToken>({
    mutationFn: createInviteToken,
    onSuccess: (newToken) => {
      queryClient.setQueryData<UserInviteToken | null>(
        INVITE_TOKEN_QUERY_KEY,
        newToken
      );
    },
  });

  /**
   * Returns the active token if one exists, otherwise creates one.
   * Safe to call on share button click.
   */
  const getOrCreateToken = async (): Promise<UserInviteToken> => {
    const existing = query.data;

    // Re-use if active
    if (existing && existing.is_active) return existing;

    // Create fresh one
    return createMutation.mutateAsync();
  };

  return {
    /** Active token, null if none, undefined while loading */
    token: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    getOrCreateToken,
  };
}
