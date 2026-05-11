"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type SortOption = "newest" | "most_voted" | "most_answered" | "unanswered";

interface CommunityQNAFiltersProps {
  activeTags: string[];
  availableTags: string[];
  sortOption: SortOption;
  onTagToggle: (tag: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const CommunityQNAFilters: React.FC<CommunityQNAFiltersProps> = ({
  activeTags,
  availableTags,
  sortOption,
  onTagToggle,
  onSortChange,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "most_voted", label: "Most Voted" },
    { value: "most_answered", label: "Most Answered" },
    { value: "unanswered", label: "Unanswered" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Sort Dropdown */}
      <div className="relative">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <span>
            Sort: {sortOptions.find((o) => o.value === sortOption)?.label}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        {/* TODO: Add dropdown menu for sort options */}
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <>
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant={activeTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => onTagToggle(tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
        </>
      )}

      {/* Clear Active Filters */}
      {activeTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => activeTags.forEach((tag) => onTagToggle(tag))}
          className="text-xs text-muted-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default CommunityQNAFilters;
