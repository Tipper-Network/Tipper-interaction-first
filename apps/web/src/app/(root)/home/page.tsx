"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  MapPin,
  Heart,
  MessageCircle,
  Clock,
  Search,
} from "lucide-react";
import Link from "next/link";
import { fetchCommunities } from "@/views/communities/api/communities_api";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileBanner from "@/features/onboarding/components/user_onboarding_form/profile_banner";

interface Community {
  id: string;
  community_name: string;
  users_count: number;
  slug: string;
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();
  const [recommendedCommunities, setRecommendedCommunities] = useState<
    Community[]
  >([]);
  const [trendingCommunities, setTrendingCommunities] = useState<Community[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setIsLoading(true);
        // Fetch recommended communities (active ones)
        const recommended = await fetchCommunities({
          page: 1,
          limit: 6,
          statuses: [],
          filterMode: "exclude",
        });
        setRecommendedCommunities(recommended.items || []);

        // Fetch trending communities (could be sorted by users_count or activity)
        const trending = await fetchCommunities({
          page: 1,
          limit: 4,
          statuses: [],
          filterMode: "exclude",
        });
        setTrendingCommunities(trending.items || []);
      } catch (error) {
        console.error("Failed to load communities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadCommunities();
    }
  }, [user]);

  const firstName =
    profile?.first_name || user?.email?.split("@")[0] || "there";
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Please sign in to view your home page
            </p>
            <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="h2-bold sm:h1-bold text-foreground mb-2">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="p-regular-16 text-muted-foreground">
              Discover communities and connect with like-minded people
            </p>
          </div>
          <Button
            onClick={() => router.push("/explore")}
            className="hidden sm:flex items-center gap-2"
            variant="outline"
          >
            <Search className="h-4 w-4" />
            Explore
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="p-medium-12 text-muted-foreground mb-1">
                  Quick Action
                </p>
                <h3 className="h3-bold text-foreground">Explore</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => router.push("/explore")}
            >
              Browse Communities <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="p-medium-12 text-muted-foreground mb-1">Create</p>
                <h3 className="h3-bold text-foreground">Community</h3>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => router.push("/explore")}
            >
              Start Building <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-tertiary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="p-medium-12 text-muted-foreground mb-1">
                  Your Profile
                </p>
                <h3 className="h3-bold text-foreground">View</h3>
              </div>
              <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-tertiary" />
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => router.push("/users/profile")}
            >
              See Profile <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="p-medium-12 text-muted-foreground mb-1">
                  Discover
                </p>
                <h3 className="h3-bold text-foreground">Businesses</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => router.push("/explore?tab=businesses")}
            >
              Find Places <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="max-w-5xl mx-auto">
        <ProfileBanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content - Recommended Communities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Communities */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>Recommended for You</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/explore")}
                >
                  See All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <p className="p-regular-14 text-muted-foreground mt-2">
                Communities that match your interests and values
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recommendedCommunities.length > 0 ? (
                <div className="space-y-3">
                  {recommendedCommunities.map((community) => (
                    <Link
                      key={community.id}
                      href={`/explore/entity_communities/${community.slug}`}
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="p-medium-16 text-foreground mb-1">
                              {community.community_name}
                            </h3>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="p-medium-10"
                              >
                                <Users className="h-3 w-3 mr-1" />
                                {community.users_count || 0} members
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="p-regular-16 text-muted-foreground mb-4">
                    No recommendations yet
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/explore")}
                  >
                    Explore Communities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed Placeholder */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <p className="p-regular-14 text-muted-foreground mt-2">
                Latest posts and updates from your communities
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="p-regular-16 text-muted-foreground mb-4">
                  Join communities to see activity here
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/explore")}
                >
                  Discover Communities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Communities */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-tertiary" />
                <CardTitle>Trending</CardTitle>
              </div>
              <p className="p-regular-14 text-muted-foreground mt-2">
                Popular communities right now
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : trendingCommunities.length > 0 ? (
                <div className="space-y-3">
                  {trendingCommunities.map((community, index) => (
                    <Link
                      key={community.id}
                      href={`/explore/entity_communities/${community.slug}`}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex-shrink-0 w-8 h-8 bg-tertiary/10 rounded-full flex items-center justify-center">
                          <span className="p-medium-12 text-tertiary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="p-medium-14 text-foreground truncate">
                            {community.community_name}
                          </h4>
                          <p className="p-regular-12 text-muted-foreground">
                            {community.users_count || 0} members
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="p-regular-14 text-muted-foreground text-center py-4">
                  No trending communities
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tips & Info */}
          <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Get Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-semibold">
                      1
                    </span>
                  </div>
                  <p className="p-regular-14 text-foreground">
                    Complete your profile to get better recommendations
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary text-xs font-semibold">
                      2
                    </span>
                  </div>
                  <p className="p-regular-14 text-foreground">
                    Join communities that match your interests
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-tertiary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-tertiary text-xs font-semibold">
                      3
                    </span>
                  </div>
                  <p className="p-regular-14 text-foreground">
                    Engage with posts and connect with members
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
