"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { EntityCommunityStatus__Enum } from "@tipper/shared";
import { RequestClaimStatus__Enum } from "@tipper/shared";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEntityDetails,
  useUserEntities,
} from "@/views/entities/shared/hooks/entities_hooks";
import { getEntityProfileUrl } from "@/views/entities/shared/utils/entity_routes";
import { useEntityClaimByID } from "@/views/entities/admin/hooks/admin_entities_hooks";
import ClaimButton from "@/components/claim_button";

interface DisclaimerProps {
  title?: string;
  community_status: EntityCommunityStatus__Enum;
  claim_status?: RequestClaimStatus__Enum;
  entity_name: string;
  dismissId?: string;
  entity_id?: string;
  community_id?: string;
}

export function CommunityDisclaimer({
  title = "Disclaimer",
  dismissId,
  entity_name,
  community_status = EntityCommunityStatus__Enum.UNCLAIMED,
  claim_status,
  entity_id,
  community_id,
}: DisclaimerProps) {
  const [visible, setVisible] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignedIn = !!user;
  const isClaimAction = searchParams?.get("action") === "claim";
  const isClaimApproved = claim_status === RequestClaimStatus__Enum.APPROVED;

  // Fetch entity details to get entity_type for profile URL
  const { data: entity } = useEntityDetails(entity_id || "");

  // Fetch user's entities to check if they have a role in this entity
  const { data: userEntities } = useUserEntities();

  // Check if the user has a role/position in this entity
  const userHasRoleInEntity =
    isSignedIn &&
    userEntities?.some((userEntity) => userEntity.entity.id === entity_id);

  // Fetch user's claims to check if they are the one who made the approved claim
  const { data: entityClaimResponse } = useEntityClaimByID(entity_id || "");
  // Check if the signed-in user is the one who made the approved claim
  // Backend returns { claim: <claim object> | [] }
  // If claim is an array (empty), no claims exist. If it's an object, check if user matches

  const isUserTheClaimer = entityClaimResponse?.user?.email === user?.email;

  const getCommunityStatusContent = (status: EntityCommunityStatus__Enum) => {
    switch (status) {
      case EntityCommunityStatus__Enum.PENDING_APPROVAL:
        return {
          description: (
            <p>
              &quot; A claim for{" "}
              <span className="text-tertiary text-lg">{entity_name}</span> is
              currently{" "}
              <span className="text-primary text-lg">
                pending approval From Tipper
              </span>
              . &quot;
            </p>
          ),
          tooltipTitle: "Community is pending approval",
          showClaimButton: false,
        };
      case EntityCommunityStatus__Enum.PENDING_VERIFICATION:
        return {
          description: (
            <p>
              &quot; A claim for{" "}
              <span className="text-tertiary text-lg">{entity_name}</span> is
              currently <span className="text-primary ">under review</span>.
              &quot;
            </p>
          ),
          tooltipTitle: "Claim pending review",
          showClaimButton: false,
        };
      case EntityCommunityStatus__Enum.CLAIMED:
        return {
          description: (
            <p>
              &quot; {entity_name} has{" "}
              <span className="text-tertiary text-lg  ">Acknowledged </span>{" "}
              this community &quot;
            </p>
          ),
          tooltipTitle: "Community claimed",
          showClaimButton: false,
        };

      default:
        return {
          description: (
            <p>
              &quot; This is an{" "}
              <span className="text-tertiary text-lg   ">Unofficial </span>
              community, initiated by members &quot;
            </p>
          ),
          tooltipTitle: "Claim this community",
          showClaimButton: true,
        };
    }
  };

  const getClaimButtonState = (
    status: RequestClaimStatus__Enum | undefined
  ) => {
    switch (status) {
      case RequestClaimStatus__Enum.PENDING:
        return {
          show: true,
          label: "Claim pending",
          disabled: true,
          tooltip: "Your claim is under review",
        };
      case RequestClaimStatus__Enum.DENIED:
        return {
          show: true,
          label: "Resubmit claim",
          disabled: false,
          tooltip: "Previous claim was denied. You can resubmit.",
        };
      case RequestClaimStatus__Enum.APPROVED:
        return {
          show: false,
          label: "Claim approved",
          disabled: true,
          tooltip: "Claim already approved",
        };
      default:
        return {
          show: true,
          label: "Claim community",
          disabled: false,
          tooltip: "Claim this community",
        };
    }
  };

  const statusContent = getCommunityStatusContent(community_status);
  const claimButtonState = getClaimButtonState(claim_status);

  useEffect(() => {
    if (!dismissId) return;
    const dismissed = localStorage.getItem(`disclaimer_dismissed_${dismissId}`);
    if (dismissed === "true") setVisible(false);
  }, [dismissId]);

  const dismiss = () => {
    if (dismissId) {
      localStorage.setItem(`disclaimer_dismissed_${dismissId}`, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Alert className="bg-primary-tint  text-primary-shade  pb-1 lg:pr-12">
      <div className="  ">
        <div className="flex  items-center justify-between">
          <div className="flex gap-2">
            {" "}
            <AlertTitle className="text-md md:text-lg text-tertiary font-semibold ">
              {title}:
            </AlertTitle>
            <AlertDescription className=" hidden lg:block  ">
              {statusContent.description}
            </AlertDescription>
          </div>

          <div>
            {entity_id && userHasRoleInEntity ? (
              <div className="">
                <Button
                  onClick={() =>
                    router.push(
                      getEntityProfileUrl(entity_id, entity?.entity_type)
                    )
                  }
                  className="bg-primary hover:bg-primary/90"
                >
                  Manage Entity Profile
                </Button>
              </div>
            ) : (
              community_status !== EntityCommunityStatus__Enum.CLAIMED &&
              claimButtonState.show &&
              (statusContent.showClaimButton || !!claim_status) && (
                <div className="">
                  {/* Show ClaimButton only if arrived via the email link (?action=claim)
                      or if the user already has a claim in progress (PENDING / DENIED).
                      Otherwise prompt them to check their business email. */}
                  {isClaimAction || !!claim_status ? (
                    <ClaimButton
                      disabled={!isSignedIn || claimButtonState.disabled}
                      entity_id={entity_id}
                      community_id={community_id}
                      label={claimButtonState.label}
                      tooltipTitle={claimButtonState.tooltip}
                    />
                  ) : (
                    <p className="text-xs text-primary-shade text-right max-w-[180px]">
                      Check your business email to claim this community.
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <AlertDescription className="lg:hidden block  ">
          {statusContent.description}
        </AlertDescription>
      </div>

      {dismissId && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-yellow-900 hover:text-yellow-700"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
}
