"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Users,
  Target,
  MessageSquare,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useAuthModalStore } from "@/features/auth/stores/auth-modal-store";

interface SpaceLandingClientProps {
  slug: string;
}

type MemberStatus = "visitor" | "invited_member" | "full_member" | "non_member";

// TODO: Replace with real GET /spaces/:slug response once backend exists
const MOCK_SPACE = {
  community_name: "The Hub",
  entity_name: "Tipper HQ",
  goal: "Build a community of builders who hold each other accountable.",
  member_count: 12,
  active_now: 3,
  board_items: [
    {
      id: "1",
      type: "goal",
      title: "March Accountability Board",
      author: "Tipper HQ",
      locked: false,
    },
    {
      id: "2",
      type: "discussion",
      title: "What are you building this week?",
      author: "Members",
      locked: false,
    },
    {
      id: "3",
      type: "resource",
      title: "Co-working schedule + booking",
      author: "Tipper HQ",
      locked: true,
    },
  ],
};

function useMemberStatus(): MemberStatus {
  // TODO: derive real status from useAuthStore + invite status API
  const { user } = useAuthStore();
  if (!user) return "non_member";
  return "visitor"; // placeholder until backend resolves real membership
}

export default function SpaceLandingClient({
  slug: _slug,
}: SpaceLandingClientProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { open: openAuthModal } = useAuthModalStore();
  const memberStatus = useMemberStatus();
  const [checkedIn, setCheckedIn] = useState(false);

  // Auto-trigger check-in for invited members who scan the space QR
  useEffect(() => {
    if (memberStatus === "invited_member" && !checkedIn) {
      // TODO: POST /spaces/:slug/checkin to confirm visit
      setCheckedIn(true);
    }
  }, [memberStatus, checkedIn]);

  const isLocked = memberStatus === "non_member";
  const canInteract =
    memberStatus === "full_member" || memberStatus === "invited_member";

  return (
    <div className="max-w-lg mx-auto pt-8 pb-16 px-4 space-y-6">
      {/* Space header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            {MOCK_SPACE.community_name}
          </h1>
          {memberStatus === "full_member" && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{MOCK_SPACE.entity_name}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{MOCK_SPACE.member_count} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{MOCK_SPACE.active_now} here now</span>
          </div>
        </div>
      </div>

      {/* Community goal */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="pt-4 pb-4 flex items-start gap-3">
          <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">
            {MOCK_SPACE.goal}
          </p>
        </CardContent>
      </Card>

      {/* Check-in banner for invited members */}
      {memberStatus === "invited_member" && checkedIn && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Welcome — you're checked in!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your visit has been recorded. You're now a full member.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community board */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Community Board
        </h2>
        {MOCK_SPACE.board_items.map((item) => {
          const locked = item.locked && !canInteract;
          return (
            <button
              key={item.id}
              disabled={locked}
              onClick={() => {
                if (locked) return;
                // TODO: navigate to board item detail
              }}
              className="w-full text-left"
            >
              <Card
                className={`border transition-colors ${
                  locked
                    ? "bg-muted/20 opacity-60"
                    : "hover:bg-muted/40 cursor-pointer"
                }`}
              >
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.author}
                      </p>
                    </div>
                  </div>
                  {locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* CTA for non-members */}
      {isLocked && (
        <div className="pt-2 space-y-3">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              Members only
            </Badge>
            <p className="text-sm text-muted-foreground">
              This is a private community. You need an invitation to participate.
            </p>
          </div>

          {!user ? (
            <Button
              size="lg"
              className="w-full"
              onClick={() => openAuthModal("signin")}
            >
              Sign in to check your invite
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to Tipper
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
