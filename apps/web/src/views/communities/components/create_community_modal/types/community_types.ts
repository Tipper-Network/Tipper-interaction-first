import { z } from "zod";
import { optionalE164PhoneSchema } from "@/lib/validations/phone";

const INSTAGRAM_HANDLE_REGEX = /^@[A-Za-z0-9._]{1,30}$/;

export const UserInitiateCommunityForEntitySchema = z
  .object({
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    street: z.string().optional(),
    operates_online: z.boolean(),

    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number().optional(),
        altitude: z.number().optional(),
        altitudeAccuracy: z.number().optional(),
        timestamp: z.number().optional(),
      })
      .optional(),

    entityName: z.string().min(1, "Entity name is required"),
    description: z
      .string()
      .min(20, "Please provide a longer  description of at least 20 charecters")
      .max(
        1000,
        "Please provide a shorter description of maximum 1000 charecters"
      ),

    entityEmail: z.string().email("Please enter a valid email address"),
    entityPhoneNumber: optionalE164PhoneSchema,
    instagram_url: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || INSTAGRAM_HANDLE_REGEX.test(val),
        "Please enter a valid Instagram handle (e.g. @handlename)"
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.operates_online) {
      // City is required when not operating online
      if (!data.city || data.city.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "City is required",
          path: ["city"],
        });
      }
      if (!data.coordinates) {
        ctx.addIssue({
          code: "custom",
          message: "Please pick your location on the map",
          path: ["coordinates"],
        });
        return;
      }
      if (data.coordinates.latitude === 0 || data.coordinates.longitude === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please pick your location on the map",
          path: ["coordinates"],
        });
      }
    }
  });

export type UserInitiateCommunityForEntity = z.infer<
  typeof UserInitiateCommunityForEntitySchema
>;
