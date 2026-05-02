"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

interface UseRequireAuthOptions {
  /**
   * Custom return URL after sign-in. If not provided, uses current pathname
   */
  returnUrl?: string;
  /**
   * If true, requires email verification (default: true)
   */
  requireEmailVerified?: boolean;
  /**
   * If true, requires profile to exist (default: false)
   */
  requireProfile?: boolean;
}

interface UseRequireAuthReturn {
  /**
   * Whether user needs to authenticate
   */
  needsAuth: boolean;
  /**
   * Whether to show auth wizard
   */
  showAuthWizard: boolean;
  /**
   * Function to set show auth wizard
   */
  setShowAuthWizard: (show: boolean) => void;
  /**
   * Function to check auth and execute callback if authenticated
   */
  requireAuth: (callback: () => void) => void;
  /**
   * Return URL to use after sign-in
   */
  returnUrl: string;
}

/**
 * Hook for button-level authentication checks
 *
 * Usage:
 * ```tsx
 * const { requireAuth, showAuthWizard, setShowAuthWizard, returnUrl } = useRequireAuth();
 *
 * const handleClick = () => {
 *   requireAuth(() => {
 *     // This only runs if user is authenticated
 *     doSomething();
 *   });
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleClick}>Action</Button>
 *     {showAuthWizard && (
 *       <AuthWizard returnUrl={returnUrl} onSuccess={() => setShowAuthWizard(false)} />
 *     )}
 *   </>
 * );
 * ```
 */
export function useRequireAuth(
  options: UseRequireAuthOptions = {}
): UseRequireAuthReturn {
  const pathname = usePathname();
  const { user, profile } = useAuthStore();
  const [showAuthWizard, setShowAuthWizard] = useState(false);

  const {
    returnUrl: customReturnUrl,
    requireEmailVerified = true,
    requireProfile = false,
  } = options;

  const finalReturnUrl = customReturnUrl || pathname || "/";

  const needsAuth = !user;
  const needsVerification =
    requireEmailVerified && user && !user.email_verified;
  const needsProfile = requireProfile && user && !profile;

  const requireAuth = useCallback(
    (callback: () => void) => {
      // If user needs authentication, show auth wizard
      if (needsAuth || needsVerification || needsProfile) {
        setShowAuthWizard(true);
        return;
      }

      // User is authenticated - execute callback
      callback();
    },
    [needsAuth, needsVerification, needsProfile]
  );

  return {
    needsAuth: needsAuth || needsVerification || needsProfile,
    showAuthWizard,
    setShowAuthWizard,
    requireAuth,
    returnUrl: finalReturnUrl,
  };
}
