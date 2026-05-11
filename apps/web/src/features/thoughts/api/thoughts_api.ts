const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches paginated thoughts for a community.
 *
 * @param community_id - Community id.
 * @param page - Page number (1-based).
 * @param limit - Page size.
 * @returns Parsed JSON response from the backend.
 */
export const fetchCommunityThoughts = async (
  community_id: string,
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${API_BASE_URL}/thoughts/${community_id}?page=${page}&limit=${limit}`
  );
  return await res.json();
};

/**
 * Fetches paginated comments for a thought.
 *
 * @param thought_id - Thought id.
 * @param page - Page number (1-based).
 * @param limit - Page size.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const fetchThoughtComments = async (
  thought_id: string,
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${API_BASE_URL}/thoughts/thought_comments/${thought_id}?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch thought comments");
  return await res.json();
};

/**
 * Creates a thought, optionally including media uploads.
 *
 * Uses `multipart/form-data` (via `FormData`) when files are provided.
 *
 * @param params - Thought creation input.
 * @param params.community_id - Community id.
 * @param params.description - Thought text content.
 * @param params.files - Optional file attachments.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const createThought = async ({
  community_id,
  description,
  files,
}: {
  community_id: string;
  description: string;
  files?: File[];
}) => {
  const formData = new FormData();
  formData.append("community_id", community_id);
  formData.append("description", description);

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await fetch(`${API_BASE_URL}/thoughts`, {
    method: "POST",
    credentials: "include",
    // DO NOT set 'Content-Type' header manually here
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create thought");
  }

  return await res.json();
};

/**
 * Creates a comment on a thought.
 *
 * @param thoughtId - Thought id.
 * @param content - Comment content.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const createThoughtComment = async ({
  thoughtId,
  content,
}: {
  thoughtId: string;
  content: string;
}) => {
  const res = await fetch(
    `${API_BASE_URL}/thoughts/${thoughtId}/thought_comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create thought comment");
  }

  return await res.json();
};

/**
 * Fetches media for a thought.
 *
 * @param thoughtId - Thought id.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the request fails.
 */
export const fetchThoughtMedia = async (thoughtId: string) => {
  const res = await fetch(`${API_BASE_URL}/thoughts/${thoughtId}/media`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to fetch thought media");
  }

  return await res.json();
};
