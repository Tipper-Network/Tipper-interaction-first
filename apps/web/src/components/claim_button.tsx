"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getEntityClaimRequestUrl } from "@/views/entities/shared/utils/entity_routes";
import { ToolTipWrapper } from "./toolTip_Wrapper";

interface ClaimButtonProps {
  entity_id?: string;
  community_id?: string;
  disabled?: boolean;
  label?: string;
  tooltipTitle?: string;
}

const ClaimButton = ({
  disabled,
  entity_id,
  community_id,
  label = "Claim",
  tooltipTitle,
}: ClaimButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!entity_id || !community_id) {
      console.error("[ClaimButton] Missing required IDs:", {
        entity_id,
        community_id,
      });
      return;
    }
    const url = getEntityClaimRequestUrl(entity_id, community_id);
    console.log("[ClaimButton] Navigating to:", url);
    router.push(url);
  };

  return (
    <div>
      <ToolTipWrapper
        tooltipTitle={tooltipTitle || "Claim this community"}
        variant="clickable"
        disabled={disabled}
        notSignedInMessage={"you have to be signed in to claim this community"}
      >
        <Button
          variant="outline"
          size="icon"
          className={`w-fit px-2 flex items-center ${disabled && "cursor-not-allowed  no-pointer-events opacity-50"}`}
          onClick={handleClick}
          disabled={disabled}
        >
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{label}</span>
        </Button>
      </ToolTipWrapper>
    </div>
  );
};

export default ClaimButton;
