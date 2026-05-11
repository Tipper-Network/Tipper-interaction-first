import { z } from "zod";

export const CreateThoughtCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").trim(),
});

export type CreateThoughtCommentFormData = z.infer<
  typeof CreateThoughtCommentSchema
>;
