import { z } from "zod";
import { isValidE164Phone } from "@/lib/utils/utils";

/**
 * Zod schema for E.164 phone number validation
 * Validates that the phone number is in E.164 format (e.g., +1234567890)
 * This is the standard format required by WhatsApp API and most international services
 */
export const e164PhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (val) => isValidE164Phone(val),
    "Please enter a valid phone number in international format (e.g., +1234567890)"
  );

/**
 * Zod schema for optional E.164 phone number validation
 */
export const optionalE164PhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || isValidE164Phone(val),
    "Please enter a valid phone number in international format (e.g., +1234567890)"
  );
