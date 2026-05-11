"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import StepData from "../user_onboarding_form/steps/user_data_step";
import StepPersona from "../user_onboarding_form/steps/user_persona_step";
import StepValues from "../user_onboarding_form/steps/user_values_step";
import StepInterests from "../user_onboarding_form/steps/user_interests_step";
import {
  useUserProfile,
  useUserPersonas,
  useUserValues,
  useUserInterests,
  useOnboardingStatus,
} from "@/views/users/hooks/users_hooks";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { NeutralDialog } from "@/components/neutral_dialog";

interface ProfileData {
  first_name: string;
  last_name?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  date_of_birth?: string;
}

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  step: "profile" | "personas" | "values" | "interests" | null;
}

export default function OnboardingModal({
  open,
  onClose,
  step,
}: OnboardingModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  // Only fetch data when modal is open and user is authenticated
  const shouldFetch = open && !!user;
  const { data: profileData } = useUserProfile();
  const { data: personasData } = useUserPersonas();
  const { data: valuesData } = useUserValues();
  const { data: interestsData } = useUserInterests();
  const { refetch: refetchOnboardingStatus } = useOnboardingStatus(shouldFetch);

  // Transform interests data for StepInterests
  const existingInterests = useMemo(() => {
    if (!Array.isArray(interestsData)) return [];
    return interestsData.map((item: any) => ({
      id: item.interests?.id ?? String(Math.random()),
      interest_name: item.interests?.interest_name ?? "Unknown",
      interest_category: item.interests?.interest_category ?? "Other",
    }));
  }, [interestsData]);

  // Profile step state
  const [profileFormData, setProfileFormData] = useState<ProfileData>({
    first_name: profileData?.first_name || profile?.first_name || "",
    last_name: profileData?.last_name || profile?.last_name || "",
    bio: profileData?.bio || "",
    avatarUrl: profileData?.avatarUrl || "",
    location: profileData?.location || "",
    date_of_birth: profileData?.date_of_birth || "",
  });

  // Personas step state
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(
    personasData?.map((p: any) => p.persona_id || p.id) || []
  );

  // Values step state
  const [selectedValues, setSelectedValues] = useState<string[]>(
    valuesData?.map((v: any) => v.value_id || v.value?.id) || []
  );

  // Update form data when existing data loads
  useEffect(() => {
    if (profileData) {
      setProfileFormData((prev) => ({
        ...prev,
        first_name: profileData.first_name || prev.first_name,
        last_name: profileData.last_name || prev.last_name,
        bio: profileData.bio || prev.bio,
        avatarUrl: profileData.avatarUrl || prev.avatarUrl,
        location: profileData.location || prev.location,
        date_of_birth: profileData.date_of_birth || prev.date_of_birth,
      }));
    }
  }, [profileData]);

  useEffect(() => {
    if (personasData && personasData.length > 0) {
      setSelectedPersonas(personasData.map((p: any) => p.persona_id || p.id));
    }
  }, [personasData]);

  useEffect(() => {
    if (valuesData && valuesData.length > 0) {
      setSelectedValues(valuesData.map((v: any) => v.value_id || v.value?.id));
    }
  }, [valuesData]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    await refetchOnboardingStatus();
    // Refetch auth store to ensure profile is updated
    const { refetch } = useAuthStore.getState();
    await refetch();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case "profile":
        return (
          <StepData
            data={profileFormData}
            onChange={handleChange}
            onNext={handleComplete}
          />
        );
      case "personas":
        return (
          <StepPersona
            selected={selectedPersonas}
            onChange={setSelectedPersonas}
            onBack={onClose}
            onNext={handleComplete}
          />
        );
      case "values":
        return (
          <StepValues
            selected={selectedValues}
            onChange={setSelectedValues}
            onBack={onClose}
            onSubmit={handleComplete}
          />
        );
      case "interests":
        return (
          <StepInterests
            onComplete={handleComplete}
            existingInterests={existingInterests}
          />
        );
      default:
        return null;
    }
  };

  return (
    <NeutralDialog open={open} onOpenChange={onClose}>
      <div className="relative">
        {renderStep()}
        <Button
          variant="link"
          className="absolute top-2 right-2 text-primary hover:text-primary-shade z-10"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </NeutralDialog>
  );
}
