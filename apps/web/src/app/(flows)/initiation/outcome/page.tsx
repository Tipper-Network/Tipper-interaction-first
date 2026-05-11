"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function OutcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const isApproved = status === "approved";

  if (isApproved) {
    return (
      <div className="w-full max-w-md mx-auto pt-8 pb-12 space-y-6 text-center">
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">You're in.</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The community approved your request. You're now an invited member of
            The Hub. Your next step is to visit the space.
          </p>
        </div>

        <Card className="border border-border text-left">
          <CardContent className="pt-5 pb-5 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  What comes next
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  You're invited to visit the physical space. When you arrive,
                  scan the QR code at the entrance to check in and become a full
                  member.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/initiation/discover")}
        >
          See what's waiting for you
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Rejected or unknown status
  return (
    <div className="w-full max-w-md mx-auto pt-8 pb-12 space-y-6 text-center">
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <XCircle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Not this time.</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The community reviewed your request and decided it wasn't the right
          fit right now. That's okay — Tipper is still being built, and the
          right door will open.
        </p>
      </div>

      <Card className="border border-border text-left">
        <CardContent className="pt-5 pb-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This doesn't mean you can't be part of what's being built. Communities 
            grow and change. If someone in the space believes you're a fit, they 
            can invite you again.
          </p>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => router.push("/")}
      >
        Back to Tipper
      </Button>
    </div>
  );
}

export default function OutcomePage() {
  return (
    <Suspense fallback={<div className="pt-8 text-center text-muted-foreground">Loading…</div>}>
      <OutcomeContent />
    </Suspense>
  );
}
