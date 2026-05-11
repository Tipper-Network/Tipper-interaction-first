"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createUserInvite } from "../api/share_api";
import { SHARE_TOKEN_STORAGE_KEY } from "../types/share_types";

interface PostAuthInviteLinkerProps {
  /**
   * Slug of the community the user is on.
   * Used to associate the invite with the correct community when fired post-auth.
   */
  community_slug: string;
}

/**
 * Mount this alongside `QRCodeLandingHandler` on the community page.
 *
 * Handles the deferred case: user scanned the QR while unauthenticated,
 * completed sign-up, and is now back on the community page.
 *
 * On auth confirmation it:
 *  1. Reads the token from localStorage.
 *  2. Fires POST /invite once.
 *  3. Clears the token from localStorage on success.
 *
 * Renders nothing — pure side-effect component.
 */
export default function PostAuthInviteLinker({
  community_slug,
}: PostAuthInviteLinkerProps) {
  const { user } = useAuthStore();
  const hasFired = useRef(false);

  const { mutate: linkInvite } = useMutation({
    mutationFn: (token: string) => createUserInvite(token, community_slug),
    onSuccess: () => {
      try {
        localStorage.removeItem(SHARE_TOKEN_STORAGE_KEY);
      } catch {
        // ignore
      }
    },
    onError: () => {
      // Silent — invite link failure must never block the community page UX
    },
  });

  useEffect(() => {
    // Only run once per mount, and only when user is authenticated
    if (!user || hasFired.current) return;

    let token: string | null = null;
    try {
      token = localStorage.getItem(SHARE_TOKEN_STORAGE_KEY);
    } catch {
      // localStorage unavailable — acceptable degradation
    }

    if (!token) return;

    hasFired.current = true;
    linkInvite(token);
  }, [user, linkInvite]);

  return null;
}
