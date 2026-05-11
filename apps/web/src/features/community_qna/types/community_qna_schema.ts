import { z } from "zod";

// Schema for form input (before transform)
export const CreateCommunityQNAFormSchema = z.object({
  question: z.string().min(1, "Question is required").trim(),
  tags: z.string().optional(),
});

// Schema for API payload (after transform)
export const CreateCommunityQNASchema = CreateCommunityQNAFormSchema.transform(
  (data) => ({
    question: data.question,
    tags: data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [],
  })
);

export type CreateCommunityQNAFormData = z.infer<
  typeof CreateCommunityQNAFormSchema
>;
export type CreateCommunityQNAPayload = z.infer<
  typeof CreateCommunityQNASchema
>;
