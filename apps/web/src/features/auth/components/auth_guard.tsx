"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import AuthWizard from "./auth_wizard";

interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Custom return URL after sign-in. If not provided, uses current pathname
   */
  returnUrl?: string;
  /**
   * If true, shows loading state while checking auth
   */
  showLoading?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * If true, requires email verification (default: true)
   */
  requireEmailVerified?: boolean;
  /**
   * If true, requires profile to exist (default: false)
   */
  requireProfile?: boolean;
  /**
   * Callback when user successfully signs in
   */
  onAuthSuccess?: () => void;
}

export default function AuthGuard({
  children,
  returnUrl,
  showLoading = true,
  loadingComponent,
  requireEmailVerified = true,
  requireProfile = false,
  onAuthSuccess,
}: AuthGuardProps) {
  const pathname = usePathname();
  const { user, profile, loading } = useAuthStore();
  const [showAuthWizard, setShowAuthWizard] = useState(false);

  // Determine return URL - use provided one or current pathname
  const finalReturnUrl = returnUrl || pathname || "/";

  // Check if user needs to authenticate
  const needsAuth = !user;
  const needsVerification =
    requireEmailVerified && user && !user.email_verified;
  const needsProfile = requireProfile && user && !profile;

  useEffect(() => {
    // Show auth wizard if user needs to sign in
    if (needsAuth || needsVerification || needsProfile) {
      setShowAuthWizard(true);
    } else {
      setShowAuthWizard(false);
    }
  }, [needsAuth, needsVerification, needsProfile]);

  // Show loading state
  if (loading && showLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )
    );
  }

  // Show auth wizard if user needs to authenticate
  if (showAuthWizard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthWizard
          mode={needsVerification ? "verification" : "signin"}
          returnUrl={finalReturnUrl}
          onSuccess={() => {
            setShowAuthWizard(false);
            onAuthSuccess?.();
          }}
        />
      </div>
    );
  }

  // User is authenticated - render children
  return <>{children}</>;
}
