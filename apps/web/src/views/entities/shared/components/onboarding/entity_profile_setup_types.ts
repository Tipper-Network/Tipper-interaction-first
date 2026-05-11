import { z } from "zod";
import { EntityType__Enum } from "@tipper/shared";
import type { UpdateEntityPayload } from "@/views/entities/shared/api/types";

const InstagramHandleSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^@[A-Za-z0-9._]{1,30}$/.test(val),
    "Please enter a valid Instagram handle (e.g. @businessname)"
  );

// Schema matches UpdateEntityPayload exactly (except logo_url which is handled separately)
export const UpdateEntityPayloadSchema = z
  .object({
    name: z.string().trim().min(1, "Business name is required").optional(),
    description: z.string().trim().optional(),
    address: z
      .object({
        street: z.string().trim().optional(),
        neighborhood: z.string().trim().optional(),
        city: z.string().trim().optional(),
        country: z.string().trim().optional(),
      })
      .optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Please enter a valid email").optional(),
    instagram_url: InstagramHandleSchema,
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    owner_name: z.string().trim().optional(),
    owner_phone_number: z.string().trim().optional(),
    schedule: z.record(z.string(), z.array(z.string())).optional(),
    entity_type: z.nativeEnum(EntityType__Enum).optional(),
    operates_online: z.boolean().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    // Note: logo_url is NOT included here - it's handled separately via media upload
  })
  .superRefine((data, ctx) => {
    // Early return if not offline business - skip validation
    if (data.operates_online !== false) return;

    // If explicitly set to offline (operates_online=false), ensure we have a pin.
    // For onboarding, this prevents the "click save and nothing happens / backend rejects" experience.
    if (data.latitude == null || data.longitude == null) {
      ctx.addIssue({
        code: "custom",
        message: "Please pin your location on the map (or set Online-only).",
        path: ["latitude"],
      });
    }
  });

// Type inferred from schema - should match UpdateEntityPayload (minus logo_url)
export type EntityProfileFormData = z.infer<typeof UpdateEntityPayloadSchema>;

// Type guard to ensure form data matches API payload
export function formDataToPayload(
  data: EntityProfileFormData
): Omit<UpdateEntityPayload, "logo_url"> {
  return {
    name: data.name,
    description: data.description,
    address: data.address,
    phone: data.phone,
    email: data.email,
    instagram_url: data.instagram_url,
    latitude: data.latitude,
    longitude: data.longitude,
    owner_name: data.owner_name,
    owner_phone_number: data.owner_phone_number,
    schedule: data.schedule,
    entity_type: data.entity_type,
    operates_online: data.operates_online,
    metadata: data.metadata,
  };
}
