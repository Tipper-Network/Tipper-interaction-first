import {
  CreateEntityCommunityFromInvitationDto,
  FetchCommunitiesOptions,
} from "./type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches a paginated list of communities with optional status filtering.
 *
 * @param options - Pagination and filter options.
 * @returns Parsed JSON response from the backend.
 */
export const fetchCommunities = async ({
  page = 1,
  limit = 10,
  statuses = [],
  filterMode = "exclude",
}: FetchCommunitiesOptions) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  statuses.forEach((status) => {
    queryParams.append("statuses", status);
  });

  if (statuses.length > 0) {
    queryParams.set("filterMode", filterMode);
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/community?${queryParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(
        `Failed to fetch communities: ${res.status} ${errorText}`
      );
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
};

/**
 * Fetches community details by id.
 *
 * @param community_id - Community id.
 * @returns Parsed JSON response from the backend.
 * @throws Rethrows any network/parse errors.
 */
export const fetchCommunityDetails = async (community_id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/community/id/${community_id}`, {
      method: "GET",
      credentials: "include",
    });

    // if (!res.ok) {
    //   throw new Error(`Failed to fetch community. Status: ${res.status}`);
    // }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
};

/**
 * Joins a community as the currently-authenticated user.
 *
 * @param community_id - Community id.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const joinCommunity = async (community_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/community/join_community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ community_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join community: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error joining community:", err);
    throw err;
  }
};

/**
 * Creates a business community.
 *
 * @param dto - Create payload.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const createCommunity = async (
  dto: CreateEntityCommunityFromInvitationDto
) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Failed to create community: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(", ");
        }
      } catch {
        // If parsing fails, use status text
      }
      console.error("Community creation failed:", {
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        payload: dto,
      });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating community:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Network error: ${String(err)}`);
  }
};

/**
 * Fetches a community record by slug and returns the backend response.
 *
 * @param community_slug - Community slug.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const getCommunityIdBySlug = async (community_slug: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/community/${community_slug}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to get community by slug: ${res.statusText}`);
    }

    const data = await res.json();
    return data; //
  } catch (err) {
    console.error("Error fetching community by slug:", err);
    throw err;
  }
};
