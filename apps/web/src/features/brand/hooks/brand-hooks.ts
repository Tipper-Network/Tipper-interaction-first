import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchResolvedBrandByEntityId,
  replaceQrStyleForEntity,
} from "../api/brand-api";
import { QRStyle } from "@/features/qr_code/validation/qrcode-validation";

export function useResolvedBrandByEntityId(entityId?: string) {
  return useQuery({
    queryKey: ["brand", "resolved", entityId],
    enabled: !!entityId,
    queryFn: () => fetchResolvedBrandByEntityId(entityId as string),
    staleTime: 1000 * 60 * 5,
  });
}

export function useReplaceQrStyleForEntity(entityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrStyle: QRStyle) =>
      replaceQrStyleForEntity(entityId, qrStyle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brand", "resolved", entityId],
      });
    },
  });
}
