"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import AuthWizard from "./auth_wizard";
import { Button, ButtonProps } from "@/components/ui/button";
import { NeutralDialog } from "@/components/NeutralDialog";

interface RequireAuthButtonProps extends ButtonProps {
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
  /**
   * Callback when user successfully signs in
   */
  onAuthSuccess?: () => void;
  /**
   * Callback when button is clicked and user is authenticated
   */
  onClick?: () => void;
  /**
   * Children to render inside the button
   */
  children: React.ReactNode;
}

/**
 * Button component that requires authentication before executing onClick
 *
 * Usage:
 * ```tsx
 * <RequireAuthButton onClick={handleAction}>
 *   Claim Entity
 * </RequireAuthButton>
 * ```
 */
export default function RequireAuthButton({
  returnUrl,
  requireEmailVerified = true,
  requireProfile = false,
  onAuthSuccess,
  onClick,
  children,
  ...buttonProps
}: RequireAuthButtonProps) {
  /**
   * Return URL to use after sign-in unless the returnUrl is provided
   */

  const pathname = usePathname();
  const { user, profile } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const finalReturnUrl = returnUrl || pathname || "/";

  const needsAuth = !user;
  const needsVerification =
    requireEmailVerified && user && !user.email_verified;
  const needsProfile = requireProfile && user && !profile;

  const handleClick = () => {
    // If user needs authentication, show auth wizard
    if (needsAuth || needsVerification || needsProfile) {
      setShowAuthModal(true);
      return;
    }

    // User is authenticated - execute onClick
    onClick?.();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess?.();
    // After auth success, execute the original onClick if provided
    if (!needsAuth && !needsVerification && !needsProfile) {
      onClick?.();
    }
  };

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {children}
      </Button>

      {showAuthModal && (
        <NeutralDialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <AuthWizard
            mode={needsVerification ? "verification" : "signin"}
            returnUrl={finalReturnUrl}
            onSuccess={handleAuthSuccess}
          />
        </NeutralDialog>
      )}
    </>
  );
}
