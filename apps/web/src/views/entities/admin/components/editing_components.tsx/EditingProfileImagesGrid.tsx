"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UploadMedia } from "@/components/upload_file";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
  import { type EntityGallerySlot } from "@/views/entities/shared/api/entities_media_api";
import {
  useEntityGallery,
  useUpdateEntityGallerySlot,
} from "@/views/entities/shared/hooks/entities_media_hooks";
import Image from "next/image";
import LogoViewComponent from "@/components/logo_view_component";

type EditingProfileImagesGridProps = {
  entityId: string;
  className?: string;
};

const SLOTS: Array<1 | 2 | 3> = [1, 2, 3];

export default function EditingProfileImagesGrid({
  entityId,
  className,
}: EditingProfileImagesGridProps) {
  const { data, isLoading, isError, refetch } = useEntityGallery(entityId);

  // Debug: Log what we receive from API
  useEffect(() => {
    if (data?.slots) {
      console.log(
        "[EditingProfileImagesGrid] Received slots from API:",
        data.slots
      );
      console.log(
        "[EditingProfileImagesGrid] Slot 3 data:",
        data.slots.find((s) => s.slot === 3)
      );
    }
  }, [data?.slots]);

  const slotsByNumber = useMemo(() => {
    const map = new Map<1 | 2 | 3, EntityGallerySlot>();
    const slots = data?.slots ?? [];

    console.log(
      "[EditingProfileImagesGrid] Processing slots in useMemo:",
      slots
    );

    for (const slot of slots) {
      // Ensure slot number is a number, not a string
      const slotNum =
        typeof slot.slot === "number" ? slot.slot : Number(slot.slot);

      if (slotNum === 1 || slotNum === 2 || slotNum === 3) {
        console.log(
          `[EditingProfileImagesGrid] Mapping slot ${slotNum}:`,
          slot
        );
        map.set(slotNum as 1 | 2 | 3, { ...slot, slot: slotNum as 1 | 2 | 3 });
      } else {
        console.warn(`[EditingProfileImagesGrid] Invalid slot number:`, slot);
      }
    }

    console.log(
      "[EditingProfileImagesGrid] Final map:",
      Array.from(map.entries())
    );
    return map;
  }, [data]);

  const [selectedBySlot, setSelectedBySlot] = useState<
    Partial<Record<1 | 2 | 3, File | null>>
  >({});

  // revoke object urls for previews
  useEffect(() => {
    const urls: string[] = [];
    for (const slot of SLOTS) {
      const f = selectedBySlot[slot];
      if (f) urls.push(URL.createObjectURL(f));
    }
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [selectedBySlot]);

  const mutation = useUpdateEntityGallerySlot(entityId);

  const previewUrlForSlot = (slot: 1 | 2 | 3) => {
    const selected = selectedBySlot[slot];
    if (selected) return URL.createObjectURL(selected);
    const slotData = slotsByNumber.get(slot);
    console.log(`[EditingProfileImagesGrid] previewUrlForSlot(${slot}):`, {
      slotData,
      url: slotData?.url,
      hasUrl: !!slotData?.url,
    });
    return slotData?.url ?? null;
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="text-center text-sm font-semibold text-foreground">
        Images
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-muted-foreground">
          Loading images...
        </div>
      ) : null}

      {isError ? (
        <div className="text-center text-sm text-destructive">
          Failed to load images.
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        {SLOTS.map((slot) => {
          const previewUrl = previewUrlForSlot(slot);
          const pending = Boolean(selectedBySlot[slot]);

          return (
            <div key={slot} className="space-y-2">
              <div className="aspect-square hover:cursor-pointer rounded-2xl bg-muted ring-1 ring-border overflow-hidden">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt={`gallery-${slot}`}
                    className="h-full w-full object-cover"
                    width={164}
                    height={164}
                  />
                ) : null}
              </div>

              <UploadMedia
                id={`entity-gallery-slot-${entityId}-${slot}`}
                label={`Slot ${slot}`}
                accept="image/*"
                multiple={false}
                showCount={false}
                selected={
                  selectedBySlot[slot] ? [selectedBySlot[slot] as File] : []
                }
                onChange={(files) =>
                  setSelectedBySlot((prev) => ({
                    ...prev,
                    [slot]: files[0] ?? null,
                  }))
                }
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={!pending || mutation.isPending}
                  onClick={() => {
                    const file = selectedBySlot[slot];
                    if (!file) return;
                    mutation.mutate(
                      { slot, file },
                      {
                        onSuccess: () => {
                          toast.success(`Gallery image ${slot} updated`);
                          setSelectedBySlot((prev) => ({
                            ...prev,
                            [slot]: null,
                          }));
                          // Force refetch to get updated data
                          refetch();
                        },
                        onError: (e: any) => {
                          toast.error(
                            `Failed to update gallery image ${slot}`,
                            {
                              description: e?.message ?? String(e),
                            }
                          );
                        },
                      }
                    );
                  }}
                >
                  {mutation.isPending
                    ? "Uploading..."
                    : pending
                      ? "Upload"
                      : "Upload"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="ghost" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
