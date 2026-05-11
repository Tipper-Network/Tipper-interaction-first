import type { InitiatorFormData, PendingInvite } from "../types/initiation_types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Creates an initiator invite record and returns a fresh invite token.
 * The token is encoded into a QR → /i/[token].
 *
 * POST /flows/initiation/create
 */
export async function createInitiatorInvite(
  community_id: string,
  form: InitiatorFormData
): Promise<{ token: string; invite_url: string }> {
  const res = await fetch(`${API}/flows/initiation/create`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ community_id, ...form }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create invite");
  return data;
}

/**
 * Returns all pending invites the authenticated member has sent
 * for a given community.
 *
 * GET /flows/initiation/pending?community_id=:id
 */
export async function getPendingInvites(
  community_id: string
): Promise<PendingInvite[]> {
  const res = await fetch(
    `${API}/flows/initiation/pending?community_id=${community_id}`,
    { credentials: "include" }
  );

  const data = await res.json().catch(() => []);
  if (!res.ok) return [];
  return data;
}
