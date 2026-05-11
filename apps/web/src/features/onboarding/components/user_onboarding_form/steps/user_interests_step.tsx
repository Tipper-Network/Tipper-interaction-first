"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { fetchInterests } from "../../../api/onboarding_api";
import { updateUserInterests } from "@/views/users/api/users_api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { toast } from "sonner";

interface InterestCategory {
  interest_category: string;
  interests: { id: string; interest_name: string }[];
}

interface SelectedInterest {
  id: string;
  interest_name: string;
  interest_category: string;
}

export default function StepInterests({
  onComplete,
  existingInterests = [],
}: {
  onComplete?: () => void;
  existingInterests?: SelectedInterest[];
}) {
  const [interests, setInterests] = useState<InterestCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selected, setSelected] =
    useState<SelectedInterest[]>(existingInterests);
  const refetch = useAuthStore((s) => s.refetch);
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_CATEGORIES_LIMIT = 6;

  useEffect(() => {
    // Only fetch interests if user is authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadInterests = async () => {
      try {
        const data = await fetchInterests();
        // Ensure data is an array
        if (Array.isArray(data) && data.length > 0) {
          setInterests(data);
          setSelectedCategory(data[0]?.interest_category || "");
        } else if (Array.isArray(data) && data.length === 0) {
          console.warn("Interests API returned empty array");
          setInterests([]);
        } else {
          console.error(
            "Invalid interests data format - expected array, got:",
            typeof data,
            data
          );
          setInterests([]);
          toast.error("Failed to load interests. Invalid data format.");
        }
      } catch (error) {
        console.error("Failed to fetch interests:", error);
        setInterests([]);
        toast.error("Failed to load interests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInterests();
  }, [user]);

  // Sync selected interests when existingInterests changes (e.g., modal reopened)
  // Match existing interests with API interests to get correct IDs
  useEffect(() => {
    if (existingInterests.length > 0 && interests.length > 0) {
      const matchedInterests = existingInterests.map((existing) => {
        // Find matching interest in loaded interests by name
        const matched = interests
          .flatMap((cat) => cat.interests)
          .find(
            (apiInterest) =>
              apiInterest.interest_name === existing.interest_name
          );

        return {
          ...existing,
          id: matched?.id || existing.id || String(Math.random()), // Use matched ID or fallback
        };
      });
      setSelected(matchedInterests);
    } else if (existingInterests.length > 0) {
      // If interests haven't loaded yet, store them temporarily
      setSelected(existingInterests);
    } else {
      setSelected([]);
    }
  }, [existingInterests, interests]);

  const toggleInterest = (
    interest: { id: string; interest_name: string },
    category: string
  ) => {
    // Match by interest_name since backend doesn't return IDs for existing interests
    const isSelected = selected.some(
      (item) => item.interest_name === interest.interest_name
    );

    if (isSelected) {
      setSelected(
        selected.filter((item) => item.interest_name !== interest.interest_name)
      );
    } else {
      setSelected([...selected, { ...interest, interest_category: category }]);
    }
  };

  const handleSubmit = async () => {
    if (selected.length < 3) return;

    // Get correct IDs by matching interest names with loaded interests
    const interest_ids = selected
      .map((selectedInterest) => {
        const matched = interests
          .flatMap((cat) => cat.interests)
          .find(
            (apiInterest) =>
              apiInterest.interest_name === selectedInterest.interest_name
          );
        return matched?.id || selectedInterest.id;
      })
      .filter(Boolean); // Filter out any undefined/null values

    try {
      await updateUserInterests(interest_ids);
      await refetch();
      toast.success("Interests updated successfully", {
        description:
          "Your interests have been saved and will help personalize your experience.",
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Failed to update interests:", err);
      toast.error("Failed to update interests", {
        description:
          "Please try again. If the problem persists, contact support.",
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading interests...</p>;

  // Get interests for current category
  const currentInterests =
    interests.find((cat) => cat.interest_category === selectedCategory)
      ?.interests || [];

  return (
    <div className="min-w-5xl">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          {selected.length > 0
            ? "Edit or Add more of your Interests"
            : "Take another minute to tell us what interests you?"}
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          {selected.length > 0
            ? "Include your other interests and add them"
            : "Select at least 3 interests to help us personalize your experience"}
        </p>
        <div className="mt-3 sm:mt-4">
          <Badge variant="secondary" className="p-medium-12 sm:p-medium-14">
            {selected.length} selected
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {(showAllCategories
            ? interests
            : interests.slice(0, INITIAL_CATEGORIES_LIMIT)
          ).map((category) => (
            <Button
              key={category.interest_category}
              variant={
                selectedCategory === category.interest_category
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedCategory(category.interest_category)}
              className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              {category.interest_category}
            </Button>
          ))}
        </div>
        {interests.length > INITIAL_CATEGORIES_LIMIT && !showAllCategories && (
          <div className="text-center mt-3">
            <Button
              variant="ghost"
              onClick={() => setShowAllCategories(true)}
              className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            >
              Show more categories
            </Button>
          </div>
        )}
      </div>

      {/* Interest cards */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> {selectedCategory}{" "}
            Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {currentInterests.map((interest) => (
              <Button
                key={interest.id}
                variant={
                  selected.some(
                    (i) => i.interest_name === interest.interest_name
                  )
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleInterest(interest, selectedCategory)}
                className={`h-auto p-2 sm:p-3 lg:p-4 text-center transition-all duration-200 ${
                  selected.some(
                    (i) => i.interest_name === interest.interest_name
                  )
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="p-medium-10 sm:p-medium-12 lg:p-medium-14 text-wrap">
                  {interest.interest_name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selected.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Your Selected Interests
            </CardTitle>
            <p className="p-regular-14 text-muted-foreground text-center">
              Click on any interest to remove it
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {selected.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="p-medium-12 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() =>
                    toggleInterest(
                      { id: item.id, interest_name: item.interest_name },
                      item.interest_category
                    )
                  }
                >
                  {item.interest_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center mt-6 sm:mt-8">
        <Button
          onClick={handleSubmit}
          disabled={selected.length < 3}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Submit <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {selected.length < 3 && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-primary">
            Please select at least 3 interests to continue
          </p>
        </div>
      )}
    </div>
  );
}
