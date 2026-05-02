const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Logs a user in via email/password.
 *
 * Sends credentials to the backend and returns the parsed JSON payload.
 * Throws an `Error` with backend `message` (and attaches `code` if provided).
 *
 * @param email - User email.
 * @param password - User password.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the response is not OK.
 */
export async function loginWithCredentials(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    // Handle specific error messages from backend
    const errorMessage = data.message || "Invalid login credentials";
    const error = new Error(errorMessage);
    // Attach error code for frontend handling
    (error as any).code = data.code;
    throw error;
  }
  return data;
}

/**
 * Signs a user up via email/password.
 *
 * @param email - User email.
 * @param password - User password.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the response is not OK.
 */
export async function signupWithCredentials(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, federated_identity_user: false }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
}

/**
 * Verifies an email verification code.
 *
 * @param email - User email.
 * @param code - Verification code.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the response is not OK.
 */
export async function verifyCode(email: string, code: string) {
  const res = await fetch(`${API_URL}/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification failed");
  return data;
}

/**
 * Requests a new email verification code.
 *
 * @param email - User email.
 * @returns Parsed JSON response from the backend.
 * @throws Error if the response is not OK.
 */
export async function resendVerificationCode(email: string) {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to resend verification code");
  return res.json();
}

/**
 * Starts an OAuth flow by redirecting the browser to the backend provider route.
 *
 * If `returnUrl` is provided it is persisted in a short-lived cookie so the
 * backend OAuth callback can read it and redirect the user back to the correct
 * page after authentication.  The same cookie is read by every provider
 * callback (Google today, Apple/Facebook/etc. tomorrow) — no extra work needed
 * when adding new providers.
 *
 * @param provider  - Provider string used in the backend route (e.g. `google`).
 * @param returnUrl - Path to return to after auth (e.g. `/community/my-slug`).
 */
export function startOAuth(provider: string, returnUrl?: string) {
  if (returnUrl) {
    // Short-lived (5 min) non-HttpOnly cookie — backend reads this in callback.
    // Not sensitive (it's just a path), so client-side setting is fine.
    document.cookie = `auth_return_path=${encodeURIComponent(returnUrl)}; path=/; max-age=300; SameSite=Lax`;
  }
  window.location.href = `${API_URL}/auth/${provider}`;
}

/**
 * Fetches the currently-authenticated session user.
 *
 * @returns Parsed JSON user payload, or `null` if unauthenticated.
 */
export async function getSessionUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

/**
 * Logs the current user out.
 *
 * @returns Parsed JSON response from the backend.
 * @throws Error if the response is not OK.
 */
export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
