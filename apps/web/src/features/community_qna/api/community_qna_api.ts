const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCommunityQNAS = async (
  community_id: string,
  page: number,
  limit: number
) => {
  const res = await fetch(
    `${API_BASE_URL}/community-qna/${community_id}?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  // if (!res.ok) throw new Error("Failed to fetch COMMUNITY_QNA");

  const data = await res.json();
  return data;
};

export const createCommunityQNA = async (
  community_id: string,
  question: string,
  tags: string[]
) => {
  const res = await fetch(`${API_BASE_URL}/community-qna`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      community_id,
      question,
      tags: tags.length > 0 ? tags : [],
    }),
  });
  if (!res.ok) {
    let errorMessage = "Failed to create community qna";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = `Failed to create community qna (${res.status} ${res.statusText})`;
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  return data;
};
