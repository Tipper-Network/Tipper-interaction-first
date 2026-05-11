import { Badge } from "@/components/ui/badge";
import { EntityCommunityStatus__Enum } from "@tipper/shared";
import { CheckCircle2, XCircle, Clock, LucideIcon } from "lucide-react";

export type StatusBadgeConfig = {
  label: string;
  variant: "default" | "secondary" | "destructive";
  icon: LucideIcon;
  className?: string;
};

/**
 * This function is used to get the status badge configuration for a given status
 * Returns label, variant, icon, and className to avoid duplicating badge logic
 * @param status
 * @returns StatusBadgeConfig with all badge properties
 */
export const getStatusBadge = (
  status: EntityCommunityStatus__Enum
): StatusBadgeConfig => {
  switch (status) {
    case EntityCommunityStatus__Enum.PENDING_APPROVAL:
      return {
        label: "Pending Approval",
        variant: "secondary",
        icon: Clock,
      };
    case EntityCommunityStatus__Enum.PENDING_VERIFICATION:
      return {
        label: "Pending Verification",
        variant: "secondary",
        icon: Clock,
      };
    case EntityCommunityStatus__Enum.UNCLAIMED:
      return {
        label: "Unclaimed",
        variant: "default",
        icon: CheckCircle2,
        className: "bg-tertiary-tint text-tertiary",
      };
    case EntityCommunityStatus__Enum.CLAIMED:
      return {
        label: "Claimed",
        variant: "default",
        icon: CheckCircle2,
      };
    case EntityCommunityStatus__Enum.REJECTED:
      return {
        label: "Rejected",
        variant: "destructive",
        icon: XCircle,
      };
    default:
      return {
        label: "Unknown",
        variant: "secondary",
        icon: Clock,
      };
  }
};

interface StatusBadgeProps {
  status: EntityCommunityStatus__Enum;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const badgeConfig = getStatusBadge(status);
  const Icon = badgeConfig.icon;

  return (
    <Badge
      variant={badgeConfig.variant}
      className={badgeConfig.className || className}
    >
      <Icon className="h-3 w-3 mr-1" />
      {badgeConfig.label}
    </Badge>
  );
}
