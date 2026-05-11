import { TagStatus__Enum, TagType__Enum } from "@tipper/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type TagRecord = {
  id: string;
  slug: string;
  label: string;
  type: TagType__Enum;
  status: TagStatus__Enum;
};

export async function fetchTags(input?: {
  status?: TagStatus__Enum;
  type?: TagType__Enum;
  q?: string;
}): Promise<TagRecord[]> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const params = new URLSearchParams();
  if (input?.status) params.set("status", input.status);
  if (input?.type) params.set("type", input.type);
  if (input?.q) params.set("q", input.q);

  const res = await fetch(`${API_BASE_URL}/tags?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch tags: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? (data as TagRecord[]) : [];
}

export async function suggestTag(input: {
  label: string;
  type?: TagType__Enum;
}): Promise<TagRecord> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const res = await fetch(`${API_BASE_URL}/tags/suggest`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to suggest tag: ${res.status} ${errText}`);
  }
  return (await res.json()) as TagRecord;
}

export async function adminFetchSuggestedTags(): Promise<TagRecord[]> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const res = await fetch(`${API_BASE_URL}/admin-tags`, {
    credentials: "include",
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch suggested tags: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? (data as TagRecord[]) : [];
}

export async function adminUpdateTagStatus(input: {
  tagId: string;
  status: TagStatus__Enum;
}): Promise<TagRecord> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const res = await fetch(`${API_BASE_URL}/admin-tags/${input.tagId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: input.status }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update tag status: ${res.status} ${errText}`);
  }
  return (await res.json()) as TagRecord;
}
