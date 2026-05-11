"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import OnboardingModal from "@/features/onboarding/components/onboarding_modal/user_onboarding_modal";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const refetch = useAuthStore((s) => s.refetch);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasRefetched, setHasRefetched] = useState(false);

  // Refetch user data on mount to ensure fresh data after redirect from verification
  useEffect(() => {
    const fetchUser = async () => {
      if (!hasRefetched) {
        await refetch();
        setHasRefetched(true);
        // Refresh the page to ensure all state is synced
        router.refresh();
      }
    };
    fetchUser();
  }, [refetch, router, hasRefetched]);

  useEffect(() => {
    // Don't make routing decisions while loading or before refetch completes
    if (loading || !hasRefetched) {
      return;
    }

    // If user is not verified, redirect to verification
    if (user && !user.email_verified) {
      router.replace("/auth/verify");
      return;
    }

    // If user has a profile, redirect appropriately
    if (user?.email_verified && profile) {
      // If came from invitation (returnUrl contains /entities/invitations/), redirect back
      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        router.replace("/explore");
      }
      return;
    }

    // If user is verified but has no profile, show profile modal
    if (user?.email_verified && !profile) {
      setShowProfileModal(true);
    }
  }, [user, profile, router, loading, hasRefetched]);

  const handleProfileComplete = async () => {
    setShowProfileModal(false);
    // Refetch auth store to ensure profile is loaded
    await refetch();
    // Refresh the page to ensure state is updated
    router.refresh();
    // Small delay to ensure state is updated before redirect
    setTimeout(() => {
      // If came from invitation (returnUrl contains /entities/invitations/), redirect back
      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        router.replace("/explore");
      }
    }, 100);
  };

  // Show loading state while checking auth or refetching
  if (loading || !hasRefetched || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <OnboardingModal
        open={showProfileModal}
        onClose={handleProfileComplete}
        step="profile"
      />
      {!showProfileModal && (
        <p className="text-muted-foreground">Setting up your profile...</p>
      )}
    </div>
  );
}
