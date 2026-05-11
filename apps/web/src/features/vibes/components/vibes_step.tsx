"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { fetchVibesByCategory, VibeCategory } from "../api/vibes_api";
import { useAddVibeToCommunity } from "../hooks/vibes_hooks";
import { toast } from "sonner";

interface SelectedVibe {
  id: string;
  vibe_name: string;
  vibe_category?: string;
}

interface VibesStepProps {
  onComplete?: () => void;
  communityId: string;
  existingVibes?: SelectedVibe[];
}

export default function VibesStep({
  onComplete,
  communityId,
  existingVibes = [],
}: VibesStepProps) {
  const [vibes, setVibes] = useState<VibeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selected, setSelected] = useState<SelectedVibe[]>(existingVibes);
  const [isLoading, setIsLoading] = useState(true);

  const addVibeMutation = useAddVibeToCommunity(communityId);

  useEffect(() => {
    const loadVibes = async () => {
      try {
        const data = await fetchVibesByCategory();
        setVibes(data);
        setSelectedCategory(data[0]?.vibe_category || "");
      } catch (error) {
        console.error("Failed to fetch vibes:", error);
        toast.error("Failed to load vibes");
      } finally {
        setIsLoading(false);
      }
    };
    loadVibes();
  }, []);

  // Sync selected vibes when existingVibes changes
  useEffect(() => {
    if (existingVibes.length > 0 && vibes.length > 0) {
      const matchedVibes = existingVibes.map((existing) => {
        const matched = vibes
          .flatMap((cat) => cat.vibes)
          .find((apiVibe) => apiVibe.vibe_name === existing.vibe_name);

        return {
          ...existing,
          id: matched?.id || existing.id || String(Math.random()),
        };
      });
      setSelected(matchedVibes);
    } else if (existingVibes.length > 0) {
      setSelected(existingVibes);
    } else {
      setSelected([]);
    }
  }, [existingVibes, vibes]);

  const toggleVibe = (
    vibe: { id: string; vibe_name: string },
    category: string
  ) => {
    const isSelected = selected.some(
      (item) => item.vibe_name === vibe.vibe_name
    );

    if (isSelected) {
      setSelected(selected.filter((item) => item.vibe_name !== vibe.vibe_name));
    } else {
      setSelected([...selected, { ...vibe, vibe_category: category }]);
    }
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one vibe");
      return;
    }

    try {
      // Get correct IDs by matching vibe names with loaded vibes
      const vibe_ids = selected
        .map((selectedVibe) => {
          const matched = vibes
            .flatMap((cat) => cat.vibes)
            .find((apiVibe) => apiVibe.vibe_name === selectedVibe.vibe_name);
          return matched?.id || selectedVibe.id;
        })
        .filter(Boolean);

      // Add all selected vibes to the community
      const promises = vibe_ids.map((vibeId) =>
        addVibeMutation.mutateAsync({ vibe_id: vibeId })
      );

      await Promise.all(promises);

      toast.success("Vibes added successfully");
      if (onComplete) onComplete();
    } catch (error: any) {
      toast.error(error.message || "Failed to add vibes");
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading vibes...</p>;
  }

  // Get vibes for current category
  const currentCategoryVibes =
    vibes.find((cat) => cat.vibe_category === selectedCategory)?.vibes || [];

  return (
    <div className="min-w-5xl">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          {selected.length > 0
            ? "Edit or Add more Vibes"
            : "What vibes describe this community?"}
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          {selected.length > 0
            ? "Select vibes that best represent this community"
            : "Select vibes to help others understand the community atmosphere"}
        </p>
        <div className="mt-3 sm:mt-4">
          <Badge variant="secondary" className="p-medium-12 sm:p-medium-14">
            {selected.length} selected
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-1 sm:gap-2 justify-center">
        {vibes.map((category) => (
          <Button
            key={category.vibe_category}
            variant={
              selectedCategory === category.vibe_category
                ? "default"
                : "outline"
            }
            onClick={() => setSelectedCategory(category.vibe_category)}
            className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            {category.vibe_category}
          </Button>
        ))}
      </div>

      {/* Vibe cards */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> {selectedCategory}{" "}
            Vibes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {currentCategoryVibes.map((vibe) => (
              <Button
                key={vibe.id}
                variant={
                  selected.some((i) => i.vibe_name === vibe.vibe_name)
                    ? "default"
                    : "outline"
                }
                onClick={() => toggleVibe(vibe, selectedCategory)}
                className={`h-auto p-2 sm:p-3 lg:p-4 text-center transition-all duration-200 ${
                  selected.some((i) => i.vibe_name === vibe.vibe_name)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="p-medium-10 sm:p-medium-12 lg:p-medium-14 text-wrap">
                  {vibe.vibe_name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Vibes */}
      {selected.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Your Selected Vibes</CardTitle>
            <p className="p-regular-14 text-muted-foreground text-center">
              Click on any vibe to remove it
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
                    toggleVibe(
                      { id: item.id, vibe_name: item.vibe_name },
                      item.vibe_category || ""
                    )
                  }
                >
                  {item.vibe_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center mt-6 sm:mt-8">
        <Button
          onClick={handleSubmit}
          disabled={selected.length === 0 || addVibeMutation.isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {addVibeMutation.isPending ? "Adding..." : "Add Vibes"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {selected.length === 0 && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-primary">
            Please select at least one vibe to continue
          </p>
        </div>
      )}
    </div>
  );
}
