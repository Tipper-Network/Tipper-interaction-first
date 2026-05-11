import { z } from "zod";

export const UserProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required").trim(),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  date_of_birth: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof UserProfileSchema>;
