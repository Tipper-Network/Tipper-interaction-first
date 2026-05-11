"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { User, MapPin, ArrowRight, AlertCircle } from "lucide-react";
import { useUpdateUserProfile } from "@/views/users/hooks/users_hooks";
import {
  UserProfileSchema,
  type UserProfileFormData,
} from "@/features/onboarding/types/user_profile_schema";

interface ProfileData {
  first_name: string;
  last_name?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  date_of_birth?: string;
}

interface StepDataProps {
  data: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
  onNext: () => void;
}

export default function StepData({ data, onChange, onNext }: StepDataProps) {
  const {
    mutateAsync: updateProfile,
    isPending,
    error: mutationError,
  } = useUpdateUserProfile();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      bio: data.bio || "",
      avatarUrl: data.avatarUrl || "",
      location: data.location || "",
      date_of_birth: data.date_of_birth || "",
    },
  });

  const handleSubmit = async (formData: UserProfileFormData) => {
    try {
      // Save Step 1: Personal info
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        location: formData.location,
        date_of_birth: formData.date_of_birth,
      });
      // Move to next step after successful save
      onNext();
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Error will be handled by the mutation error state
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          Tell us about yourself
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          Let&apos;s start with the basics to personalize your experience
        </p>
      </div>

      {/* Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-medium-14 text-foreground">
                        First Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="p-medium-14 text-foreground">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="p-medium-14 text-foreground">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="p-medium-12 text-muted-foreground">
                      Optional: Share what you&apos;re passionate about
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="p-medium-14 text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="City, Country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {mutationError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="p-medium-12 text-destructive">
                    Failed to save. Please try again.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 sm:h-12 text-base sm:text-lg font-semibold disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Continue"}
                  {!isPending && (
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="mt-6 sm:mt-8 text-center">
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-muted rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-muted rounded-full"></div>
        </div>
        <p className="p-medium-10 sm:p-medium-12 text-muted-foreground mt-2">
          Step 1 of 3
        </p>
      </div>
    </div>
  );
}
