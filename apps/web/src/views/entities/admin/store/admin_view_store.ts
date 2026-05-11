"use client";

import { create } from "zustand";
import { toast } from "sonner";
import {
  updateEntityOfferingsPublic,
  updateEntityPublicProfileFlags,
} from "@/features/entities/admin/api/entity_public_profile_api";

type OfferingDraft = {
  id: string;
  label: string;
  isPublic: boolean;
};

export type AdminPublicProfileFlags = {
  imagesEnabled: boolean;
};

type AdminViewStore = {
  entityId: string | null;
  hasHydrated: boolean;

  // Draft state (what the editor currently shows)
  imagesEnabled: boolean;
  offeringsById: Record<string, OfferingDraft>;

  // Baseline (last hydrated from backend). Used for diff-based dirty tracking.
  initialImagesEnabled: boolean;
  initialOfferingsPublicById: Record<string, boolean>;

  // Dirty tracking
  dirtyImages: boolean;
  dirtyOfferingIds: string[];

  isSaving: boolean;

  hydrateFromEntity: (params: { entityId: string; entity: any }) => void;
  syncOfferingsFromBackend: (offerings: any[]) => void;

  setImagesEnabled: (checked: boolean) => void;
  setOfferingPublic: (offeringId: string, checked: boolean) => void;

  saveEntityFlagsOnly: () => Promise<void>;
  saveOfferingsOnly: () => Promise<void>;
  saveAll: () => Promise<void>;

  reset: () => void;
};

function uniq(ids: string[]) {
  return Array.from(new Set(ids));
}

function withoutId(ids: string[], id: string) {
  return ids.filter((x) => x !== id);
}

export const useAdminViewStore = create<AdminViewStore>((set, get) => ({
  entityId: null,
  hasHydrated: false,

  imagesEnabled: true,
  offeringsById: {},

  initialImagesEnabled: true,
  initialOfferingsPublicById: {},

  dirtyImages: false,
  dirtyOfferingIds: [],

  isSaving: false,

  hydrateFromEntity: ({ entityId, entity }) => {
    const prevEntityId = get().entityId;
    const switchingEntities =
      typeof prevEntityId === "string" && prevEntityId.length > 0
        ? prevEntityId !== entityId
        : false;

    // Images visibility: stored in metadata.publicProfile.imagesEnabled if present,
    // otherwise default to "true if gallery exists, else false".
    const hasGallery =
      Array.isArray(entity?.entityMedia) &&
      entity.entityMedia.some(
        (m: any) => m?.role === "GALLERY" && typeof m?.key === "string"
      );

    const imagesEnabled =
      entity?.metadata?.publicProfile?.imagesEnabled ??
      (hasGallery ? true : false);

    set({
      entityId,
      hasHydrated: true,
      imagesEnabled: Boolean(imagesEnabled),
      initialImagesEnabled: Boolean(imagesEnabled),
      dirtyImages: false,
      ...(switchingEntities
        ? {
            offeringsById: {},
            initialOfferingsPublicById: {},
            dirtyOfferingIds: [],
          }
        : {}),
    });
  },

  syncOfferingsFromBackend: (offerings) =>
    set((s) => {
      const list = Array.isArray(offerings) ? offerings : [];
      const incomingIds = new Set<string>();

      let changed = false;

      const nextOfferingsById: Record<string, OfferingDraft> = {
        ...s.offeringsById,
      };
      const nextInitial: Record<string, boolean> = {
        ...s.initialOfferingsPublicById,
      };

      list.forEach((o: any) => {
        if (!o?.id) return;
        const id = String(o.id);
        incomingIds.add(id);

        const label =
          typeof o.label === "string" ? o.label : String(o.label ?? "");
        const backendIsPublic = Boolean(o.isPublic);
        const existing = nextOfferingsById[id];
        const isDirty = s.dirtyOfferingIds.includes(id);

        if (existing) {
          // Keep any in-progress edits, but always update label.
          const nextLabel = label || existing.label;
          const nextIsPublic = isDirty ? existing.isPublic : backendIsPublic;

          if (
            existing.label !== nextLabel ||
            existing.isPublic !== nextIsPublic
          ) {
            changed = true;
            nextOfferingsById[id] = {
              ...existing,
              label: nextLabel,
              isPublic: nextIsPublic,
            };
          }
        } else {
          changed = true;
          nextOfferingsById[id] = {
            id,
            label,
            isPublic: backendIsPublic,
          };
        }

        // Only set baseline if we haven't seen it yet.
        if (typeof nextInitial[id] !== "boolean") {
          changed = true;
          nextInitial[id] = backendIsPublic;
        }
      });

      // Remove offerings that no longer exist (and drop any dirty flags for them).
      Object.keys(nextOfferingsById).forEach((id) => {
        if (!incomingIds.has(id)) {
          changed = true;
          delete nextOfferingsById[id];
          delete nextInitial[id];
        }
      });

      const nextDirtyOfferingIds = s.dirtyOfferingIds.filter((id) =>
        incomingIds.has(id)
      );

      if (nextDirtyOfferingIds.length !== s.dirtyOfferingIds.length) {
        changed = true;
      }

      if (!changed) return s;

      return {
        offeringsById: nextOfferingsById,
        initialOfferingsPublicById: nextInitial,
        dirtyOfferingIds: nextDirtyOfferingIds,
      };
    }),

  setImagesEnabled: (checked) =>
    set((s) => ({
      imagesEnabled: checked,
      dirtyImages: checked !== s.initialImagesEnabled,
    })),

  setOfferingPublic: (offeringId, checked) =>
    set((s) => {
      const existing = s.offeringsById[offeringId];
      if (!existing) return s;
      const initialIsPublic = s.initialOfferingsPublicById[offeringId];
      const isDirty =
        typeof initialIsPublic === "boolean"
          ? checked !== initialIsPublic
          : checked !== existing.isPublic;
      return {
        offeringsById: {
          ...s.offeringsById,
          [offeringId]: { ...existing, isPublic: checked },
        },
        dirtyOfferingIds: isDirty
          ? uniq([...s.dirtyOfferingIds, offeringId])
          : withoutId(s.dirtyOfferingIds, offeringId),
      };
    }),

  saveEntityFlagsOnly: async () => {
    const { entityId, dirtyImages, imagesEnabled } = get();
    if (!entityId) return;
    if (!dirtyImages) return;

    try {
      await updateEntityPublicProfileFlags({
        entityId,
        flags: { imagesEnabled },
      });
      // On success, update baseline so diff-based dirty tracking stays correct.
      set({
        dirtyImages: false,
        initialImagesEnabled: imagesEnabled,
      });
    } catch (err) {
      toast.error("Failed to save profile visibility");
      throw err;
    }
  },

  saveOfferingsOnly: async () => {
    const { entityId, dirtyOfferingIds, offeringsById } = get();
    if (!entityId) return;
    if (dirtyOfferingIds.length === 0) return;

    const updates = dirtyOfferingIds
      .map((id) => offeringsById[id])
      .filter(Boolean)
      .map((o) => ({ id: o.id, isPublic: o.isPublic }));

    if (updates.length === 0) return;

    try {
      await updateEntityOfferingsPublic({
        entityId,
        offerings: updates,
      });
      // On success, update baseline for updated offerings so diff-based dirty stays correct.
      set((s) => {
        const nextInitial = { ...s.initialOfferingsPublicById };
        updates.forEach((u) => {
          nextInitial[u.id] = u.isPublic;
        });
        return {
          dirtyOfferingIds: [],
          initialOfferingsPublicById: nextInitial,
        };
      });
    } catch (err) {
      toast.error("Failed to save offerings visibility");
      throw err;
    }
  },

  saveAll: async () => {
    const { dirtyImages, dirtyOfferingIds } = get();
    if (!dirtyImages && dirtyOfferingIds.length === 0) {
      // UI should prevent this, but keep it safe if someone calls saveAll directly.
      return;
    }

    set({ isSaving: true });
    try {
      await Promise.all([
        get().saveEntityFlagsOnly(),
        get().saveOfferingsOnly(),
      ]);
      toast.success("Saved");
    } finally {
      set({ isSaving: false });
    }
  },

  reset: () =>
    set({
      entityId: null,
      hasHydrated: false,
      imagesEnabled: true,
      offeringsById: {},
      initialImagesEnabled: true,
      initialOfferingsPublicById: {},
      dirtyImages: false,
      dirtyOfferingIds: [],
      isSaving: false,
    }),
}));
