import { z } from "zod";

export const CommunityQNAResponseSchema = z.object({
  response: z.string().min(1, "Response cannot be empty").trim(),
});

export const CommunityQNAResponseReplySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty").trim(),
});

export type CommunityQNAResponseFormData = z.infer<
  typeof CommunityQNAResponseSchema
>;
export type CommunityQNAResponseReplyFormData = z.infer<
  typeof CommunityQNAResponseReplySchema
>;
