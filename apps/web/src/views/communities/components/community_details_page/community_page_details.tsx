"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Users, MessageCircle, TrendingUp, Tag, Building } from "lucide-react";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";
import {
  EntityCommunityStatus__Enum,
  EntityType__Enum,
  RequestClaimStatus__Enum,
  } from "@tipper/shared";
import LogoViewComponent from "@/components/logo_view_component";
import CommunityMetricsButton from "./communtiy_details_components/community_metrics_button";
import { CommunityDisclaimer } from "./communtiy_details_components/community_disclaimer";
import JoinCommunityButton from "./communtiy_details_components/community_join_button";
import { EntityNavButton } from "@/views/entities/shared/components/profile_components/entity_nav_button";

interface CommunityPageDetailsProps {
  data: any;
  userClaim?: {
    id: string;
    claim_status: RequestClaimStatus__Enum;
  } | null;
  onJoin: () => void;
  has_joined: boolean;
  communityId: string;
  entityId: string;
}

const CommunityPageDetails = ({
  entityId,
  communityId,
  data,
  userClaim,
  onJoin,
  has_joined,
}: CommunityPageDetailsProps) => {
  const {
    community_name,
    description,
    entity_type,
    slug,
    users_count,
    interests,
    community_status,
    trending,
    active,
    membership_status,
    hasVisited = false,
  } = data;

  const entity = useEntityDetails(data.entity_id, 1000 * 60 * 5); // 5 minutes cache
  const entity_name = entity.data?.name;
  const entitySlug = entity.data?.slug;

  // Check if community is acknowledged (CLAIMED status)
  const isAcknowledged =
    community_status === EntityCommunityStatus__Enum.CLAIMED;
  const claimStatus = userClaim?.claim_status;
  const entityType =
    EntityType__Enum[entity.data?.entity_type as keyof typeof EntityType__Enum];
  console.log("entityType: ", entityType);
  return (
    <div className="w-full bg-white rounded-xl border border-border shadow-sm  mb-6">
      {/* Logo - Centered at top */}
      <div className="flex justify-center my-4">
        <LogoViewComponent
          entityId={data.entity_id}
          entity_name={entity_name || "Community"}
        />
      </div>

      {/* Title - Reddish-pink */}
      <h1 className="text-2xl font-bold text-center mb-2 text-primary">
        {entity_name || "Entity"} - Community
      </h1>

      {/* Description - Light gray */}
      <p className="text-sm text-gray-500 text-center mb-6">
        {description || "No description provided"}
      </p>

      <JoinCommunityButton
        hasVisited={hasVisited}
        onJoin={onJoin}
        has_joined={has_joined}
        membershipStatus={membership_status}
      />
      <CommunityMetricsButton
        users_count={users_count}
        active_count={active}
        trending_count={trending}
        interests_count={interests}
      />
      <div className="flex justify-center">
        {claimStatus === RequestClaimStatus__Enum.APPROVED && (
          <EntityNavButton
            href={`/explore/entities/${entityType}/${entitySlug}`}
            leftIcon
            mainIcon={<Building className="h-4 w-4" />}
            className="bg-primary-tint text-primary"
            label="Space Profile "
          />
        )}
      </div>

      {/* Disclaimer Strip - Light purple background */}
      <div className="">
        <CommunityDisclaimer
          title="Disclaimer"
          community_status={community_status}
          entity_name={entity_name || "Entity"}
          entity_id={entityId}
          community_id={communityId}
          claim_status={claimStatus}
        />
      </div>
    </div>
  );
};

export default CommunityPageDetails;
