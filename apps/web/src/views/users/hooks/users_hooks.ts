import { useQuery } from "@tanstack/react-query";
import {
  fetchUserProfile,
  fetchUserInterests,
  fetchUserValues,
  createUserProfile,
  CreateUserProfilePayload,
  fetchUserPersonas,
  updateUserProfile,
  getOnboardingStatus,
  saveUserPersonas,
  saveUserValues,
  updateUserInterests,
} from "../api/users_api";
import {
  SavePersonasPayload,
  SaveValuesPayload,
  UpdateProfilePayload,
} from "../api/profile.types";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export const useUserProfile = () => {
  const refetch = useAuthStore((s) => s.refetch);
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateUserProfile(data),
    onSuccess: () => {
      query.refetch(); // Refetch profile data
      refetch(); // Update auth store
    },
  });

  return {
    ...query,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};

export const useUserPersonas = () => {
  const refetch = useAuthStore((s) => s.refetch);
  const query = useQuery({
    queryKey: ["user-personas"],
    queryFn: fetchUserPersonas,
  });

  const mutation = useMutation({
    mutationFn: (data: SavePersonasPayload) => saveUserPersonas(data),
    onSuccess: () => {
      query.refetch(); // Refetch personas data
      refetch(); // Update auth store
    },
  });

  return {
    ...query,
    savePersonas: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
};

export const useUserInterests = () => {
  const refetch = useAuthStore((s) => s.refetch);
  const query = useQuery({
    queryKey: ["user-interests"],
    queryFn: fetchUserInterests,
  });

  const mutation = useMutation({
    mutationFn: (interest_ids: string[]) => updateUserInterests(interest_ids),
    onSuccess: () => {
      query.refetch(); // Refetch interests data
      refetch(); // Update auth store
    },
  });

  return {
    ...query,
    updateInterests: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};

export const useUserValues = () => {
  const refetch = useAuthStore((s) => s.refetch);
  const query = useQuery({
    queryKey: ["user-values"],
    queryFn: fetchUserValues,
  });

  const mutation = useMutation({
    mutationFn: (data: SaveValuesPayload) => saveUserValues(data),
    onSuccess: () => {
      query.refetch(); // Refetch values data
      refetch(); // Update auth store
    },
  });

  return {
    ...query,
    saveValues: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
};

export const useCreateUserProfile = () => {
  return useMutation({
    mutationFn: (data: CreateUserProfilePayload) => {
      return createUserProfile(data);
    },
  });
};

// Lightweight hooks for step-by-step onboarding (one-time updates)
// These are aliases for convenience, but you can also use the mutations from the query hooks above
export const useUpdateUserProfile = () => {
  const { updateProfile, isUpdating, updateError } = useUserProfile();
  return {
    mutateAsync: updateProfile,
    isPending: isUpdating,
    error: updateError,
  };
};

export const useSaveUserPersonas = () => {
  const { savePersonas, isSaving, saveError } = useUserPersonas();
  return {
    mutateAsync: savePersonas,
    isPending: isSaving,
    error: saveError,
  };
};

export const useSaveUserValues = () => {
  const { saveValues, isSaving, saveError } = useUserValues();
  return {
    mutateAsync: saveValues,
    isPending: isSaving,
    error: saveError,
  };
};

export const useOnboardingStatus = (enabled: boolean = true) => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["onboarding-status"],
    queryFn: getOnboardingStatus,
    staleTime: 30000, // Cache for 30 seconds
    enabled: enabled && !!user, // Only fetch if enabled and user is authenticated
  });
};
