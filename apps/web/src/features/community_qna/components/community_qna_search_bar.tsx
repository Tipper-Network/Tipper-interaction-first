"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CommunityQNASearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

const CommunityQNASearchBar: React.FC<CommunityQNASearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClear,
}) => {
  return (
    <div className="relative w-full mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search questions, tags, or content..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 w-full"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default CommunityQNASearchBar;
