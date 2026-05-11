import { fetchEntitiesOptions } from "./types";
import { SubmitClaimInput } from "./types";
import { RequestClaimStatus__Enum } from "@tipper/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface createEntityIdentity {
  interests: { interest_id: string }[];
  archetypes: { archetype_id: string }[]; // Backend expects "archetypes" with "archetype_id"
  values: { value_id: string }[];
}

/**
 * Fetches a paginated list of entities, optionally filtered by status and entity type.
 *
 * @param options - Pagination and filter options.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the base URL is missing, the request fails, or a network error occurs.
 */
export const fetchEntities = async ({
  page = 1,
  limit = 10,
  statuses = [],
  filterMode = "exclude",
  entity_type,
}: fetchEntitiesOptions) => {
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

  if (entity_type) {
    queryParams.set("entity_type", entity_type);
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/entities?${queryParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`Failed to fetch entities: ${res.status} ${errorText}`);
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
 * Fetches entity details by entity id.
 *
 * @param entity_id - Entity id.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails or a network error occurs.
 */
export const fetchEntityDetails = async (entity_id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/entities/id/${entity_id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`Failed to fetch entity: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
};

/**
 * Submits a claim request for an entity/community (multipart form with optional media).
 *
 * @param input - Claim request payload.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const submitClaimRequest = async (input: SubmitClaimInput) => {
  const {
    entity_type,
    entity_id,
    community_id,
    entity_email,
    entity_phone,
    instagram_url,
    verification_type,

    additional_notes = "",
    claim_status = RequestClaimStatus__Enum.PENDING,
    // user_entity_position, // OWNER, MANAGER, STAFF
    mediaFiles,
    mediaTypes,
  } = input;

  const formData = new FormData();

  formData.append("entity_id", entity_id);
  formData.append("community_id", community_id);
  formData.append("entity_email", entity_email);
  formData.append("entity_phone", entity_phone);
  formData.append("entity_type", entity_type);
  if (instagram_url) {
    formData.append("instagram_url", instagram_url);
  }
  formData.append("verification_type", verification_type);
  formData.append("claim_status", claim_status);
  formData.append("additional_notes", additional_notes);
  // formData.append("user_entity_position", user_entity_position);

  mediaTypes.forEach((type, i) => {
    formData.append(`mediaTypes[${i}][type]`, type.type);
  });

  mediaFiles.forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch(`${API_BASE_URL}/entities/claim_request`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to submit claim: ${res.status} ${errText}`);
  }

  return await res.json();
};

/**
 * Fetches entities associated with the current user.
 *
 * Returns an empty array on unauthorized/not-found or network errors.
 *
 * @returns Array payload (or empty array on soft-fail).
 * @throws Error if base URL is missing.
 */
export const getUserEntities = async () => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/entities/user_entities`, {
      credentials: "include",
    });

    if (!res.ok) {
      // If user not found or unauthorized, return empty array (not an error)
      if (res.status === 401 || res.status === 404) {
        return [];
      }
      const errorText = await res.text().catch(() => res.statusText);
      console.error(
        `Failed to fetch user entities: ${res.status} ${errorText}`
      );
      return [];
    }

    const data = await res.json();
    // Ensure we always return an array, even if backend returns null/undefined
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching user entities:", err);
    // Return empty array on network errors too - user just has no entities
    return [];
  }
};

/**
 * Fetches claim records associated with the current user.
 *
 * Returns an empty array on unauthorized/not-found or network errors.
 *
 * @returns Array payload (or empty array on soft-fail).
 * @throws Error if base URL is missing.
 */
export const getUserEntityClaims = async () => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/entities/user_claims`, {
      credentials: "include",
    });

    if (!res.ok) {
      // If user not found or unauthorized, return empty array (not an error)
      if (res.status === 401 || res.status === 404) {
        return [];
      }
      const errorText = await res.text().catch(() => res.statusText);
      console.error(`Failed to fetch user claims: ${res.status} ${errorText}`);
      return [];
    }

    const data = await res.json();
    // Ensure we always return an array, even if backend returns null/undefined
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching user claims:", err);
    // Return empty array on network errors too - user just has no claims
    return [];
  }
};

/**
 * Creates/updates an entity identity (interests/archetypes/values).
 *
 * @param entityId - Entity id.
 * @param data - Identity payload.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const createEntityIdentity = async (
  entityId: string,
  data: createEntityIdentity
) => {
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/create_identity`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("API Error:", error);
    throw new Error(error.message || "Failed to create entity identity");
  }

  const result = await res.json();
  return result;
};

/**
 * Checks whether an entity exists by Instagram handle.
 *
 * @param handle - Raw handle string (may include `@`).
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails or a network error occurs.
 */
export const checkEntityByInstagramHandle = async (handle: string) => {
  try {
    const normalizedHandle = encodeURIComponent(handle.trim().replace("@", ""));
    const res = await fetch(
      `${API_BASE_URL}/entities/check/instagram/${normalizedHandle}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`Failed to check entity: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Network error: ${String(err)}`);
  }
};

/**
 * Server-side fetch for entity details by slug.
 *
 * Used by the welcome page to fetch entity data without caching.
 *
 * @param slug - Entity slug.
 * @returns Parsed JSON response, or `null` if not found (404).
 * @throws Error for non-404 HTTP failures or network errors.
 */
export async function fetchEntityBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/entities/${slug}`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`Failed to fetch entity: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}
