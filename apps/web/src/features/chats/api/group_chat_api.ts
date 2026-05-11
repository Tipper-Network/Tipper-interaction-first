const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchGroupChats = async (
  communityId: string,
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${API_BASE_URL}/group-chats/${communityId}?page=${page}&limit=${limit}`
  );

  // if (!res.ok) throw new Error("Failed to fetch group chats");
  return await res.json();
};

export const createGroupChat = async (
  communityId: string,
  groupChatName: string
) => {
  const res = await fetch(`${API_BASE_URL}/group-chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      community_id: communityId,
      group_chat_name: groupChatName,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to create group chat");
  }

  return await res.json();
};
