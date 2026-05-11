"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { X, Users, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthWizard from "@/features/auth/components/auth_wizard";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createUserInvite } from "@/features/share/api/share_api";
import { SHARE_TOKEN_STORAGE_KEY } from "@/features/share/types/share_types";

interface InviteLandingClientProps {
  token: string;
}

// TODO: Replace with real API call once backend /flows/initiation/preview/:token exists
const MOCK_COMMUNITY = {
  name: "The Hub",
  goal: "Build a community of builders who hold each other accountable and support local growth.",
  member_count: 12,
  entity_name: "Tipper HQ",
  is_private: true,
};

export default function InviteLandingClient({
  token,
}: InviteLandingClientProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const hasLinked = useRef(false);

  // Persist token to localStorage on mount — survives auth redirects
  useEffect(() => {
    try {
      localStorage.setItem(SHARE_TOKEN_STORAGE_KEY, token);
    } catch {
      // localStorage unavailable (private browsing) — acceptable degradation
    }
  }, [token]);

  const { mutate: linkInvite, isPending: isLinking } = useMutation({
    mutationFn: () => createUserInvite(token, MOCK_COMMUNITY.name),
    onSuccess: () => {
      try {
        localStorage.removeItem(SHARE_TOKEN_STORAGE_KEY);
      } catch {}
      router.push("/initiation/pending");
    },
    onError: () => {
      // If already invited, still move to pending — backend will handle the state
      router.push("/initiation/pending");
    },
  });

  // When user becomes authenticated (post-auth redirect back here), link the invite
  useEffect(() => {
    if (!user || hasLinked.current) return;
    hasLinked.current = true;
    linkInvite();
  }, [user, linkInvite]);

  const returnUrl = `/i/${token}`;

  if (isLinking) {
    return (
      <div className="w-full max-w-md mx-auto pt-8 text-center space-y-4">
        <p className="text-muted-foreground">Connecting you to the community…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-6 pb-12 space-y-6">
      {/* Community preview card */}
      <Card className="border border-border shadow-sm">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                You've been invited to
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                {MOCK_COMMUNITY.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                by {MOCK_COMMUNITY.entity_name}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 mt-1">
              Private
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{MOCK_COMMUNITY.member_count} members</span>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <Target className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <p className="text-sm text-foreground leading-relaxed">
              {MOCK_COMMUNITY.goal}
            </p>
          </div>

          <p className="text-xs text-muted-foreground border-t pt-3">
            This is a private community. The members will vote on your request
            to join.
          </p>
        </CardContent>
      </Card>

      {/* Auth CTA */}
      {!user ? (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setIsAuthOpen(true)}
          >
            Request to join
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You'll need an account. It takes under a minute.
          </p>
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground py-2">
          Linking your invite…
        </div>
      )}

      {/* Inline auth modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl p-8 w-full max-w-md relative shadow-lg">
            <Button
              onClick={() => setIsAuthOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
            <AuthWizard
              mode="signup"
              onSuccess={() => setIsAuthOpen(false)}
              returnUrl={returnUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
