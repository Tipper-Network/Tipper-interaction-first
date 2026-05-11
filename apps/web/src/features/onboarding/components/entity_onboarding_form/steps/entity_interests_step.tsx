"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Globe } from "lucide-react";
import { fetchEntityInterests } from "@/features/onboarding/api/onboarding_api";
import { toast } from "sonner";

interface InterestCategory {
  interest_category: string;
  interests: { id: string; interest_name: string }[];
}

interface StepEntityInterestsProps {
  selected: string[];
  onChange: (val: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function StepEntityInterests({
  selected,
  onChange,
  onBack,
  onSubmit,
}: StepEntityInterestsProps) {
  const [interests, setInterests] = useState<InterestCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch interests once on mount
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const data = await fetchEntityInterests();
        setInterests(data);
        setSelectedCategory(data[0]?.interest_category || "");
      } catch (error) {
        console.error("Failed to fetch interests:", error);
        toast("Failed to load interests");
      } finally {
        setIsLoading(false);
      }
    };

    loadInterests();
  }, []);

  const toggleInterest = (interestId: string) => {
    if (selected.includes(interestId)) {
      onChange(selected.filter((id) => id !== interestId));
    } else {
      onChange([...selected, interestId]);
    }
  };

  if (isLoading) return <p className="text-center">Loading interests...</p>;

  const currentInterests =
    interests.find((cat) => cat.interest_category === selectedCategory)
      ?.interests || [];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          {selected.length > 0
            ? "Refine your projected expression"
            : "What image does your business project to the world?"}
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          {selected.length > 0
            ? "Add more elements that define how your business wants to be perceived"
            : "Select at least 3 expressions that represent what your business showcases to the world"}
        </p>
        <div className="mt-3 sm:mt-4">
          <Badge variant="secondary" className="p-medium-12 sm:p-medium-14">
            {selected.length} selected
          </Badge>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-wrap gap-1 sm:gap-2 justify-center">
        {interests.map((category) => (
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> {selectedCategory}{" "}
            Projected Expressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {currentInterests.map((interest) => {
              const isSelected = selected.includes(interest.id);
              return (
                <Button
                  key={interest.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleInterest(interest.id)}
                  className={`h-auto p-2 sm:p-3 lg:p-4 text-center transition-all duration-200 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="p-medium-10 sm:p-medium-12 lg:p-medium-14 text-wrap">
                    {interest.interest_name}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selected.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Your Projected Expressions
            </CardTitle>
            <p className="p-regular-14 text-muted-foreground text-center">
              Click on any expression to remove it
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {selected.map((id) => {
                const interest = interests
                  .flatMap((cat) => cat.interests)
                  .find((i) => i.id === id);
                if (!interest) return null;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="p-medium-12 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => toggleInterest(id)}
                  >
                    {interest.interest_name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          Back
        </Button>

        <Button
          onClick={onSubmit}
          disabled={selected.length < 3}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Complete Setup
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>

      {selected.length < 3 && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-primary">
            Please select at least 3 projected expressions to continue
          </p>
        </div>
      )}
    </div>
  );
}
