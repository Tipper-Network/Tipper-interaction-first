import {
  Vibe,
  CommunityVibesResponse,
  UserVibe,
  AddVibeToCommunityDto,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all available vibes (for selection)
export const fetchAllVibes = async (category?: string): Promise<Vibe[]> => {
  const url = category
    ? `${API_BASE_URL}/community/vibes?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/community/vibes`;
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vibes");
  }

  return await res.json();
};

// Get vibes grouped by category (returns array format like interests)
export interface VibeCategory {
  vibe_category: string;
  vibes: { id: string; vibe_name: string; vibe_description?: string }[];
}

export const fetchVibesByCategory = async (): Promise<VibeCategory[]> => {
  const res = await fetch(`${API_BASE_URL}/community/vibes/by-category`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vibes by category");
  }

  return await res.json();
};

// Get a specific vibe by ID
export const fetchVibeById = async (vibeId: string): Promise<Vibe> => {
  const res = await fetch(`${API_BASE_URL}/community/vibes/${vibeId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vibe");
  }

  return await res.json();
};

// Add a new vibe to the Vibes table (admin/global)
// Note: This uses the POST /community/vibes endpoint if it exists
// Otherwise, vibes are created automatically when adding to a community
export const createVibe = async (vibeName: string): Promise<Vibe> => {
  const res = await fetch(`${API_BASE_URL}/community/vibes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ vibe_name: vibeName }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create vibe");
  }

  return await res.json();
};

// Get all vibes for a community with counts
export const fetchCommunityVibes = async (
  communityId: string
): Promise<CommunityVibesResponse> => {
  const res = await fetch(`${API_BASE_URL}/community/${communityId}/vibes`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch community vibes");
  }

  return await res.json();
};

// Add a vibe to a community (either by vibe_id or vibe_name)
// If vibe_name is provided, it will create a new vibe (suggested by user)
// category is optional and only used when creating a new vibe
export const addVibeToCommunity = async (
  communityId: string,
  data: AddVibeToCommunityDto
) => {
  const res = await fetch(`${API_BASE_URL}/community/${communityId}/vibes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to add vibe to community");
  }

  return await res.json();
};

// Remove a vibe from a community
export const removeVibeFromCommunity = async (
  communityId: string,
  vibeId: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/community/${communityId}/vibes/${vibeId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to remove vibe from community");
  }

  return await res.json();
};

// Get user's vibes for a specific community
export const fetchUserVibes = async (
  communityId: string
): Promise<UserVibe[]> => {
  const res = await fetch(
    `${API_BASE_URL}/community/${communityId}/vibes/user`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user vibes");
  }

  return await res.json();
};
