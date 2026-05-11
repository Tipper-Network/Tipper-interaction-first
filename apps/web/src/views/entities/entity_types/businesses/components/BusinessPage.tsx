"use client";

import EntityProfileBanner from "@/features/onboarding/components/entity_onboarding_form/entity_profile_banner";
import {
  useEntityDetails,
  useUserEntityClaims,
} from "@/views/entities/shared/hooks/entities_hooks";
import {
  ProfileHeader,
  ProfileDetailsCard,
  ProfileImagesGrid,
  ProfilePills,
} from "@/views/entities/shared/components/profile_components";
import { EntityNavButton } from "@/views/entities/shared/components/profile_components/entity_nav_button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Users, Map, MapIcon } from "lucide-react";
import { getEntityProfileDetailItems } from "@/views/entities/shared/utils/entity_items_resolver";
import {
  useEntityGallery,
  useEntityLogo,
} from "@/views/entities/shared/hooks/entities_media_hooks";
import { Button } from "@/components/ui/button";
import { CommunityIcon } from "@/icons/utility_icons";
import ShareButton from "@/features/share/components/share_button";
import ProfileOfferings from "@/features/offerings/components/profile_offerings";
import { ENTITY_PAGE } from "@/content/pages/views/entity_page";

interface BusinessPageProps {
  entityId: string;
}

const BusinessPage = ({ entityId }: BusinessPageProps) => {
  const { data: entity, isLoading, isError } = useEntityDetails(entityId);
  const { data: galleryData } = useEntityGallery(entityId);
  const { data: logoData } = useEntityLogo(entityId);
  const { user } = useAuthStore();
  const { data: userClaims } = useUserEntityClaims();
  const router = useRouter();
  const [requestPartnershipOpen, setRequestPartnershipOpen] = useState(false);

  const userEntityId =
    Array.isArray(userClaims) && userClaims.length > 0
      ? (userClaims[0] as any)?.entity_id
      : null;

  const isOwnEntity = Array.isArray(userClaims)
    ? userClaims.some((claim: any) => claim.entity_id === entityId)
    : false;
  const entityType = entity?.entity_type?.toLowerCase() || "business";
  const tags: string[] = Array.isArray((entity as any)?.tags)
    ? ((entity as any).tags as any[])
        .map((t) => t?.name ?? t?.tag?.name ?? t?.tag?.label ?? t?.label)
        .filter(Boolean)
    : [];

  const vibes: string[] = Array.isArray((entity as any)?.vibes)
    ? ((entity as any).vibes as any[])
        .map((v) => v?.name ?? v?.label)
        .filter(Boolean)
    : [];

  const items = useMemo(
    () =>
      entity
        ? getEntityProfileDetailItems(entity, { respectVisibility: false })
        : [],
    [entity]
  );
  // Public profile should render URLs, not S3 keys.
  // We fetch preview-ready URLs from the dedicated media endpoint (same pattern as thoughts).
  const images: string[] = Array.isArray(galleryData?.slots)
    ? (galleryData!.slots
        .map((s: any) => s.url)
        .filter(
          (u: any): u is string => typeof u === "string" && u.length > 0
        ) as string[])
    : [];

  return (
    <div className="min-h-screen bg-background w-full  ">
      <div className="w-full px-4 pt-4 pb-10">
        <div className="max-w-5xl mx-auto ">
          <EntityProfileBanner entityId={entityId} />
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground">
            {ENTITY_PAGE.loading}
          </div>
        ) : null}

        {isError || !entity ? (
          <div className="py-10 text-center text-destructive">
            {ENTITY_PAGE.error}
          </div>
        ) : null}

        {entity ? (
          <div className=" w-full space-y-4 content-center ">
            <ProfileHeader
              name={entity.name}
              subtitle={entity.description ?? ""}
              entityId={entityId}
              actionLabel={isOwnEntity ? "Edit Profile" : undefined}
              onActionClick={
                isOwnEntity
                  ? () =>
                      router.push(`/entities/${entityId}/${entityType}/profile`)
                  : undefined
              }
            />

            <div className="md:hidden">
              {" "}
              <ProfileDetailsCard items={items} />
            </div>

            <div className="space-x-2 flex">
              <ProfilePills
                title={ENTITY_PAGE.sections.tags}
                pills={tags}
                className=" text-primary"
                pillClassName="bg-primary-tint text-white"
              />
              <div className="hidden md:block">
                <ProfileDetailsCard items={items} />
              </div>
              <ProfilePills
                title={ENTITY_PAGE.sections.vibes}
                pills={vibes}
                className=" text-tertiary"
                pillClassName="bg-tertiary-tint text-white"
              />
            </div>

            <div className="space-y-3 pt-2  justify-center w-full flex ">
              <EntityNavButton
                label={ENTITY_PAGE.sections.community}
                href={`/explore/entity_communities/${entity.entity_community_slug}`}
                rightIcon
                mainIcon={<MapIcon />}
                className="bg-tertiary-tint text-tertiary  "
              />

              {/* <EntityNavButton
                label="Partners"
                href={`/entities/${entityId}/partnerships`}
                rightIcon
                className="bg-violet-50"
              /> */}

              <ShareButton
                destination={`/entities/${entityId}/${entityType}/profile`}
                modalTitle={`Share ${entity.name}`}
                label={ENTITY_PAGE.actions.share}
              />
            </div>

            {/* {user && userEntityId && !isOwnEntity ? (
              <>
                <Button
                  onClick={() => setRequestPartnershipOpen(true)}
                  className="bg-primary/10"
                  aria-label="Request Partnership"
                >
                  Request Partnership
                </Button>
                <RequestPartnershipModaL
                  inviterEntityId={userEntityId}
                  inviteeEntityId={entityId}
                  targetEntityName={entity.name}
                  open={requestPartnershipOpen}
                  onOpenChange={setRequestPartnershipOpen}
                />
              </>
            ) : null} */}

            <ProfileImagesGrid imageUrls={images} />
            <ProfileOfferings entityId={entityId} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BusinessPage;
