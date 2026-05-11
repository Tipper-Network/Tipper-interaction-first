"use client";

import { useState } from "react";
import {
  Target,
  Users,
  MessageSquare,
  ChevronRight,
  CheckSquare,
  Bell,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/features/auth/stores/auth-store";

// TODO: Replace with real GET /flows/visit/community/:slug
const MOCK_COMMUNITY = {
  name: "The Hub",
  entity_name: "Tipper HQ",
  goal: "Build a community of builders who hold each other accountable and support local growth.",
  member_count: 12,
  your_status: "member" as "member" | "invited" | "pending",
  accountability: {
    current_focus: "Each member ships at least one thing this week.",
    items: [
      { id: "1", author: "Alia K.", text: "Launch the landing page by Thursday.", done: true },
      { id: "2", author: "Omar N.", text: "Get 5 user interviews scheduled.", done: false },
      { id: "3", author: "Sara M.", text: "Write the first investor update draft.", done: false },
    ],
  },
  discussions: [
    { id: "1", title: "What are you building this week?", replies: 7, author: "The Hub" },
    { id: "2", title: "Resources for early-stage fundraising", replies: 3, author: "Alia K." },
    { id: "3", title: "Co-working schedule — May", replies: 2, author: "Tipper HQ" },
  ],
  announcements: [
    {
      id: "1",
      text: "Weekly builders meetup this Thursday at 7 PM. Add your update to the board before you come.",
      date: "May 12",
    },
    {
      id: "2",
      text: "New quiet room available — book via the schedule thread.",
      date: "May 10",
    },
  ],
};

export default function CommunityBoardClient({ slug: _slug }: { slug: string }) {
  const { user } = useAuthStore();
  const community = MOCK_COMMUNITY;
  const [tab, setTab] = useState("board");

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto pt-12 text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">Members only.</p>
        <p className="text-sm text-muted-foreground">
          Sign in to access the community board.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pt-8 pb-20 space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{community.name}</h1>
          <Badge variant="secondary">{community.member_count} members</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{community.entity_name}</p>
      </div>

      {/* Community goal */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="pt-4 pb-4 flex items-start gap-3">
          <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">{community.goal}</p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="board" className="flex-1">
            <CheckSquare className="h-4 w-4 mr-1.5" />
            Board
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex-1">
            <Bell className="h-4 w-4 mr-1.5" />
            Updates
          </TabsTrigger>
        </TabsList>

        {/* ── Accountability board ── */}
        <TabsContent value="board" className="space-y-4 pt-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">This week&apos;s focus</p>
              <p className="text-xs text-muted-foreground">
                {community.accountability.current_focus}
              </p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 ml-4">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add mine
            </Button>
          </div>

          <div className="space-y-2">
            {community.accountability.items.map((item) => (
              <Card
                key={item.id}
                className={`border ${item.done ? "bg-muted/30 opacity-70" : "bg-background"}`}
              >
                <CardContent className="pt-3 pb-3 flex items-start gap-3">
                  <CheckSquare
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      item.done ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="space-y-0.5 flex-1">
                    <p
                      className={`text-sm ${
                        item.done
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.author}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Discussions ── */}
        <TabsContent value="discussions" className="space-y-3 pt-3">
          <Button size="sm" variant="outline" className="w-full justify-start">
            <Plus className="h-3.5 w-3.5 mr-2" />
            Start a discussion
          </Button>
          {community.discussions.map((d) => (
            <button key={d.id} className="w-full text-left">
              <Card className="border hover:bg-muted/40 transition-colors cursor-pointer">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.author} · {d.replies} replies
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}
        </TabsContent>

        {/* ── Announcements ── */}
        <TabsContent value="announcements" className="space-y-3 pt-3">
          {community.announcements.map((a) => (
            <Card key={a.id} className="border border-border">
              <CardContent className="pt-4 pb-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      Announcement
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{a.text}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Members teaser */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{community.member_count} members in this community</span>
        </div>
        <Button variant="ghost" size="sm">
          View all
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>

    </div>
  );
}
