import { z } from "zod";

export const AuthFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const VerificationCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

export type AuthFormData = z.infer<typeof AuthFormSchema>;
export type VerificationCodeFormData = z.infer<typeof VerificationCodeSchema>;
