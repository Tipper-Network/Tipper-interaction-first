import type { UserInvite, UserInviteToken } from "../types/share_types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches the active invite token for the currently-authenticated user.
 * Returns null if the user has no active token.
 *
 * @returns UserInviteToken or null.
 * @throws Error on network failure.
 */
export async function getActiveInviteToken(): Promise<UserInviteToken | null> {
  const res = await fetch(`${API_BASE_URL}/invite/token`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
  }

  const data = await res.json().catch(() => null);
  return data;
}

/**
 * Creates a new invite token for the currently-authenticated user.
 *
 * @returns Newly created UserInviteToken.
 * @throws Error on failure.
 */
export async function createInviteToken(): Promise<UserInviteToken> {
  const res = await fetch(`${API_BASE_URL}/invite/token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create invite token");

  return data;
}

/**
 * Creates a UserInvite record linking the scanned token to the
 * authenticated invitee and the community they landed on.
 *
 * @param token - The raw token string from the URL / localStorage.
 * @param community_slug - Slug of the community the QR code pointed to.
 * @returns Created UserInvite.
 * @throws Error on failure.
 */
export async function createUserInvite(
  token: string,
  community_slug: string
): Promise<UserInvite> {
  const res = await fetch(`${API_BASE_URL}/invite`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, community_slug, source: "QR" }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create user invite");

  return data;
}
