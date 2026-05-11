import { fetchClaimsOptions } from "./types";
import { RequestClaimStatus__Enum } from "@tipper/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchClaims = async ({
  page = 1,
  limit = 10,
  statuses = [],
  filterMode = "exclude",
}: fetchClaimsOptions) => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  statuses.forEach((status) => {
    queryParams.append("statuses", status);
  });

  if (statuses.length > 0) {
    queryParams.set("filterMode", filterMode);
  }

  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(
    `${API_BASE_URL}/admin-entities/claims?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    let errorMessage = `Failed to fetch claims (${res.status})`;
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
    } else if (res.status === 500) {
      errorMessage = "Server error: Please try again later";
    }

    throw new Error(errorMessage);
  }

  return await res.json();
};

export const changeClaimStatus = async (
  claim_id: string,
  status: RequestClaimStatus__Enum
) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/admin-entities/claim/${claim_id}/status`,
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
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update status");
    }

    return await res.json();
  } catch (error) {
    console.error("Error changing claim status:", error);
    throw error;
  }
};

export const fetchClaimDetails = async (claim_id: string) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/admin-entities/claim/${claim_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch claim details: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching claim details:", error);
    throw error;
  }
};

export const fetchClaimsByEntityID = async (entity_id: string) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/admin-entities/claims/entity/${entity_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch claims by entity ID: ${res.status}`);
    }

    const data = await res.json();
    // Returns an array of claims (empty array if no claims exist)
    return data as {
      id: string;
      user_id: string;
      user?: { id: string; email: string } | null;
    };
  } catch (error) {
    console.error("Error fetching entity claims:", error);
    throw error;
  }
};
