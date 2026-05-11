"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import socket from "@/lib/socket";

type VoteOutcome = "APPROVED" | "REJECTED" | null;

// TODO: Replace mock data with real invite status from GET /flows/initiation/status
const MOCK_VOTE_STATE = {
  community_name: "The Hub",
  votes_for: 0,
  votes_against: 0,
  threshold: 3,
};

export default function PendingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [voteState, setVoteState] = useState(MOCK_VOTE_STATE);
  const [outcome, setOutcome] = useState<VoteOutcome>(null);

  // Guard: must be authenticated to reach this page
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  // WebSocket: listen for vote events on this user's invite
  // TODO: join room with real invite_id once backend is wired
  useEffect(() => {
    socket.on("vote:cast", (data: { votes_for: number; votes_against: number }) => {
      setVoteState((prev) => ({ ...prev, ...data }));
    });

    socket.on("invite:outcome", (data: { status: "APPROVED" | "REJECTED" }) => {
      setOutcome(data.status);
      setTimeout(() => {
        router.push(`/initiation/outcome?status=${data.status.toLowerCase()}`);
      }, 1500);
    });

    return () => {
      socket.off("vote:cast");
      socket.off("invite:outcome");
    };
  }, [router]);

  const progress = Math.min(
    (voteState.votes_for / voteState.threshold) * 100,
    100
  );

  if (outcome) {
    return (
      <div className="w-full max-w-md mx-auto pt-12 text-center space-y-4">
        {outcome === "APPROVED" ? (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        ) : (
          <XCircle className="h-16 w-16 text-muted-foreground mx-auto" />
        )}
        <p className="text-lg font-medium">
          {outcome === "APPROVED" ? "You're in!" : "Not this time."}
        </p>
        <p className="text-sm text-muted-foreground">Taking you there…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-8 pb-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary mb-3">
          <Clock className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Waiting for the community
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Your request is with {voteState.community_name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Members are reviewing your request. This usually takes a few minutes.
        </p>
      </div>

      <Card className="border border-border">
        <CardContent className="pt-6 pb-6 space-y-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Community vote</span>
            </div>
            <Badge variant="secondary">
              {voteState.votes_for} / {voteState.threshold} approvals needed
            </Badge>
          </div>

          {/* Vote progress bar */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{voteState.votes_for} for</span>
              <span>{voteState.votes_against} against</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground border-t pt-4">
            You'll be notified here as soon as the community decides. You can
            leave this page — we'll reach out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
