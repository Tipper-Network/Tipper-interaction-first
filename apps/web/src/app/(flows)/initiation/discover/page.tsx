"use client";

import { useRouter } from "next/navigation";
import { MapPin, Users, Target, QrCode, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// TODO: Replace with real community data from GET /flows/initiation/community-preview
const MOCK_COMMUNITY = {
  name: "The Hub",
  entity_name: "Tipper HQ",
  location: "Amman, Jordan",
  goal: "Build a community of builders who hold each other accountable and support local growth.",
  member_count: 12,
  upcoming_events: [
    {
      id: "1",
      title: "Weekly Builders Meetup",
      date: "This Thursday · 7 PM",
    },
    {
      id: "2",
      title: "Accountability Check-In",
      date: "Friday · 10 AM",
    },
  ],
};

export default function DiscoverPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto pt-6 pb-12 space-y-6">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Loop 2 — Your Invitation
        </p>
        <h1 className="text-2xl font-bold text-foreground">
          Here's what you're joining
        </h1>
        <p className="text-sm text-muted-foreground">
          You've been approved. Take a look before you visit.
        </p>
      </div>

      {/* Community overview */}
      <Card className="border border-border">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {MOCK_COMMUNITY.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {MOCK_COMMUNITY.entity_name}
              </p>
            </div>
            <Badge variant="outline">Private</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{MOCK_COMMUNITY.location}</span>
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
        </CardContent>
      </Card>

      {/* What's coming up */}
      {MOCK_COMMUNITY.upcoming_events.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">What's happening</h3>
          <div className="space-y-2">
            {MOCK_COMMUNITY.upcoming_events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.date}
                  </p>
                </div>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Full access unlocks when you visit the space.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3 pt-2">
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/")}
        >
          <QrCode className="mr-2 h-4 w-4" />
          I'm ready — scan me in
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          When you arrive at the space, scan the QR code at the entrance to
          check in and complete your membership.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => router.push("/")}
        >
          Back to home
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
