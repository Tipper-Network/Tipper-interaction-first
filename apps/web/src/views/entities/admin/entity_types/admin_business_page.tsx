"use client";

import * as React from "react";
import EntityProfileBanner from "@/features/onboarding/components/entity_onboarding_form/entity_profile_banner";
import {
  ProfileDetailsCard,
  ProfileHeader,
  ProfileImagesGrid,
  ProfilePills,
} from "@/views/entities/shared/components/profile_components";
import { EntityNavButton } from "@/views/entities/shared/components/profile_components/entity_nav_button";
import {
  useEntityDetails,
  useUserEntityClaims,
} from "@/views/entities/shared/hooks/entities_hooks";
import { getEntityProfileDetailItems } from "@/views/entities/shared/utils/entity_items_resolver";
import AdminManageProfileView, {
  type AdminOfferingToggle,
} from "@/views/entities/admin/components/admin_manage_profile_view";
import { ChevronRight, Map, Handshake } from "lucide-react";
import { useAdminViewStore } from "@/views/entities/admin/store/admin_view_store";
import EditingProfileDetailsCard from "../components/editing_components.tsx/EditingProfileDetailsCard";
import EditingProfileImagesGrid from "../components/editing_components.tsx/EditingProfileImagesGrid";
import EditingProfileTags from "../components/editing_components.tsx/EditingProfileTags";
import AdminOfferings from "@/features/offerings/components/admin/admin_offerings";
import ProfileOfferings from "@/features/offerings/components/profile_offerings";
import { useEntityOfferings } from "@/features/offerings/hooks/offerings_hooks";
import { useEffect } from "react";

type AdminBusinessPageProps = {
  entityId: string;
};

const AdminBusinessPage = ({ entityId }: AdminBusinessPageProps) => {
  const {
    data: entity,
    isLoading,
    isError,
    refetch,
  } = useEntityDetails(entityId);
  const { data: userClaims } = useUserEntityClaims();
  const {
    data: offerings,
    isLoading: offeringsLoading,
    isError: offeringsError,
  } = useEntityOfferings(entityId);

  const imagesEnabled = useAdminViewStore((s) => s.imagesEnabled);
  const offeringsById = useAdminViewStore((s) => s.offeringsById);
  const isSaving = useAdminViewStore((s) => s.isSaving);
  const hasChanges = useAdminViewStore(
    (s) => s.dirtyImages || s.dirtyOfferingIds.length > 0
  );
  const hydrateFromEntity = useAdminViewStore((s) => s.hydrateFromEntity);
  const syncOfferingsFromBackend = useAdminViewStore(
    (s) => s.syncOfferingsFromBackend
  );
  const setImagesEnabled = useAdminViewStore((s) => s.setImagesEnabled);
  const setOfferingPublic = useAdminViewStore((s) => s.setOfferingPublic);
  const saveAll = useAdminViewStore((s) => s.saveAll);

  React.useEffect(() => {
    if (!entity) return;
    hydrateFromEntity({ entityId, entity });
  }, [entity, entityId, hydrateFromEntity]);

  useEffect(() => {
    // Important: do NOT default `offerings` to `[]` in the query destructure.
    // A fresh `[]` every render + syncing into Zustand creates an update loop.
    if (typeof offerings === "undefined") return;
    syncOfferingsFromBackend(offerings as any);
  }, [offerings, syncOfferingsFromBackend]);

  const entityTagRecords: any[] = Array.isArray((entity as any)?.tags)
    ? (((entity as any).tags as any[])
        .map((t) => t?.tag ?? t)
        .filter(Boolean) as any[])
    : [];

  const tags: string[] = entityTagRecords
    .map((t) => t?.label ?? t?.name)
    .filter(Boolean);

  const selectedTagIds: string[] = entityTagRecords
    .map((t) => t?.id ?? t?.tagId ?? t?.tag_id)
    .filter(Boolean);

  const vibes: string[] = Array.isArray((entity as any)?.vibes)
    ? ((entity as any).vibes as any[])
        .map((v) => v?.name ?? v?.label)
        .filter(Boolean)
    : [];

  const offeringToggles: AdminOfferingToggle[] = Array.isArray(offerings)
    ? (offerings as any[])
        .filter((o) => o?.id && typeof o?.label === "string")
        .map((o) => ({
          id: String(o.id),
          label: String(o.label),
          isPublic:
            offeringsById[String(o.id)]?.isPublic ?? Boolean(o.isPublic),
        }))
    : [];

  const offeringsForPreview = Array.isArray(offerings)
    ? (offerings as any[]).map((o) => ({
        ...o,
        isPublic: offeringsById[String(o.id)]?.isPublic ?? Boolean(o.isPublic),
      }))
    : [];
  const isOwnEntity = Array.isArray(userClaims)
    ? userClaims.some((claim: any) => claim.entity_id === entityId)
    : false;
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 pt-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <EntityProfileBanner entityId={entityId} />
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : null}

        {isError || !entity ? (
          <div className="py-10 text-center text-destructive">
            Failed to load profile.
          </div>
        ) : null}

        {entity ? (
          <div className=" w-full space-y-4 pt-4">
            <ProfileHeader
              name={entity.name}
              subtitle={entity.description ?? ""}
              entityId={entityId}
              // actionLabel="Edit mode"
            />

            <EditingProfileDetailsCard
              entity={entity}
              isOwnEntity={isOwnEntity}
              onUpdated={refetch}
            />

            <div className="space-x-2 flex justify-center">
              <EditingProfileTags
                entityId={entityId}
                tags={tags}
                selectedTagIds={selectedTagIds}
                isOwnEntity={isOwnEntity}
                onUpdated={refetch}
              />
              <ProfilePills
                title="Vibes"
                pills={vibes}
                className=" text-tertiary"
                pillClassName="bg-tertiary-tint text-white"
              />
            </div>

            <div className="space-y-3 pt-1 flex md:flex-col items-center justify-center">
              <EntityNavButton
                label="Community"
                href={`/explore/entity_communities/${entity.entity_community_slug}`}
                rightIcon
                mainIcon={<Map className="h-4 w-4" />}
                className="bg-tertiary-tint text-tertiary"
              />

              <EntityNavButton
                label="Partners"
                href={`/entities/${entityId}/partnerships`}
                rightIcon
                className="bg-secondary-tint text-secondary"
                mainIcon={<Handshake className="h-4 w-4" />}
              />
            </div>
            {/* Manage layout / structure */}
            <div className="mt-4  w-full ">
              <AdminManageProfileView
                imagesEnabled={imagesEnabled}
                onImagesToggle={setImagesEnabled}
                offerings={offeringToggles}
                onOfferingToggle={(offeringId, checked) => {
                  setOfferingPublic(offeringId, checked);
                }}
                isSaving={isSaving}
                hasChanges={hasChanges}
                onSave={saveAll}
              />
            </div>
            {imagesEnabled ? (
              <EditingProfileImagesGrid entityId={entityId} />
            ) : null}

            {/* Offerings CRUD + media management */}
            <div className="pt-2">
              <AdminOfferings
                entityId={entityId}
                offerings={(offerings ?? []) as any}
                isLoading={offeringsLoading}
                isError={offeringsError}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminBusinessPage;
