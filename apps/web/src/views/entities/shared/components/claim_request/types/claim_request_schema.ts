import { z } from "zod";
import {
  EntityUserPositionType__Enum,
  VerificationType__Enum,
  EntityType__Enum,
} from "@tipper/shared";
import { e164PhoneSchema } from "@/lib/validations/phone";

// Instagram handle regex - accepts @handle or handle format
const INSTAGRAM_HANDLE_REGEX = /^@?[A-Za-z0-9._]{1,30}$/;

export const ClaimRequestFormSchema = z.object({
  entity_type: z.enum(Object.values(EntityType__Enum), {
    message: "Entity type is required",
  }),
  entity_email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  entity_phone: e164PhoneSchema,
  instagram_url: z
    .string()
    .trim()
    .min(1, "Instagram handle is required")
    .refine(
      (val) => INSTAGRAM_HANDLE_REGEX.test(val),
      "Please enter a valid Instagram handle (e.g. @businessname or businessname)"
    ),
  verification_type: z.enum(Object.values(VerificationType__Enum), {
    message: "Verification method is required",
  }),
  // user_entity_position: z.enum(Object.values(EntityUserPositionType__Enum), {
  //   message: "Your position is required",
  // }),
  additional_notes: z.string().optional(),
});

export type ClaimRequestFormData = z.infer<typeof ClaimRequestFormSchema>;
