const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCommunityPolls = async (
  community_id: string,
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${API_BASE_URL}/polls/${community_id}?page=${page}&limit=${limit}`
  );

  const data = await res.json();

  return data;
};

export const fetchPollOptions = async (poll_id: string) => {
  const res = await fetch(`${API_BASE_URL}/polls/poll_options/${poll_id}`);
  if (!res.ok) throw new Error("Failed to fetch poll options");
  return await res.json();
};

export const createPoll = async ({
  community_id,
  poll_title,
  description,
  poll_options,
}: {
  poll_title: string;
  community_id: string;
  description: string;
  poll_options: string[];
}) => {
  const res = await fetch(`${API_BASE_URL}/polls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      community_id,
      poll_title,
      description,
      poll_options,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create poll");
  }

  return await res.json();
};

export async function submitVote(pollId: string, optionId: string) {
  const res = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ option_id: optionId }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to submit vote");
  }

  return await res.json();
}
