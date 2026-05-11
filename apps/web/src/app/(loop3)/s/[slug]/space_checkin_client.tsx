"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useAuthModalStore } from "@/features/auth/stores/auth-modal-store";

type CheckinState = "idle" | "checking" | "success" | "not_invited" | "error";

// TODO: replace with POST /flows/visit/scan { community_slug }
async function recordVisit(_slug: string): Promise<{ ok: boolean; reason?: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  return { ok: true };
}

export default function SpaceCheckinClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { open: openAuthModal } = useAuthModalStore();
  const [state, setState] = useState<CheckinState>("idle");

  useEffect(() => {
    if (!user) return;

    setState("checking");

    recordVisit(slug)
      .then(({ ok, reason }) => {
        if (ok) {
          setState("success");
          // Give the success screen 1.8 s to read, then go to community board
          setTimeout(() => router.replace(`/c/${slug}`), 1800);
        } else if (reason === "not_invited") {
          setState("not_invited");
        } else {
          setState("error");
        }
      })
      .catch(() => setState("error"));
  }, [user, slug, router]);

  // Not signed in
  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto pt-16 pb-12 text-center space-y-5">
        <p className="text-sm text-muted-foreground">
          You need to be signed in to check in to this space.
        </p>
        <Button size="lg" className="w-full" onClick={() => openAuthModal("signin")}>
          Sign in to check in
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-16 pb-12">
      <Card className="border border-border shadow-sm">
        <CardContent className="pt-10 pb-10 flex flex-col items-center gap-5 text-center">

          {state === "idle" || state === "checking" ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">Checking you in…</p>
                <p className="text-sm text-muted-foreground">Just a moment.</p>
              </div>
            </>
          ) : state === "success" ? (
            <>
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-foreground">Welcome in.</p>
                <p className="text-sm text-muted-foreground">
                  Your visit has been recorded. Taking you to the community board…
                </p>
              </div>
            </>
          ) : state === "not_invited" ? (
            <>
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">You&apos;re not on the list.</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You haven&apos;t been invited to this community yet. Ask someone inside
                  to share an invite link with you.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">Something went wrong.</p>
                <p className="text-sm text-muted-foreground">
                    We couldn&apos;t record your visit. Try scanning the QR again.
                </p>
              </div>
              <Button variant="outline" onClick={() => setState("idle")}>
                Try again
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
