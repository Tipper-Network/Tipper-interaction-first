"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ExploreTabs from "@/views/explore/explore_tabs";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import OnboardingModal from "@/features/onboarding/components/onboarding_modal/user_onboarding_modal";

export default function ExplorePage() {
  const profile = useAuthStore((s) => s.profile);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    const openModal = searchParams.get("openModal");

    if (profile && !profile.interests_setup && openModal === "onboarding") {
      setShowOnboardingModal(true);

      // Remove the query param so this only triggers once
      const params = new URLSearchParams(window.location.search);
      params.delete("openModal");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, profile, router]);

  return (
    <div>
      <div className="container flex flex-col justify-center items-center">
        <ExploreTabs />
      </div>

      {showOnboardingModal && (
        <OnboardingModal
          open={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          step="interests"
        />
      )}
    </div>
  );
}
