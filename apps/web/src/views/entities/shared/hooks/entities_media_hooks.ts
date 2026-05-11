import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEntityGallery,
  getEntityLogo,
  updateEntityGallerySlot,
  updateEntityLogo,
} from "@/views/entities/shared/api/entities_media_api";

export function useEntityLogo(entityId: string) {
  return useQuery({
    queryKey: ["entity-logo", entityId],
    enabled: Boolean(entityId),
    queryFn: () => getEntityLogo(entityId),
    staleTime: 1000 * 60 * 5, // 5 minutes - same as entity details
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: 1000,
  });
}

export function useUpdateEntityLogo(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      updateEntityLogo({ entityId, file }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["entity-logo", entityId] }),
        queryClient.invalidateQueries({ queryKey: ["entity", entityId] }),
      ]);
    },
  });
}

export function useEntityGallery(entityId: string) {
  return useQuery({
    queryKey: ["entity-gallery", entityId],
    enabled: Boolean(entityId),
    queryFn: () => getEntityGallery(entityId),
    staleTime: 1000 * 30,
  });
}

export function useUpdateEntityGallerySlot(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slot, file }: { slot: 1 | 2 | 3; file: File }) =>
      updateEntityGallerySlot({ entityId, slot, file }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["entity-gallery", entityId],
        }),
        queryClient.invalidateQueries({ queryKey: ["entity", entityId] }),
      ]);
    },
  });
}
