// src/env/appEnv.ts

/**
 * Public app environment set at build time via `NEXT_PUBLIC_APP_ENV`.
 *
 * Expected values: `development` | `staging` | `production`.
 */
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as
  | "development"
  | "staging"
  | "production";

/**
 * True if `APP_ENV` is `production`.
 */
export const isProd = (): boolean => APP_ENV === "production";

/**
 * True if `APP_ENV` is `staging`.
 */
export const isStaging = (): boolean => APP_ENV === "staging";

/**
 * True if `APP_ENV` is `development`.
 */
export const isDev = (): boolean => APP_ENV === "development";

// low-level (build-time)
/**
 * True if `process.env.NODE_ENV` is exactly `production`.
 */
export const isNodeProd = (): boolean => process.env.NODE_ENV === "production";
