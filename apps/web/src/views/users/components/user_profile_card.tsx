"use client";

import { useUserProfile } from "../hooks/users_hooks";
import Image from "next/image";
import { MapPin, Calendar, Star, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UserProfileCard = () => {
  const { data: profile, isLoading, isError, error } = useUserProfile();

  if (isLoading)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <p className="p-medium-16 text-destructive">Error loading profile</p>
      </div>
    );

  // Handle null profile (user hasn't created profile yet)
  if (!profile) {
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <p className="p-medium-16 text-muted-foreground">
          Profile not set up yet. Please complete onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm sticky top-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl text-foreground">Profile</h2>
        <Button
          variant="ghost"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="text-center mb-6">
        <div className="relative inline-block">
          <Image
            src={
              profile.avatarUrl ||
              "/assets/icons/Tipper_Icons_People_Transparent_Ruby.svg"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-border"
            width={96}
            height={96}
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <h3 className="h3-bold text-foreground mt-4">
          {profile.first_name} {profile.last_name}
        </h3>
        <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
          <MapPin className="h-4 w-4" />
          <span className="p-medium-14">{profile.location}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="p-regular-16 text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="p-medium-16 text-foreground">Reputation</span>
          </div>
          <span className="p-bold-16 text-primary">{profile.reputation}</span>
        </div>
        {profile.date_of_birth && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="p-medium-16 text-foreground">Birthday</span>
            </div>
            <span className="p-medium-16 text-muted-foreground">
              {new Date(profile.date_of_birth).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <Button className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors p-medium-16">
          Edit Profile
        </Button>
        <Button className="w-full border border-border text-foreground px-4 py-3 rounded-lg hover:bg-muted transition-colors p-medium-16">
          Settings
        </Button>
      </div>
    </div>
  );
};
