import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createOffering,
  deleteOffering,
  deleteOfferingMedia,
  listOfferings,
  listOfferingMedia,
  updateOffering,
  uploadOfferingMedia,
} from "../api/offerings_api";
import type {
  CreateOfferingInput,
  OfferingMedia,
  UpdateOfferingInput,
} from "../api/types";

export function useEntityOfferings(entityId: string) {
  return useQuery({
    queryKey: ["entity-offerings", entityId],
    enabled: Boolean(entityId),
    queryFn: () => listOfferings(entityId),
    staleTime: 1000 * 30,
  });
}

export function useCreateOffering(entityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOfferingInput) =>
      createOffering(entityId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["entity-offerings", entityId] });
    },
  });
}

export function useUpdateOffering(entityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      offeringId: string;
      payload: UpdateOfferingInput;
    }) => updateOffering(entityId, params.offeringId, params.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["entity-offerings", entityId] });
    },
  });
}

export function useDeleteOffering(entityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offeringId: string) => deleteOffering(entityId, offeringId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["entity-offerings", entityId] });
    },
  });
}

export function useOfferingMedia(entityId: string, offeringId: string) {
  return useQuery({
    queryKey: ["offering-media", entityId, offeringId],
    enabled: Boolean(entityId) && Boolean(offeringId),
    queryFn: () => listOfferingMedia(entityId, offeringId),
    staleTime: 1000 * 30,
  });
}

/**
 * Tabs-friendly hook: fetch media for either:
 * - only the active tab (prefetchAll=false)
 * - all tabs (prefetchAll=true)
 *
 * This is a SINGLE hook call, so it’s safe to be invoked from a Tabs component.
 */
export function useOfferingMediaTabsData(params: {
  entityId: string;
  values: string[];
  activeValue: string;
  prefetchAll?: boolean;
}): {
  dataByValue: Record<string, OfferingMedia[]>;
  isLoading: boolean;
  isError: boolean;
} {
  const { entityId, values, activeValue, prefetchAll = false } = params;

  const ids = Array.isArray(values) ? values : [];

  const queries = useQueries({
    queries: ids.map((offeringId) => ({
      queryKey: ["offering-media", entityId, offeringId],
      enabled:
        Boolean(entityId) &&
        Boolean(offeringId) &&
        (prefetchAll || offeringId === activeValue),
      queryFn: () => listOfferingMedia(entityId, offeringId),
      staleTime: 1000 * 30,
    })),
  });

  const dataByValue: Record<string, OfferingMedia[]> = {};
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (!id) continue;
    dataByValue[id] = (queries[i]?.data ?? []) as OfferingMedia[];
  }

  return {
    dataByValue,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}

export function useUploadOfferingMedia(entityId: string, offeringId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) =>
      uploadOfferingMedia({ entityId, offeringId, files }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["entity-offerings", entityId] }),
        qc.invalidateQueries({
          queryKey: ["offering-media", entityId, offeringId],
        }),
      ]);
    },
  });
}

export function useDeleteOfferingMedia(entityId: string, offeringId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) =>
      deleteOfferingMedia({ entityId, offeringId, mediaId }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["entity-offerings", entityId] }),
        qc.invalidateQueries({
          queryKey: ["offering-media", entityId, offeringId],
        }),
      ]);
    },
  });
}
