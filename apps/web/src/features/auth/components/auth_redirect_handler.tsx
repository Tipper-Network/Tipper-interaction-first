"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

export function RedirectHandler() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const refetch = useAuthStore((s) => s.refetch);

  const pathname = usePathname();
  const router = useRouter();

  const isVerificationPage = pathname === "/auth/verify";

  useEffect(() => {
    // Fetch session on first render
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (loading || !user) return;

    if (!user.email_verified && !isVerificationPage) {
      router.push("/auth/verify");
      return;
    }

    // If user is verified but has no profile, redirect to onboarding
    const isOnboardingPage = pathname === "/users/onboarding";
    if (user.email_verified && !profile && !isOnboardingPage) {
      router.push("/users/onboarding");
    }
  }, [user, profile, loading, pathname, router]);

  return null;
}
