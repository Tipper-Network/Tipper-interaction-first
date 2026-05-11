import { z } from "zod";

export const CreateGroupChatSchema = z.object({
  groupChatName: z.string().min(1, "Group chat name is required").trim(),
});

export type CreateGroupChatFormData = z.infer<typeof CreateGroupChatSchema>;
