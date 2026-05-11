"use client";

import { useConsumeInviteToken } from "../hooks/use_consume_invite_token";

interface QRCodeLandingHandlerProps {
  /**
   * Slug of the community the user landed on.
   * Used to associate the invite with the correct community.
   */
  community_slug: string;
}

/**
 * Mount this once on the community page.
 *
 * On mount it:
 *  1. Reads `?shareToken` from the URL.
 *  2. Persists the token to localStorage.
 *  3. Strips the param from the URL.
 *  4. If the user is authenticated, fires POST /invite immediately.
 *     If not authenticated, `PostAuthInviteLinker` handles it after sign-in.
 *
 * Renders nothing — pure side-effect component.
 */
export default function QRCodeLandingHandler({
  community_slug,
}: QRCodeLandingHandlerProps) {
  useConsumeInviteToken({ community_slug });
  return null;
}
