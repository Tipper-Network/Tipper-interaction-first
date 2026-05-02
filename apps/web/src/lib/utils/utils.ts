import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-aware `className` concatenation helper.
 *
 * Combines `clsx` + `tailwind-merge` to dedupe conflicting Tailwind classes.
 *
 * @param inputs - Any number of class values (strings/arrays/objects).
 * @returns A merged className string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the user's local IANA timezone (e.g. `America/New_York`).
 */
export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Normalizes a nullable string or string array into a de-duplicated string array.
 *
 * @param value - A single string, a string array, or null/undefined.
 * @returns A string array (possibly empty). If a string is provided, it will be split by commas/whitespace.
 */
export const ensureArray = (
  value: string | string[] | null | undefined
): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return parseDelimitedString(value);
};

/**
 * Splits a string (or recursively flattens an array of strings) into a de-duplicated list.
 *
 * Splits on commas and/or whitespace, trims items, removes empties, and removes duplicates.
 *
 * @param value - A string, an array of strings, or null/undefined.
 * @returns De-duplicated list of tokens.
 */
export const parseDelimitedString = (
  value: string | string[] | null | undefined
): string[] => {
  if (!value) return [];

  // If it's already an array, process each item
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => parseDelimitedString(item)) // Recursively parse each item
      .filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
  }

  // For string input, split by both commas and spaces
  return value
    .split(/[,\s]+/) // Split by commas or spaces
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
};

/**
 * Normalizes an Instagram handle by:
 * - Trimming whitespace
 * - Removing leading @ symbol
 * - Converting to lowercase
 * - Removing any URL prefixes (instagram.com/, instagram.com/)
 *
 * @param handle - The Instagram handle to normalize (e.g., "@username", "username", "https://instagram.com/username")
 * @returns The normalized handle (e.g., "username")
 */
export function normalizeInstagramHandle(handle: string): string {
  if (!handle) return "";

  let normalized = handle.trim();

  // Remove URL prefixes
  normalized = normalized.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  normalized = normalized.replace(/^instagram\.com\//i, "");

  // Remove leading @ symbol
  normalized = normalized.replace(/^@+/, "");

  // Convert to lowercase
  normalized = normalized.toLowerCase();

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, "");

  return normalized;
}

/**
 * Validates if a phone number is in E.164 format
 * E.164 format: +[country code][number] (e.g., +1234567890)
 *
 * Note: react-international-phone handles formatting, but we still need
 * this for Zod validation to ensure the format is correct before submission.
 *
 * @param phone - The phone number to validate
 * @returns true if the phone number is in valid E.164 format
 */
export function isValidE164Phone(phone: string): boolean {
  if (!phone) return false;
  // E.164 format: + followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}
