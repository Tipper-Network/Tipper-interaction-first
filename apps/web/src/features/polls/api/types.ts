type Poll = {
  id: string;
  description: string;
  created_at: string;
  // other fields as necessary
};

type PollsResponse = {
  items: Poll[];
  page: number;
  total: number;
  limit: number;
};
