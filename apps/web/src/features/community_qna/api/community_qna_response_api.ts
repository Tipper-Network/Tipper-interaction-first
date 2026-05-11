const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// import { API_BASE_URL } from "../../constants/api_constants";

export const fetchCommunityQNAResponses = async (
  community_id: string,
  communityQNA_id: string,
  page: number = 1,
  limit: number = 50
) => {
  const res = await fetch(
    `${API_BASE_URL}/community-qna/${community_id}/${communityQNA_id}/responses?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) {
    // If it's a 404 or other error, return empty structure instead of throwing
    // This matches the behavior when there are no responses
    return { responses: [], total: 0, page: 1, limit: 10 };
  }
  return await res.json();
};

export const createCommunityQNAResponse = async (
  community_id: string,
  communityQNA_id: string,
  response: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/community-qna/${communityQNA_id}/response`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ community_id, communityQNA_id, response }),
    }
  );
  if (!res.ok) throw new Error("Failed to create community qna response");
  return await res.json();
};

export const replyToCommunityQNAResponse = async (
  community_id: string,
  communityQNA_id: string,
  response_id: string,
  response: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/community-qna/response/${response_id}/reply`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ community_id, response }),
    }
  );
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to reply to community qna response" }));
    throw new Error(
      errorData.message || "Failed to reply to community qna response"
    );
  }
  return await res.json();
};
