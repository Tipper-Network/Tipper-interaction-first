import { EntityCommunityStatus__Enum } from "@/lib/shared/enum_types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const changeCommunityStatus = async (
  community_id: string,
  status: EntityCommunityStatus__Enum
) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/admin-community/${community_id}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      let errorMessage = `Failed to update community status (${res.status})`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }

      // Provide more specific error messages
      if (res.status === 401) {
        errorMessage = "Unauthorized: Please log in to access this page";
      } else if (res.status === 403) {
        errorMessage = "Forbidden: Admin access required";
      } else if (res.status === 404) {
        errorMessage = "Community not found";
      } else if (res.status === 500) {
        errorMessage = "Server error: Please try again later";
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    console.error("Error changing community status:", error);
    throw error;
  }
};

export const fetchCommunityClaims = async (community_id: string) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(
    `${API_BASE_URL}/admin-community/${community_id}/claims`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch community claims");
  }

  return res.json();
};
