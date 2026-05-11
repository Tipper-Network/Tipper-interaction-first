"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPendingInvites } from "../api/initiation_api";
import {
  PendingInviteStatus_Enum,
  type PendingInvite,
} from "../types/initiation_types";

const STATUS_CONFIG: Record<
  PendingInviteStatus_Enum,
  { label: string; icon: React.ReactNode; variant: "secondary" | "outline" | "destructive" }
> = {
  [PendingInviteStatus_Enum.WAITING]: {
    label: "Waiting for vote",
    icon: <Clock className="h-3 w-3" />,
    variant: "secondary",
  },
  [PendingInviteStatus_Enum.APPROVED]: {
    label: "Approved",
    icon: <CheckCircle className="h-3 w-3" />,
    variant: "outline",
  },
  [PendingInviteStatus_Enum.REJECTED]: {
    label: "Rejected",
    icon: <XCircle className="h-3 w-3" />,
    variant: "destructive",
  },
  [PendingInviteStatus_Enum.EXPIRED]: {
    label: "Expired",
    icon: <Timer className="h-3 w-3" />,
    variant: "secondary",
  },
};

function InviteCard({ invite }: { invite: PendingInvite }) {
  const config = STATUS_CONFIG[invite.status];

  return (
    <Card className="border border-border">
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {invite.invitee_name ?? "Waiting for them to scan…"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {invite.why_initiating}
            </p>
          </div>
          <Badge
            variant={config.variant}
            className="shrink-0 flex items-center gap-1"
          >
            {config.icon}
            {config.label}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {new Date(invite.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}

interface PendingInvitesPanelProps {
  community_id: string;
  /** External refetch trigger — increment to force a reload */
  refetchTrigger?: number;
}

export default function PendingInvitesPanel({
  community_id,
  refetchTrigger,
}: PendingInvitesPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ["pending-invites", community_id, refetchTrigger],
    queryFn: () => getPendingInvites(community_id),
  });

  if (isLoading) return null;
  if (invites.length === 0) return null;

  const waiting = invites.filter(
    (i) => i.status === PendingInviteStatus_Enum.WAITING
  ).length;

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-between px-0 hover:bg-transparent"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-sm font-medium text-foreground">
          Your invites
          {waiting > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {waiting} pending
            </Badge>
          )}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {expanded && (
        <div className="space-y-2">
          {invites.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
}
