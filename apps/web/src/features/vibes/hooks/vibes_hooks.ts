import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllVibes,
  fetchVibesByCategory,
  fetchVibeById,
  createVibe,
  fetchCommunityVibes,
  addVibeToCommunity,
  removeVibeFromCommunity,
  fetchUserVibes,
  VibeCategory,
} from "../api/vibes_api";

// Get all available vibes
export const useAllVibes = (category?: string) => {
  return useQuery({
    queryKey: ["vibes", "all", category],
    queryFn: () => fetchAllVibes(category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get vibes grouped by category (returns array format like interests)
export const useVibesByCategory = () => {
  return useQuery<VibeCategory[]>({
    queryKey: ["vibes", "by-category"],
    queryFn: fetchVibesByCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get a specific vibe by ID
export const useVibeById = (vibeId: string) => {
  return useQuery({
    queryKey: ["vibes", vibeId],
    queryFn: () => fetchVibeById(vibeId),
    enabled: !!vibeId,
  });
};

// Create a new vibe (global)
export const useCreateVibe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vibeName: string) => createVibe(vibeName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vibes", "all"] });
    },
  });
};

// Get community vibes with counts
export const useCommunityVibes = (communityId: string) => {
  return useQuery({
    queryKey: ["community-vibes", communityId],
    queryFn: () => fetchCommunityVibes(communityId),
    enabled: !!communityId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Add vibe to community
export const useAddVibeToCommunity = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      vibe_id?: string;
      vibe_name?: string;
      category?: string;
    }) => addVibeToCommunity(communityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-vibes", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-vibes", communityId],
      });
    },
  });
};

// Remove vibe from community
export const useRemoveVibeFromCommunity = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vibeId: string) =>
      removeVibeFromCommunity(communityId, vibeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-vibes", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-vibes", communityId],
      });
    },
  });
};

// Get user's vibes for a community
export const useUserVibes = (communityId: string) => {
  return useQuery({
    queryKey: ["user-vibes", communityId],
    queryFn: () => fetchUserVibes(communityId),
    enabled: !!communityId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
