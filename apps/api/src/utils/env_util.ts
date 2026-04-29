// src/config/env.ts

type AppEnv = 'development' | 'staging' | 'production';

const APP_ENV = (process.env.NODE_ENV || 'development') as AppEnv;

/**
 * True if the current app environment is `production`.
 *
 * Note: This is derived from `process.env.NODE_ENV` (defaulting to `development`).
 */
export const isProd = (): boolean => APP_ENV === 'production';

/**
 * True if the current app environment is `staging`.
 *
 * Note: This is derived from `process.env.NODE_ENV` (defaulting to `development`).
 */
export const isStaging = (): boolean => APP_ENV === 'staging';

/**
 * True if the current app environment is `development`.
 *
 * Note: This is derived from `process.env.NODE_ENV` (defaulting to `development`).
 */
export const isDev = (): boolean => APP_ENV === 'development';

/**
 * True if `process.env.NODE_ENV` is exactly `production`.
 *
 * This does not use the internal defaulting behavior of `APP_ENV`.
 */
export const isNodeProd = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Returns the normalized app environment.
 *
 * @returns The current `AppEnv`, derived from `process.env.NODE_ENV` or defaulting to `development`.
 */
export const getAppEnv = (): AppEnv => APP_ENV;
