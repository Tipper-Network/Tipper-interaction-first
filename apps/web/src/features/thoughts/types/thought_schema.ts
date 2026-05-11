import { z } from "zod";

export const CreateThoughtSchema = z
  .object({
    description: z.string().optional(),
    files: z
      .custom<File[]>((val) => {
        return Array.isArray(val);
      })
      .optional(),
  })
  .refine(
    (data) => {
      const hasDescription = data.description?.trim().length > 0;
      const hasFiles = data.files && data.files.length > 0;
      return hasDescription || hasFiles;
    },
    {
      message: "Please add a description or upload at least one file.",
      path: ["description"], // Show error on description field
    }
  );

export type CreateThoughtFormData = z.infer<typeof CreateThoughtSchema>;
