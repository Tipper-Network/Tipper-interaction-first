"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Users,
  Target,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AuthWizard from "@/features/auth/components/auth_wizard";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createUserInvite } from "@/features/share/api/share_api";
import { SHARE_TOKEN_STORAGE_KEY } from "@/features/share/types/share_types";
import socket from "@/lib/socket";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | "preview" // Community + entity story — restricted view
  | "interest" // Interested / Not Interested decision
  | "who-form" // Stranger describes themselves
  | "auth" // Inline auth (sign up) before submitting
  | "pending" // Community is voting — live WS updates
  | "outcome"; // Approved / Rejected

type VoteOutcome = "approved" | "rejected" | null;

interface WhoFormData {
  full_name: string;
  what_you_do: string;
  why_you_want_in: string;
}

// ─── Mock data (replace with GET /flows/initiation/preview/:token) ─────────────

const MOCK_COMMUNITY = {
  name: "The Hub",
  entity_name: "Tipper HQ",
  entity_slug: "tipper-hq",
  goal: "Build a community of builders who hold each other accountable and support local growth.",
  member_count: 12,
  is_private: true,
  story: {
    headline: "A co-working space that runs like a startup.",
    body: "The Hub is not just a place to work. It's a community of people building things that matter — products, businesses, relationships. We keep the door intentionally small so that the energy stays high and the trust stays real.\n\nEvery person in this room was invited by someone who believes in what they're building. If you're here, someone believes in you.",
    what_to_expect: [
      "High-speed private internet + quiet focus areas",
      "Weekly builder meetups — share what you're working on",
      "An accountability board everyone contributes to",
      "Direct access to the Tipper team and early communities",
    ],
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StorySegment({ story }: { story: typeof MOCK_COMMUNITY.story }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <h2 className="text-lg font-semibold text-foreground leading-snug pr-4">
          {story.headline}
        </h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </div>

      {expanded && (
        <div className="space-y-4 pt-1">
          {story.body.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {para}
            </p>
          ))}

          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-foreground uppercase tracking-wide">
              What to expect
            </p>
            <ul className="space-y-1.5">
              {story.what_to_expect.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function WhoForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: WhoFormData) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<WhoFormData>({
    full_name: "",
    what_you_do: "",
    why_you_want_in: "",
  });

  const valid =
    form.full_name.trim().length > 1 &&
    form.what_you_do.trim().length > 5 &&
    form.why_you_want_in.trim().length > 10;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">
          Tell us about yourself
        </h2>
        <p className="text-sm text-muted-foreground">
          The community will see this before they vote. Be honest.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Your name</Label>
          <Input
            id="full_name"
            placeholder="First and last name"
            value={form.full_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, full_name: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="what_you_do">What do you work on?</Label>
          <Input
            id="what_you_do"
            placeholder="e.g. I'm building a logistics app for small businesses"
            value={form.what_you_do}
            onChange={(e) =>
              setForm((f) => ({ ...f, what_you_do: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="why_you_want_in">Why do you want in?</Label>
          <Textarea
            id="why_you_want_in"
            placeholder="What draws you to this community specifically?"
            rows={3}
            value={form.why_you_want_in}
            onChange={(e) =>
              setForm((f) => ({ ...f, why_you_want_in: e.target.value }))
            }
          />
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!valid || isSubmitting}
        onClick={() => onSubmit(form)}
      >
        {isSubmitting ? "Submitting…" : "Submit my request"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function PendingStep({ communityName }: { communityName: string }) {
  const [votesFor, setVotesFor] = useState(0);
  const [votesAgainst, setVotesAgainst] = useState(0);
  const threshold = 3;
  const progress = Math.min((votesFor / threshold) * 100, 100);

  useEffect(() => {
    socket.on(
      "vote:cast",
      (data: { votes_for: number; votes_against: number }) => {
        setVotesFor(data.votes_for);
        setVotesAgainst(data.votes_against);
      }
    );
    return () => {
      socket.off("vote:cast");
    };
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Clock className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Waiting for the community
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Your request is with {communityName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Members are reviewing who you are. This usually takes a few minutes.
        </p>
      </div>

      <Card className="border border-border text-left">
        <CardContent className="pt-5 pb-5 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Community vote</span>
            </div>
            <Badge variant="secondary">
              {votesFor} / {threshold} approvals needed
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{votesFor} for</span>
              <span>{votesAgainst} against</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground border-t pt-3">
            You can leave this page — we&apos;ll reach out when they decide.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function OutcomeStep({ outcome }: { outcome: "approved" | "rejected" }) {
  if (outcome === "approved") {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            You&apos;re in.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The community approved your request. Your next step is to visit the
            space and scan the QR code at the entrance to complete your
            membership.
          </p>
        </div>
        <Card className="border border-border text-left">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              When you arrive at The Hub, scan the QR code at the door.
              That&apos;s your final check-in and unlocks the full community
              board.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <XCircle className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Not this time.</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The community reviewed your request and it wasn&apos;t the right fit
          right now. If someone in the space believes you&apos;re a fit, they
          can invite you again.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InviteLandingClient({ token }: { token: string }) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>("preview");
  const [whoData, setWhoData] = useState<WhoFormData | null>(null);
  const [outcome, setOutcome] = useState<VoteOutcome>(null);
  const hasLinked = useRef(false);

  // Persist token to localStorage on mount — survives auth reload
  useEffect(() => {
    try {
      localStorage.setItem(SHARE_TOKEN_STORAGE_KEY, token);
    } catch {}
  }, [token]);

  // WebSocket: outcome event
  useEffect(() => {
    if (step !== "pending") return;

    socket.on("invite:outcome", (data: { status: "APPROVED" | "REJECTED" }) => {
      const result = data.status.toLowerCase() as "approved" | "rejected";
      setOutcome(result);
      setStep("outcome");
    });

    return () => {
      socket.off("invite:outcome");
    };
  }, [step]);

  const { mutate: submitInvite, isPending: isSubmitting } = useMutation({
    mutationFn: () => createUserInvite(token, MOCK_COMMUNITY.entity_slug),
    onSuccess: () => {
      try {
        localStorage.removeItem(SHARE_TOKEN_STORAGE_KEY);
      } catch {}
      setStep("pending");
    },
    onError: () => {
      // Already invited — move to pending anyway
      setStep("pending");
    },
  });

  // After auth completes, if we have who-form data, submit the invite
  useEffect(() => {
    if (!user || hasLinked.current || !whoData) return;
    if (step !== "auth") return;
    hasLinked.current = true;
    submitInvite();
  }, [user, step, whoData, submitInvite]);

  function handleWhoFormSubmit(data: WhoFormData) {
    setWhoData(data);
    if (!user) {
      setStep("auth");
    } else {
      hasLinked.current = true;
      submitInvite();
    }
  }

  const community = MOCK_COMMUNITY;

  return (
    <div className="w-full max-w-md mx-auto pt-6 pb-16 space-y-6">
      {/* ── Step: Preview ──────────────────────────────────────────── */}
      {step === "preview" && (
        <>
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    You&apos;ve been invited to
                  </p>
                  <h1 className="text-2xl font-bold text-foreground">
                    {community.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {community.entity_name}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 mt-1">
                  Private
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span>{community.member_count} members</span>
              </div>

              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <p className="text-sm text-foreground leading-relaxed">
                  {community.goal}
                </p>
              </div>

              <div className="border-t pt-4">
                <StorySegment story={community.story} />
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            This is a private community. Only invited members can join.
          </p>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setStep("interest")}
          >
            I want to be part of this
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      )}

      {/* ── Step: Interest decision ────────────────────────────────── */}
      {step === "interest" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              Are you interested?
            </h2>
            <p className="text-sm text-muted-foreground">
              If yes, you&apos;ll fill a short form that the community reviews
              before voting on your request.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep("who-form")}
            >
              Yes, I&apos;m interested
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep("preview")}
            >
              Not right now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            No commitment yet — you&apos;re just submitting a request.
          </p>
        </div>
      )}

      {/* ── Step: Who form ─────────────────────────────────────────── */}
      {step === "who-form" && (
        <WhoForm onSubmit={handleWhoFormSubmit} isSubmitting={isSubmitting} />
      )}

      {/* ── Step: Auth (inline, after who form) ───────────────────── */}
      {step === "auth" && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Almost there</h2>
            <p className="text-sm text-muted-foreground">
              Create an account so the community can review your request and
              reach you when they decide.
            </p>
          </div>

          <div className="border border-border rounded-2xl p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              onClick={() => setStep("who-form")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
            <AuthWizard
              mode="signup"
              onSuccess={() => {
                // The useEffect watching `user` + `step === "auth"` will trigger submitInvite
              }}
              returnUrl={`/i/${token}`}
            />
          </div>
        </div>
      )}

      {/* ── Step: Pending ──────────────────────────────────────────── */}
      {step === "pending" && <PendingStep communityName={community.name} />}

      {/* ── Step: Outcome ──────────────────────────────────────────── */}
      {step === "outcome" && outcome && <OutcomeStep outcome={outcome} />}
    </div>
  );
}
