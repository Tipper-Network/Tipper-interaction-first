"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUserInvite } from "../api/share_api";
import { SHARE_TOKEN_KEY, SHARE_TOKEN_STORAGE_KEY } from "../types/share_types";
import { useAuthStore } from "@/features/auth/stores/auth-store";

interface UseConsumeInviteTokenOptions {
  /** Slug of the community the user landed on. Required to link the invite. */
  community_slug: string;
}

/**
 * Handles the full invite token consumption lifecycle:
 *
 * 1. On mount, reads `?shareToken` from URL.
 * 2. Persists it to localStorage (survives auth redirects).
 * 3. Strips the param from the URL.
 * 4. If the user is already authenticated, fires POST /invite immediately.
 *    If not, `PostAuthInviteLinker` picks it up after auth completes.
 *
 * Safe to call even when no token is present — it no-ops cleanly.
 *
 * Usage:
 * ```tsx
 * useConsumeInviteToken({ community_slug: "my-community" });
 * ```
 */
export function useConsumeInviteToken({
  community_slug,
}: UseConsumeInviteTokenOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const hasConsumed = useRef(false);

  const { mutate: linkInvite } = useMutation({
    mutationFn: (token: string) => createUserInvite(token, community_slug),
    onSuccess: () => {
      // Clean up localStorage once linked successfully
      localStorage.removeItem(SHARE_TOKEN_STORAGE_KEY);
    },
    onError: () => {
      // Silent — don't surface invite errors to the user; they land normally
    },
  });

  useEffect(() => {
    if (hasConsumed.current) return;

    const urlToken = searchParams?.get(SHARE_TOKEN_KEY);

    if (urlToken) {
      // Persist to localStorage before stripping from URL
      try {
        localStorage.setItem(SHARE_TOKEN_STORAGE_KEY, urlToken);
      } catch {
        // localStorage unavailable (private browsing) — acceptable degradation
      }

      // Strip shareToken from URL without triggering a navigation
      const params = new URLSearchParams(window.location.search);
      params.delete(SHARE_TOKEN_KEY);
      const newSearch = params.toString();
      router.replace(newSearch ? `?${newSearch}` : window.location.pathname, {
        scroll: false,
      });
    }

    // If authed, consume immediately from URL token or existing localStorage token
    if (user) {
      const tokenToConsume =
        urlToken ??
        (() => {
          try {
            return localStorage.getItem(SHARE_TOKEN_STORAGE_KEY);
          } catch {
            return null;
          }
        })();

      if (tokenToConsume) {
        hasConsumed.current = true;
        linkInvite(tokenToConsume);
      }
    }
  }, [searchParams, user, router, linkInvite]);
}
