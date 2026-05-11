"use client";

import { useUserInterests } from "../hooks/users_hooks";
import { Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

export const UserInterestsList = () => {
  const { data: interestsData, isLoading, error } = useUserInterests();
  const [isOpen, setIsOpen] = useState(false);

  const interests = useMemo(() => {
    if (!Array.isArray(interestsData)) return [];
    return interestsData.map((item: any) => ({
      id: item.interests?.id ?? Math.random(), // fallback key if missing
      interest_name: item.interests?.interest_name ?? "Unknown",
      interest_category: item.interests?.interest_category ?? "Other",
    }));
  }, [interestsData]);

  if (isLoading)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-muted rounded-full w-20"></div>
            <div className="h-8 bg-muted rounded-full w-24"></div>
            <div className="h-8 bg-muted rounded-full w-16"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <p className="p-medium-16 text-destructive">Error loading interests</p>
      </div>
    );

  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm pt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="h3-bold text-foreground">Interests</h3>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {interests.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from(
            new Set(interests.map((i: any) => i.interest_category))
          ).map((category) => (
            <div key={category} className="border-border border-b pb-4">
              <h4 className="p-medium-14 text-muted-foreground mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {interests
                  .filter((i) => i.interest_category === category)
                  .map((interest) => (
                    <div
                      key={interest.id}
                      className="group flex items-center gap-2 px-3 py-2 bg-muted/30 border border-border rounded-full hover:bg-muted/50 transition-colors"
                    >
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="p-medium-14 text-foreground text-wrap max-w-[200px]">
                        {interest.interest_name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="p-medium-16 text-muted-foreground mb-2">
            No interests added yet
          </p>
          <p className="p-regular-14 text-muted-foreground mb-4">
            Add your interests to connect with like-minded people
          </p>

          <Button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors p-medium-14"
          >
            Add Your First Interest
          </Button>
        </div>
      )}
    </div>
  );
};
